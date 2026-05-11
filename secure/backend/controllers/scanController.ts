import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Scan from '../models/Scan';
import Vulnerability from '../models/Vulnerability';
import Log from '../models/Log';
import { addScanToQueue } from '../../workers/queue';
import Joi from 'joi';

const scanSchema = Joi.object({
  target: Joi.string().required(),
  type: Joi.string().valid('web', 'network', 'malware').required(),
  userId: Joi.string().required() // usually from auth middleware
});

export const startScan = async (req: Request, res: Response) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Database is unavailable. Ensure MongoDB Atlas IP access is configured, then retry.'
      });
    }

    console.log('[Controller] startScan called with body:', req.body);
    const { error, value } = scanSchema.validate(req.body);
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });

    const newScan = await Scan.create({
      target: value.target,
      type: value.type,
      userId: value.userId,
      status: 'pending'
    });

    await addScanToQueue({
      scanId: newScan._id,
      target: value.target,
      type: value.type
    });

    console.log(`[Controller] Scan created ${newScan._id} type=${value.type} target=${value.target}`);

    return res.status(201).json({
      success: true,
      message: 'Scan started successfully',
      data: newScan
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getScans = async (req: Request, res: Response) => {
  try {
    const scans = await Scan.find().sort({ startedAt: -1 }).limit(100);
    return res.status(200).json({ success: true, data: scans });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getScanById = async (req: Request, res: Response) => {
  try {
    const scan = await Scan.findById(req.params.id);
    if (!scan) return res.status(404).json({ success: false, message: 'Scan not found' });
    return res.status(200).json({ success: true, data: scan });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getVulnerabilities = async (req: Request, res: Response) => {
  try {
    const vulns = await Vulnerability.find({ scanId: req.params.id });
    return res.status(200).json({ success: true, data: vulns });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ success: false, message });
  }
};

export const getScanLogs = async (req: Request, res: Response) => {
  try {
    const logs = await Log.find({ 'meta.scanId': req.params.id }).sort({ timestamp: 1 }).limit(1000);
    return res.status(200).json({ success: true, data: logs });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ success: false, message });
  }
};
