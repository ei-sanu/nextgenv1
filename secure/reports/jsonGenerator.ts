import fs from 'fs';
import path from 'path';
import Scan from '../backend/models/Scan';
import Vulnerability from '../backend/models/Vulnerability';

export const generateJSONReport = async (scanId: string): Promise<string> => {
  const scan = await Scan.findById(scanId);
  if (!scan) throw new Error('Scan not found');

  const vulnerabilities = await Vulnerability.find({ scanId });

  const reportsDir = path.join(__dirname, '../../reports_output');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const filePath = path.join(reportsDir, `scan_report_${scanId}.json`);

  const reportData = {
    scanDetails: {
      target: scan.target,
      type: scan.type,
      status: scan.status,
      startedAt: scan.startedAt,
      completedAt: scan.completedAt,
      progress: scan.progress,
      summary: scan.resultsSummary
    },
    vulnerabilities: vulnerabilities.map(v => ({
      title: v.title,
      description: v.description,
      severity: v.severity,
      cvssScore: v.cvssScore,
      saveScore: v.saveScore,
      evidence: v.evidence,
      remediation: v.remediation,
      cve: v.cve,
      discoveredAt: v.discoveredAt
    }))
  };

  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(reportData, null, 2), (err) => {
      if (err) return reject(err);
      resolve(filePath);
    });
  });
};
