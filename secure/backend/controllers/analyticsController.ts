import { Request, Response } from 'express';
import Scan from '../models/Scan';
import Vulnerability from '../models/Vulnerability';

export const getOverviewStats = async (req: Request, res: Response) => {
  try {
    const totalScans = await Scan.countDocuments();
    const completedScans = await Scan.countDocuments({ status: 'completed' });
    const failedScans = await Scan.countDocuments({ status: 'failed' });

    const totalVulnerabilities = await Vulnerability.countDocuments();
    const criticalVulnerabilities = await Vulnerability.countDocuments({ severity: 'critical' });
    const highVulnerabilities = await Vulnerability.countDocuments({ severity: 'high' });
    const mediumVulnerabilities = await Vulnerability.countDocuments({ severity: 'medium' });
    const lowVulnerabilities = await Vulnerability.countDocuments({ severity: 'low' });

    // Aggregate average SAVE Score
    const saveAgg = await Vulnerability.aggregate([
      { $group: { _id: null, avgSaveScore: { $avg: "$saveScore" } } }
    ]);
    const avgSaveScore = saveAgg.length > 0 ? saveAgg[0].avgSaveScore : 0;

    return res.status(200).json({
      success: true,
      data: {
        scans: { total: totalScans, completed: completedScans, failed: failedScans },
        vulnerabilities: {
          total: totalVulnerabilities,
          critical: criticalVulnerabilities,
          high: highVulnerabilities,
          medium: mediumVulnerabilities,
          low: lowVulnerabilities
        },
        riskExposure: {
          averageSaveScore: avgSaveScore.toFixed(2),
          overallRisk: avgSaveScore > 75 ? 'CRITICAL' : avgSaveScore > 50 ? 'HIGH' : avgSaveScore > 25 ? 'MEDIUM' : 'LOW'
        }
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getSecurityScoreTrend = async (req: Request, res: Response) => {
    try {
        // Implementation for trend data (placeholder)
        res.status(200).json({ success: true, data: [] });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
