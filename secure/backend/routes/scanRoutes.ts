import { Router } from 'express';
import { startScan, getScans, getScanById, getVulnerabilities } from '../controllers/scanController';

const router = Router();

// Route to start a new scan
router.post('/start', startScan);

// Route to get all scans (history)
router.get('/', getScans);

// Route to get a specific scan by ID
router.get('/:id', getScanById);

// Route to get vulnerabilities for a specific scan
router.get('/:id/vulnerabilities', getVulnerabilities);

export default router;
