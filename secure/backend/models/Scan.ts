import mongoose, { Schema, Document } from "mongoose";

export interface IScan extends Document {
  target: string;
  type: "web" | "network" | "malware";
  status: "pending" | "running" | "completed" | "failed";
  startedAt: Date;
  completedAt?: Date;
  userId: string;
  progress: number;
  resultsSummary?: any;
}

const ScanSchema: Schema = new Schema({
  target: { type: String, required: true },
  type: { type: String, enum: ["web", "network", "malware"], required: true },
  status: {
    type: String,
    enum: ["pending", "running", "completed", "failed"],
    default: "pending",
  },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  userId: { type: String, required: true },
  progress: { type: Number, default: 0 },
  resultsSummary: { type: Schema.Types.Mixed },
});

export default mongoose.model<IScan>("Scan", ScanSchema);
