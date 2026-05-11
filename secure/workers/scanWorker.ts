import { Job, Worker } from 'bullmq';
import dotenv from 'dotenv';
import net from 'net';
import processScanJob from './processor';

dotenv.config();

const redisOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
};

let scanWorker: Worker | null = null;

const isRedisAvailable = async () => {
  return new Promise<boolean>((resolve) => {
    const socket = new net.Socket();
    const host = redisOptions.host as string;
    const port = redisOptions.port as number;
    let finished = false;

    socket.setTimeout(500);
    socket.once('connect', () => {
      finished = true;
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      if (!finished) {
        finished = true;
        socket.destroy();
        resolve(false);
      }
    });
    socket.once('error', () => {
      if (!finished) {
        finished = true;
        socket.destroy();
        resolve(false);
      }
    });
    socket.connect(port, host);
  });
};

(async () => {
  try {
    const ok = await isRedisAvailable();
    if (ok) {
      scanWorker = new Worker('scanQueue', async (job: Job) => {
        return await processScanJob(job.data);
      }, { connection: redisOptions });

      scanWorker.on('completed', (job) => {
        console.log(`[Worker] Job ${job.id} has completed!`);
      });

      scanWorker.on('failed', (job, err) => {
        console.log(`[Worker] Job ${job?.id} has failed with ${err.message}`);
      });
      console.log('[Worker] scanWorker started and connected to Redis');
    } else {
      console.warn('[Worker] Redis not reachable, running without bullmq worker. Falling back to in-process processing.');
    }
  } catch (err: any) {
    console.warn('[Worker] Error checking Redis reachability, running without bullmq worker', err?.message || err);
  }
})();

export { scanWorker };
