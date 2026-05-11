import { emitEvent } from '../sockets';
import Vulnerability from '../backend/models/Vulnerability';
import { calculateCVSS, calculateSAVE } from '../backend/utils/scoring';
import { runNmapScan } from './network/nmap';
import logger from '../backend/utils/logger';

export const runNetworkScan = async (target: string, scanId: string) => {
  logger.info(`[NetworkScanner] Initiating real network scan for ${target}`);
  emitEvent('scan_progress', { scanId, progress: 10, message: `Starting Nmap port scanning on ${target}` });

  try {
    // Determine IP or hostname formatting
    const parsedTarget = target.replace(/^https?:\/\//, '').split('/')[0];
    
    // Execute real Nmap scan
    const nmapResults = await runNmapScan(parsedTarget);
    emitEvent('scan_progress', { scanId, progress: 80, message: `Nmap scanning completed. Found ${nmapResults.length} potential issues.` });

    let severityBreakdown = { critical: 0, high: 0, medium: 0, low: 0 };

    for (const vuln of nmapResults) {
      const severityLower = vuln.severity.toLowerCase();
      if (['critical', 'high', 'medium', 'low'].includes(severityLower)) {
        severityBreakdown[severityLower as keyof typeof severityBreakdown]++;
      } else {
        severityBreakdown.low++;
      }

      const newVuln = {
        scanId,
        title: vuln.title,
        description: vuln.description,
        severity: severityLower,
        cvssScore: calculateCVSS(severityLower),
        saveScore: calculateSAVE(severityLower),
        evidence: vuln.evidence,
        remediation: vuln.remediation,
      };

      await Vulnerability.create(newVuln);
      emitEvent('vulnerability_detected', { scanId, vulnerability: newVuln });
    }

    emitEvent('scan_progress', { scanId, progress: 100, message: `Network scan finalization complete.` });

    return {
      totalVulnerabilities: nmapResults.length,
      severityBreakdown,
      message: 'Network scan completed successfully using Nmap engine.'
    };
  } catch (error: any) {
    logger.error(`[NetworkScanner] Error scanning ${target}: ${error.message}`);
    throw new Error(`Network scanning failed: ${error.message}`);
  }
};
