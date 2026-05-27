import { Router } from 'express';
import { getMyOrders, trackOrder } from '../controllers/order.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/my-orders', authenticateToken, getMyOrders);
router.get('/:id/track', authenticateToken, trackOrder);

export default router;
