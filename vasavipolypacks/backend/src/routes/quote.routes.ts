import { Router } from 'express';
import { createQuote, getMyQuotes } from '../controllers/quote.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', createQuote);
router.get('/my-quotes', authenticateToken, getMyQuotes);

export default router;
