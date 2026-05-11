import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  scanId: mongoose.Types.ObjectId;
  generatedAt: Date;
  format: 'json' | 'pdf';
  fileUrl: string;
}

const ReportSchema: Schema = new Schema({
  scanId: { type: Schema.Types.ObjectId, ref: 'Scan', required: true },
  generatedAt: { type: Date, default: Date.now },
  format: { type: String, enum: ['json', 'pdf'], required: true },
  fileUrl: { type: String, required: true }
});

export default mongoose.model<IReport>('Report', ReportSchema);
