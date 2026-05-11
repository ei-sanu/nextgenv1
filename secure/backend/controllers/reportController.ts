import { Request, Response } from 'express';
import { generatePDFReport } from '../../reports/pdfGenerator';
import { generateJSONReport } from '../../reports/jsonGenerator';
import Report from '../models/Report';
import mongoose from 'mongoose';

export const exportReport = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const format = req.query.format as string; // ?format=pdf or ?format=json

    let filePath = '';
    
    if (format === 'pdf') {
      filePath = await generatePDFReport(id);
    } else if (format === 'json') {
      filePath = await generateJSONReport(id);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid format requested. Use ?format=pdf or ?format=json' });
    }

    // Save report generation log to DB
    await Report.create({
      scanId: new mongoose.Types.ObjectId(id),
      format: format as 'pdf' | 'json',
      fileUrl: filePath // In real app, this might be an S3 URL
    });

    return res.download(filePath, `report_${id}.${format}`);
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
