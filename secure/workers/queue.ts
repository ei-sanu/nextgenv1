import { Queue } from 'bullmq';
import dotenv from 'dotenv';

dotenv.config();

const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

export const scanQueue = new Queue('scanQueue', {
  connection: redisOptions,
});

export const addScanToQueue = async (scanData: any) => {
  return await scanQueue.add('run_scan', scanData, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  });
};
