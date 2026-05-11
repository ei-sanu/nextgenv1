import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import Scan from '../backend/models/Scan';
import Vulnerability from '../backend/models/Vulnerability';

export const generatePDFReport = async (scanId: string): Promise<string> => {
  const scan = await Scan.findById(scanId);
  if (!scan) throw new Error('Scan not found');

  const vulnerabilities = await Vulnerability.find({ scanId });

  const reportsDir = path.join(__dirname, '../../reports_output');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const filePath = path.join(reportsDir, `scan_report_${scanId}.pdf`);
  const doc = new PDFDocument();
  const stream = fs.createWriteStream(filePath);

  return new Promise((resolve, reject) => {
    doc.pipe(stream);

    // Title
    doc.fontSize(24).text('Cybersecurity Scan Report', { align: 'center' });
    doc.moveDown();

    // Scan Details
    doc.fontSize(14).text(`Target: ${scan.target}`);
    doc.text(`Scan Type: ${scan.type.toUpperCase()}`);
    doc.text(`Status: ${scan.status}`);
    doc.text(`Date: ${scan.startedAt.toISOString()}`);
    doc.moveDown(2);

    // Summary
    doc.fontSize(18).text('Summary');
    doc.fontSize(12).text(`Total Vulnerabilities: ${vulnerabilities.length}`);
    if (scan.resultsSummary && scan.resultsSummary.severityBreakdown) {
      const breakdown = scan.resultsSummary.severityBreakdown;
      doc.text(`Critical: ${breakdown.critical || 0}`);
      doc.text(`High: ${breakdown.high || 0}`);
      doc.text(`Medium: ${breakdown.medium || 0}`);
      doc.text(`Low: ${breakdown.low || 0}`);
    }
    doc.moveDown(2);

    // Vulnerabilities
    doc.fontSize(18).text('Detailed Findings');
    doc.moveDown();

    vulnerabilities.forEach((vuln, index) => {
      doc.fontSize(14).text(`${index + 1}. ${vuln.title} [${vuln.severity.toUpperCase()}]`);
      doc.fontSize(10).text(`Description: ${vuln.description}`);
      doc.text(`CVSS Score: ${vuln.cvssScore}`);
      doc.text(`SAVE Score: ${vuln.saveScore}`);
      if (vuln.cve) doc.text(`CVE: ${vuln.cve}`);
      doc.text(`Evidence: ${vuln.evidence}`);
      doc.text(`Remediation: ${vuln.remediation}`);
      doc.moveDown();
    });

    doc.end();

    stream.on('finish', () => resolve(filePath));
    stream.on('error', (err) => reject(err));
  });
};
