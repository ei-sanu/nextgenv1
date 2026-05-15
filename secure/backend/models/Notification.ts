import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId: string;
  type: "info" | "alert" | "success" | "error";
  message: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  type: {
    type: String,
    enum: ["info", "alert", "success", "error"],
    default: "info",
    index: true,
  },
  message: { type: String, required: true },
  read: { type: Boolean, default: false, index: true },
  createdAt: { type: Date, default: Date.now, index: { expires: "60d" } },
});

export default mongoose.model<INotification>(
  "Notification",
  NotificationSchema,
);
