import Scan from "../backend/models/Scan";
import { runMalwareScan } from "../scanners/malwareScanner";
import { runNetworkScan } from "../scanners/networkScanner";
import { runWebScan } from "../scanners/webScanner";
import { emitEvent } from "../sockets";
import { binaryPulse, logScanEvent } from "../scanners/utils/scanLog";

export const processScanJob = async (data: any) => {
  const { scanId, type, target } = data;
  console.log(
    `[Processor] Processing scan ${scanId} of type ${type} for ${target}`,
  );
  let binaryTicker: NodeJS.Timeout | null = null;

  try {
    await Scan.findByIdAndUpdate(scanId, { status: "running" });
    emitEvent("scan_started", { scanId, target, type });
    await logScanEvent(scanId, "info", `Target accepted: ${target}`);
    await logScanEvent(
      scanId,
      "info",
      `Scan engine selected: ${type.toUpperCase()}`,
    );

    binaryTicker = setInterval(() => {
      void logScanEvent(scanId, "debug", `telemetry ${binaryPulse()}`);
    }, 900);

    let results = {};
    if (type === "web") {
      results = await runWebScan(target, scanId);
    } else if (type === "network") {
      results = await runNetworkScan(target, scanId);
    } else if (type === "malware") {
      results = await runMalwareScan(target, scanId);
    }

    await Scan.findByIdAndUpdate(scanId, {
      status: "completed",
      completedAt: new Date(),
      progress: 100,
      resultsSummary: results,
    });
    emitEvent("scan_completed", { scanId, target, results });
    await logScanEvent(scanId, "info", "Scan completed and results committed.");

    console.log(`[Processor] Scan ${scanId} completed successfully.`);
    return { success: true, results };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[Processor] Scan ${scanId} failed: ${message}`);
    try {
      await Scan.findByIdAndUpdate(scanId, { status: "failed" });
    } catch (e) {
      console.error("[Processor] Failed to update scan status to failed", e);
    }
    emitEvent("scan_failed", { scanId, target, error: message });
    await logScanEvent(scanId, "error", `Scan failed: ${message}`);
    throw error;
  } finally {
    if (binaryTicker) clearInterval(binaryTicker);
  }
};

export default processScanJob;
