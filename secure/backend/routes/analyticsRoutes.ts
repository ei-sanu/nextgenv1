import { Router } from 'express';
import { getOverviewStats, getSecurityScoreTrend } from '../controllers/analyticsController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/overview', getOverviewStats);
router.get('/trends', getSecurityScoreTrend);

export default router;
