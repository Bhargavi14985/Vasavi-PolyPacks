import { Request, Response } from 'express';
import { PrismaClient } from '../db/mongodb';
import { AuthenticatedRequest } from '../middleware/auth';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'vasavi_polypacks_ultra_secret_key_for_jwt_auth_2026';

export const calculatePricingDetails = (data: {
  bagType: string;
  width: number;
  height: number;
  gusset: number;
  quantity: number;
  printingColors: number;
  gsm: number;
  liner: boolean;
  handles: boolean;
  perforations: boolean;
}) => {
  const { bagType, width, height, gusset, quantity, printingColors, gsm, liner, handles, perforations } = data;

  const widthMeters = ((width + gusset) * 2) / 100;
  const heightMeters = height / 100;
  const areaSqMeters = widthMeters * heightMeters;
  
  const bagWeightGrams = areaSqMeters * gsm;
  const bagWeightKg = bagWeightGrams / 1000;

  const ppRatePerKg = 135;
  let baseFabricCost = bagWeightKg * ppRatePerKg;

  const isBoxBottom = bagType === 'BOX_BOTTOM' || bagType === 'CEM_BAG';
  if (isBoxBottom) {
    baseFabricCost *= 1.15;
  }

  const isBOPP = ['BOPP_LAMINATED', 'RICE_BAG', 'DAL_BAG', 'FLOUR_BAG', 'CEM_BAG', 'GENERAL_PACKAGING'].includes(bagType);
  let laminationCost = 0;
  if (isBOPP) {
    laminationCost = areaSqMeters * 12;
  }

  const printingInkCost = printingColors * 0.35;
  
  const setupFeePerColor = isBOPP ? 5500 : 2500;
  const cylinderSetupFee = printingColors * setupFeePerColor;

  let fabricationCost = 1.80;
  if (liner) fabricationCost += 3.50;
  if (handles) fabricationCost += 2.80;
  if (perforations) fabricationCost += 0.30;

  const baseUnitPrice = baseFabricCost + laminationCost + printingInkCost + fabricationCost;

  let discountPercentage = 0;
  if (quantity >= 100000) {
    discountPercentage = 0.20;
  } else if (quantity >= 50000) {
    discountPercentage = 0.15;
  } else if (quantity >= 25000) {
    discountPercentage = 0.10;
  } else if (quantity >= 10000) {
    discountPercentage = 0.05;
  }

  const finalUnitPrice = baseUnitPrice * (1 - discountPercentage);
  
  let estimatedDays = 15;
  if (quantity > 100000) estimatedDays = 25;
  else if (quantity > 50000) estimatedDays = 20;

  const minUnitPrice = Number((finalUnitPrice * 0.95).toFixed(2));
  const maxUnitPrice = Number((finalUnitPrice * 1.05).toFixed(2));

  return {
    breakdown: {
      baseFabricCost: Number(baseFabricCost.toFixed(2)),
      laminationCost: Number(laminationCost.toFixed(2)),
      printingInkCost: Number(printingInkCost.toFixed(2)),
      fabricationCost: Number(fabricationCost.toFixed(2)),
      cylinderSetupFee
    },
    specs: {
      bagWeightGrams: Number(bagWeightGrams.toFixed(1)),
      discountApplied: `${discountPercentage * 100}%`,
      leadTimeDays: estimatedDays
    },
    unitPriceRange: {
      min: minUnitPrice,
      max: maxUnitPrice
    },
    estimatedTotalRange: {
      min: Math.round(minUnitPrice * quantity),
      max: Math.round(maxUnitPrice * quantity)
    }
  };
};

// ── Telegram Notification Helper ─────────────────────────────────────────────
const sendTelegramNotification = async (message: string): Promise<void> => {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    const https = await import('https');
    const body = JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' });

    await new Promise<void>((resolve, reject) => {
      const req = https.request(
        {
          hostname: 'api.telegram.org',
          path: `/bot${token}/sendMessage`,
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
        },
        (res) => { res.resume(); resolve(); }
      );
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  } catch (err) {
    console.error('Telegram notification failed:', err);
  }
};

export const createQuote = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      bagType,
      width,
      height,
      gusset,
      quantity,
      printingColors,
      gsm,
      liner,
      handles,
      perforations,
      bagConfigId
    } = req.body;

    if (!name || !email || !phone || !quantity || !bagType || !width || !height) {
      return res.status(400).json({ error: true, message: 'Missing required customer or packaging inputs.' });
    }

    let loggedUserId: string | null = null;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        loggedUserId = decoded.id;
      } catch (err) {
        // ignore
      }
    }

    const calculations = calculatePricingDetails({
      bagType,
      width: Number(width),
      height: Number(height),
      gusset: Number(gusset || 0),
      quantity: Number(quantity),
      printingColors: Number(printingColors || 0),
      gsm: Number(gsm || 70),
      liner: !!liner,
      handles: !!handles,
      perforations: !!perforations
    });

    const quote = await prisma.quote.create({
      data: {
        userId: loggedUserId,
        name,
        email,
        phone,
        company,
        quantity: Number(quantity),
        materialType: bagType,
        dimensions: `${width}x${height}x${gusset || 0} cm`,
        printingColors: Number(printingColors || 0),
        bagSpecs: JSON.stringify({
          gsm: Number(gsm || 70),
          liner: !!liner,
          handles: !!handles,
          perforations: !!perforations,
          breakdown: calculations.breakdown,
          specs: calculations.specs
        }),
        estimatedMinPrice: calculations.estimatedTotalRange.min,
        estimatedMaxPrice: calculations.estimatedTotalRange.max,
        status: 'PENDING',
        bagConfigId: bagConfigId || null
      }
    });

    // ── Send Telegram Notification ────────────────────────────────────────────
    const discount = calculations.specs.discountApplied !== '0%'
      ? `\n🏷️ <b>Discount Applied:</b> ${calculations.specs.discountApplied}` : '';

    const telegramMsg = `
🆕 <b>New B2B Quote Request!</b>
─────────────────────────
👤 <b>Name:</b> ${name}
🏢 <b>Company:</b> ${company || 'N/A'}
📱 <b>Phone:</b> ${phone}
📧 <b>Email:</b> ${email}
─────────────────────────
📦 <b>Bag Type:</b> ${bagType.replace(/_/g, ' ')}
📐 <b>Dimensions:</b> ${width}×${height}×${gusset || 0} cm
🔢 <b>Quantity:</b> ${Number(quantity).toLocaleString()} bags
🎨 <b>Print Colors:</b> ${printingColors || 0}
⚖️ <b>GSM:</b> ${gsm || 70}${discount}
─────────────────────────
💰 <b>Est. Range:</b> ₹${calculations.estimatedTotalRange.min.toLocaleString()} – ₹${calculations.estimatedTotalRange.max.toLocaleString()}
⏱️ <b>Lead Time:</b> ${calculations.specs.leadTimeDays} days
🆔 <b>Ref ID:</b> <code>${quote.id.slice(0, 8).toUpperCase()}</code>
    `.trim();

    sendTelegramNotification(telegramMsg); // fire-and-forget

    res.status(201).json({
      message: 'Quotation generated and saved successfully.',
      quote,
      calculations
    });
  } catch (error: any) {
    console.error('CreateQuote error:', error);
    res.status(500).json({ error: true, message: error.message || 'Failed to generate quote.' });
  }
};


export const getMyQuotes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: true, message: 'Unauthorized' });
    }

    const quotes = await prisma.quote.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        bagConfig: true,
        orders: true
      }
    });

    res.status(200).json({ quotes });
  } catch (error: any) {
    console.error('GetMyQuotes error:', error);
    res.status(500).json({ error: true, message: error.message || 'Failed to fetch quotes.' });
  }
};
