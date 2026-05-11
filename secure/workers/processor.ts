import Scan from '../backend/models/Scan';
import { runMalwareScan } from '../scanners/malwareScanner';
import { runNetworkScan } from '../scanners/networkScanner';
import { runWebScan } from '../scanners/webScanner';
import { emitEvent } from '../sockets';

export const processScanJob = async (data: any) => {
    const { scanId, type, target } = data;
    console.log(`[Processor] Processing scan ${scanId} of type ${type} for ${target}`);

    try {
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

        console.log(`[Processor] Scan ${scanId} completed successfully.`);
        return { success: true, results };
    } catch (error: any) {
        console.error(`[Processor] Scan ${scanId} failed: ${error?.message || error}`);
        try {
            await Scan.findByIdAndUpdate(scanId, { status: 'failed' });
        } catch (e) {
            console.error('[Processor] Failed to update scan status to failed', e);
        }
        emitEvent('scan_failed', { scanId, target, error: error?.message || String(error) });
        throw error;
    }
};

export default processScanJob;
