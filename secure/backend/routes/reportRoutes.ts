import { Router } from 'express';
import { exportReport } from '../controllers/reportController';

const router = Router();

// Route to export report
router.get('/:id/export', exportReport);

export default router;
