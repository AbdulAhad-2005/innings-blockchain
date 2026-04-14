import mongoose, { Schema, Document } from "mongoose";

export interface IBrandUser extends Document {
  name: string;
  email: string;
  password: string;
  walletAddress?: string;
  balance: number;
  verificationStatus: "unverified" | "verified" | "revoked";
  verificationBadgeTokenId?: string;
  verificationBadgeAddress?: string;
  verifiedAt?: Date;
  verifiedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BrandUserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  walletAddress: { type: String },
  balance: { type: Number, default: 0, min: 0 },
  verificationStatus: {
    type: String,
    enum: ["unverified", "verified", "revoked"],
    default: "unverified",
  },
  verificationBadgeTokenId: { type: String },
  verificationBadgeAddress: { type: String },
  verifiedAt: { type: Date },
  verifiedBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
}, { timestamps: true });

export default mongoose.models.BrandUser || mongoose.model<IBrandUser>("BrandUser", BrandUserSchema);
