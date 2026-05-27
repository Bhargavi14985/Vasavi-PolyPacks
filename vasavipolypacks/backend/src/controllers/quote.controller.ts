import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'vasavi_polypacks_ultra_secret_key_for_jwt_auth_2026';

// Helper to calculate pricing
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

  // 1. Calculate Area & Weight
  // Total circumference width is (width + gusset) * 2
  const widthMeters = ((width + gusset) * 2) / 100;
  const heightMeters = height / 100;
  const areaSqMeters = widthMeters * heightMeters;
  
  // Fabric weight per bag in grams
  const bagWeightGrams = areaSqMeters * gsm;
  const bagWeightKg = bagWeightGrams / 1000;

  // 2. Base Fabric Cost
  // Raw PP Granules cost is roughly ₹135 per kg
  const ppRatePerKg = 135;
  let baseFabricCost = bagWeightKg * ppRatePerKg;

  // 3. Add Premium Material adjustments
  if (bagType === 'BOX_BOTTOM') {
    baseFabricCost *= 1.15; // 15% structural complexity charge
  }

  // 4. Lamination Cost
  let laminationCost = 0;
  if (bagType === 'BOPP_LAMINATED') {
    // Gravure lamination adds roughly ₹12 per sq. meter (BOPP Film + Glue)
    laminationCost = areaSqMeters * 12;
  }

  // 5. Printing Cost
  // Ink cost: ₹0.35 per color per bag
  const printingInkCost = printingColors * 0.35;
  
  // One-time cylinder/plate engraving setup fee (B2B standard)
  // Flexo plates = ₹2,500/color, Gravure cylinders = ₹5,500/color
  const setupFeePerColor = bagType === 'BOPP_LAMINATED' ? 5500 : 2500;
  const cylinderSetupFee = printingColors * setupFeePerColor;

  // 6. Stitching & Custom Additions
  let fabricationCost = 1.80; // base stitch cost
  if (liner) fabricationCost += 3.50; // extra cost for PE liner insertion
  if (handles) fabricationCost += 2.80; // heat-sealed PP handles
  if (perforations) fabricationCost += 0.30; // perforation punching cost

  // 7. Base Unit Price before volume discount
  const baseUnitPrice = baseFabricCost + laminationCost + printingInkCost + fabricationCost;

  // 8. Bulk Sliding Scale Volume Discount
  let discountPercentage = 0;
  if (quantity >= 100000) {
    discountPercentage = 0.20; // 20% off
  } else if (quantity >= 50000) {
    discountPercentage = 0.15; // 15% off
  } else if (quantity >= 25000) {
    discountPercentage = 0.10; // 10% off
  } else if (quantity >= 10000) {
    discountPercentage = 0.05; // 5% off
  }

  const finalUnitPrice = baseUnitPrice * (1 - discountPercentage);
  const subtotal = finalUnitPrice * quantity;
  
  // Estimated production duration in days
  let estimatedDays = 15;
  if (quantity > 100000) estimatedDays = 25;
  else if (quantity > 50000) estimatedDays = 20;

  // Return formatted price objects
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

    // Decode token if present in headers (allows linking quote to active session)
    let loggedUserId: string | null = null;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        loggedUserId = decoded.id;
      } catch (err) {
        // ignore invalid token, process as guest quote
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
