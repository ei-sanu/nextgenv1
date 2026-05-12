import mongoose, { Schema, Document } from "mongoose";

export interface IAgent extends Document {
  agentId: string;
  name: string;
  ipAddress: string;
  status: "online" | "offline" | "scanning";
  lastSeen: Date;
  capabilities: string[];
}

const AgentSchema: Schema = new Schema({
  agentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  ipAddress: { type: String, required: true },
  status: {
    type: String,
    enum: ["online", "offline", "scanning"],
    default: "offline",
  },
  lastSeen: { type: Date, default: Date.now },
  capabilities: { type: [String], default: [] },
});

export default mongoose.model<IAgent>("Agent", AgentSchema);
