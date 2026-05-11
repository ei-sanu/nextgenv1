import { Router } from 'express';
import { generatePDF, generateJSON } from '../controllers/reportController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/:id/pdf', generatePDF);
router.get('/:id/json', generateJSON);

export default router;
