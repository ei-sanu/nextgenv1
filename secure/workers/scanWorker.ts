import { Worker, Job } from 'bullmq';
import dotenv from 'dotenv';
import { runWebScan } from '../scanners/webScanner';
import { runNetworkScan } from '../scanners/networkScanner';
import { runMalwareScan } from '../scanners/malwareScanner';
import Scan from '../backend/models/Scan';
import { emitEvent } from '../sockets';

dotenv.config();

const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const scanWorker = new Worker('scanQueue', async (job: Job) => {
  const { scanId, type, target } = job.data;
  console.log(`[Worker] Starting scan ${scanId} of type ${type} for ${target}`);

  try {
    // Update scan status
    await Scan.findByIdAndUpdate(scanId, { status: 'running' });
    emitEvent('scan_started', { scanId, target, type });

    let results = {};
    if (type === 'web') {
      results = await runWebScan(target, scanId);
    } else if (type === 'network') {
      results = await runNetworkScan(target, scanId);
    } else if (type === 'malware') {
      results = await runMalwareScan(target, scanId);
    }

    await Scan.findByIdAndUpdate(scanId, {
      status: 'completed',
      completedAt: new Date(),
      progress: 100,
      resultsSummary: results,
    });
    emitEvent('scan_completed', { scanId, target, results });

    console.log(`[Worker] Scan ${scanId} completed successfully.`);
  } catch (error: any) {
    console.error(`[Worker] Scan ${scanId} failed: ${error.message}`);
    await Scan.findByIdAndUpdate(scanId, { status: 'failed' });
    emitEvent('scan_failed', { scanId, target, error: error.message });
    throw error;
  }
}, { connection: redisOptions });

scanWorker.on('completed', (job) => {
  console.log(`[Worker] Job ${job.id} has completed!`);
});

scanWorker.on('failed', (job, err) => {
  console.log(`[Worker] Job ${job?.id} has failed with ${err.message}`);
});
