import { Router } from 'express';
import {
  getDashboardMetrics,
  getAllQuotes,
  updateQuoteStatus,
  getAllOrders,
  updateOrderStatus,
  getAllLeads,
  updateLeadStatus
} from '../controllers/admin.controller';
import { requireAdmin } from '../middleware/auth';

const router = Router();

// Secure all admin routes with requireAdmin middleware
router.use(requireAdmin);

router.get('/metrics', getDashboardMetrics);

router.get('/quotes', getAllQuotes);
router.put('/quotes/:id', updateQuoteStatus);

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

router.get('/leads', getAllLeads);
router.put('/leads/:id', updateLeadStatus);

export default router;
