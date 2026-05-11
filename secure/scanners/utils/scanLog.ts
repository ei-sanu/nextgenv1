import Log from '../../backend/models/Log';
import { emitEvent } from '../../sockets';

type ScanLogLevel = 'info' | 'warn' | 'error' | 'debug';

const randomBinaryWord = (length = 8): string => {
  let bits = '';
  for (let i = 0; i < length; i++) {
    bits += Math.random() > 0.5 ? '1' : '0';
  }
  return bits;
};

export const binaryPulse = (): string => {
  return `${randomBinaryWord(8)} ${randomBinaryWord(8)} ${randomBinaryWord(8)} ${randomBinaryWord(8)}`;
};

export const logScanEvent = async (
  scanId: string,
  level: ScanLogLevel,
  message: string,
  meta: Record<string, unknown> = {}
) => {
  const payload = {
    scanId,
    level,
    message,
    meta,
    timestamp: new Date().toISOString()
  };

  await Log.create({
    level,
    message,
    meta: { scanId, ...meta },
    timestamp: new Date()
  });

  emitEvent('scan_log', payload);
};
