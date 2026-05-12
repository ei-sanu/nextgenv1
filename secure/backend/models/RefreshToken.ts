import mongoose, { Schema, Document } from "mongoose";

export interface IRefreshToken extends Document {
  user: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdByIp: string;
  revokedAt?: Date;
  revokedByIp?: string;
  replacedByToken?: string;
  isActive: boolean;
  isExpired: boolean;
}

const RefreshTokenSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdByIp: { type: String, required: true },
    revokedAt: { type: Date },
    revokedByIp: { type: String },
    replacedByToken: { type: String },
  },
  { timestamps: true },
);

RefreshTokenSchema.virtual("isExpired").get(function (this: IRefreshToken) {
  return new Date() >= this.expiresAt;
});

RefreshTokenSchema.virtual("isActive").get(function (this: IRefreshToken) {
  return !this.revokedAt && !this.isExpired;
});

RefreshTokenSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.id;
    delete ret.user;
  },
});

export default mongoose.model<IRefreshToken>(
  "RefreshToken",
  RefreshTokenSchema,
);
