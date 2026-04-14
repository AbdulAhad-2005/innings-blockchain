import mongoose, { Schema, Document } from "mongoose";

export interface INFTCoupon extends Document {
  userId: mongoose.Types.ObjectId;
  brandId: mongoose.Types.ObjectId;
  metadataURI: string;
  tokenId: string;
  redeemed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NFTCouponSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "CustomerUser", required: true },
  brandId: { type: Schema.Types.ObjectId, ref: "BrandUser", required: true },
  metadataURI: { type: String, required: true },
  tokenId: { type: String, required: true },
  redeemed: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.NFTCoupon || mongoose.model<INFTCoupon>("NFTCoupon", NFTCouponSchema);
