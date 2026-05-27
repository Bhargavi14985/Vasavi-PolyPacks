import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getMyOrders = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: true, message: 'Unauthorized' });
    }

    const orders = await prisma.order.findMany({
      where: {
        quote: {
          userId: req.user.id
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        quote: {
          include: {
            bagConfig: true
          }
        }
      }
    });

    res.status(200).json({ orders });
  } catch (error: any) {
    console.error('GetMyOrders error:', error);
    res.status(500).json({ error: true, message: error.message || 'Failed to fetch orders.' });
  }
};

export const trackOrder = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        quote: {
          include: {
            bagConfig: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: true, message: 'Order not found.' });
    }

    if (req.user?.role !== 'ADMIN' && order.quote.userId !== req.user?.id) {
      return res.status(403).json({ error: true, message: 'Access denied to this order detail.' });
    }

    const stages = [
      { key: 'PENDING', label: 'Order Confirmed', description: 'Order logged and contract finalized.', progress: 10 },
      { key: 'PLATES_DESIGN', label: 'Cylinder / Plate Design', description: 'Artwork prepared and printing cylinders engraved.', progress: 25 },
      { key: 'EXTRUSION', label: 'Granule Extrusion', description: 'Polypropylene tape extrusion and spool winding.', progress: 40 },
      { key: 'WEAVING', label: 'PP Woven Looms', description: 'Looms weaving spool tapes into high-strength fabric rolls.', progress: 55 },
      { key: 'PRINTING', label: 'High-Speed Printing', description: 'Applying multi-color designs on woven fabric or BOPP film.', progress: 70 },
      { key: 'LAMINATION', label: 'BOPP / Film Lamination', description: 'Bonding printed film layer to the woven fabric.', progress: 80 },
      { key: 'STITCHING', label: 'Stitching & Bag Making', description: 'Cutting, gusseting, inserting liner, and base stitching.', progress: 90 },
      { key: 'QUALITY_CHECK', label: 'Quality Assurance Testing', description: 'Drop tests, seam strength audit, and density inspection.', progress: 95 },
      { key: 'DISPATCHED', label: 'Dispatched / Export logistics', description: 'Bags baled, loaded on shipping container, or dispatched.', progress: 100 }
    ];

    const currentStageIndex = stages.findIndex(s => s.key === order.status);
    
    res.status(200).json({
      orderNumber: order.orderNumber,
      totalQuantity: order.totalQuantity,
      status: order.status,
      estDeliveryDate: order.estDeliveryDate,
      createdAt: order.createdAt,
      specs: order.quote.dimensions,
      material: order.quote.materialType,
      currentStageIndex,
      stages: stages.map((stage, idx) => ({
        ...stage,
        isCompleted: idx <= currentStageIndex,
        isActive: idx === currentStageIndex
      }))
    });
  } catch (error: any) {
    console.error('TrackOrder error:', error);
    res.status(500).json({ error: true, message: error.message || 'Failed to track order.' });
  }
};
