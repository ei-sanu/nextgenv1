import { Queue } from "bullmq";
import dotenv from "dotenv";
import net from "net";
import processScanJob from "./processor";

dotenv.config();

const redisOptions = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
};

let scanQueue: Queue | null = null;

const isRedisAvailable = async () => {
  return new Promise<boolean>((resolve) => {
    const socket = new net.Socket();
    const host = redisOptions.host as string;
    const port = redisOptions.port as number;
    let finished = false;

    socket.setTimeout(500);
    socket.once("connect", () => {
      finished = true;
      socket.destroy();
      resolve(true);
    });
    socket.once("timeout", () => {
      if (!finished) {
        finished = true;
        socket.destroy();
        resolve(false);
      }
    });
    socket.once("error", () => {
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
      scanQueue = new Queue("scanQueue", { connection: redisOptions });
      console.log("[Queue] Connected to Redis for job queueing");
    } else {
      console.warn(
        "[Queue] Redis not reachable, falling back to in-process queue",
      );
    }
  } catch (err: any) {
    console.warn(
      "[Queue] Error checking Redis reachability, falling back to in-process queue",
      err?.message || err,
    );
  }
})();

export const addScanToQueue = async (scanData: any) => {
  if (scanQueue) {
    return await scanQueue.add("run_scan", scanData, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
    });
  }

  // Fallback: process job immediately in-process
  console.log("[Queue] Processing job in-process (no Redis)");
  const result = await processScanJob(scanData);
  // Return a minimal job-like object so callers can continue to work
  return { id: `local-${Date.now()}`, data: scanData, result };
};

export { scanQueue };
