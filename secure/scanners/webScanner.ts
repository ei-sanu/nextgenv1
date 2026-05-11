import { emitEvent } from '../sockets';
import Vulnerability from '../backend/models/Vulnerability';
import { calculateCVSS, calculateSAVE } from '../backend/utils/scoring';
import { runNucleiScan } from './web/nuclei';
import logger from '../backend/utils/logger';

export const runWebScan = async (target: string, scanId: string) => {
  logger.info(`[WebScanner] Initiating real web scan for ${target}`);
  emitEvent('scan_progress', { scanId, progress: 10, message: `Starting Nuclei vulnerability scanning on ${target}` });

  try {
    // Ensure target has http/https protocol
    let formattedTarget = target;
    if (!/^https?:\/\//i.test(formattedTarget)) {
      formattedTarget = `https://${formattedTarget}`;
    }

    // Execute real Nuclei scan
    const nucleiResults = await runNucleiScan(formattedTarget);
    emitEvent('scan_progress', { scanId, progress: 80, message: `Nuclei scanning completed. Found ${nucleiResults.length} potential issues.` });

    let severityBreakdown = { critical: 0, high: 0, medium: 0, low: 0 };

    for (const vuln of nucleiResults) {
      let severityLower = vuln.severity.toLowerCase();
      // Handle info/unknown severities by mapping to low
      if (!['critical', 'high', 'medium', 'low'].includes(severityLower)) {
        severityLower = 'low';
      }

      severityBreakdown[severityLower as keyof typeof severityBreakdown]++;

      const newVuln = {
        scanId,
        title: vuln.title,
        description: vuln.description,
        severity: severityLower,
        cvssScore: calculateCVSS(severityLower),
        saveScore: calculateSAVE(severityLower),
        evidence: vuln.evidence,
        remediation: vuln.remediation,
        cve: vuln.cve
      };

      await Vulnerability.create(newVuln);
      emitEvent('vulnerability_detected', { scanId, vulnerability: newVuln });
    }

    emitEvent('scan_progress', { scanId, progress: 100, message: `Web scan finalization complete.` });

    return {
      totalVulnerabilities: nucleiResults.length,
      severityBreakdown,
      message: 'Web scan completed successfully using Nuclei engine.'
    };
  } catch (error: any) {
    logger.error(`[WebScanner] Error scanning ${target}: ${error.message}`);
    throw new Error(`Web scanning failed: ${error.message}`);
  }
};
