import { Router } from 'express';
import { getAnalytics } from '../controllers/analyticsController';

const router = Router();

// Route to fetch system-wide analytics and risk exposure
router.get('/', getAnalytics);

export default router;
