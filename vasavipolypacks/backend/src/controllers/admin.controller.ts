import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth';

const prisma = new PrismaClient();

// Get general dashboard statistics
export const getDashboardMetrics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const totalLeads = await prisma.lead.count();
    const pendingQuotes = await prisma.quote.count({ where: { status: 'PENDING' } });
    const convertedQuotes = await prisma.quote.count({ where: { status: 'CONVERTED' } });
    const activeOrders = await prisma.order.count({
      where: {
        NOT: { status: 'DISPATCHED' }
      }
    });

    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Calculate quote value aggregates
    const quoteAggr = await prisma.quote.aggregate({
      _avg: {
        estimatedMinPrice: true,
        estimatedMaxPrice: true
      },
      _sum: {
        quantity: true
      }
    });

    // Mock live factory inventory
    const inventory = {
      rawPPGranulesTons: 42.5,
      boppLaminationFilmKg: 3400,
      wovenLoomsFabricMeters: 18500,
      inkContainersCount: 82,
      stitchedBagsInStock: 75000,
      rawGrades: [
        { grade: 'PP Raffia Grade', stock: 25.0, status: 'OPTIMAL' },
        { grade: 'BOPP High Gloss Film', stock: 12.0, status: 'REORDER_WARN' },
        { grade: 'HDPE Liner Roll', stock: 5.5, status: 'OPTIMAL' }
      ]
    };

    res.status(200).json({
      metrics: {
        totalLeads,
        pendingQuotes,
        convertedQuotes,
        activeOrders,
        avgQuotePrice: Math.round(((quoteAggr._avg.estimatedMinPrice || 0) + (quoteAggr._avg.estimatedMaxPrice || 0)) / 2),
        totalBagsOrdered: quoteAggr._sum.quantity || 0
      },
      recentQuotes: quotes,
      recentLeads: leads,
      inventory
    });
  } catch (error: any) {
    console.error('GetDashboardMetrics error:', error);
    res.status(500).json({ error: true, message: error.message || 'Failed to fetch metrics.' });
  }
};

// Quote Management
export const getAllQuotes = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        bagConfig: true
      }
    });
    res.status(200).json({ quotes });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Failed to fetch all quotes.' });
  }
};

export const updateQuoteStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // PENDING, REVIEWED, CONVERTED, CLOSED

    const updated = await prisma.quote.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({ message: 'Quote status updated.', quote: updated });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Failed to update quote status.' });
  }
};

// Order Management (Production Control)
export const getAllOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { estDeliveryDate: 'asc' },
      include: {
        quote: true
      }
    });
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Failed to fetch all orders.' });
  }
};

export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // e.g. PENDING, PLATES_DESIGN, EXTRUSION, etc.

    const updated = await prisma.order.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({ message: 'Order production stage updated.', order: updated });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Failed to update order status.' });
  }
};

// General Lead Management
export const getAllLeads = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ leads });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Failed to fetch all leads.' });
  }
};

export const updateLeadStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // NEW, CONTACTED, ARCHIVED

    const updated = await prisma.lead.update({
      where: { id },
      data: { status }
    });

    res.status(200).json({ message: 'Lead status updated.', lead: updated });
  } catch (error) {
    res.status(500).json({ error: true, message: 'Failed to update lead status.' });
  }
};
