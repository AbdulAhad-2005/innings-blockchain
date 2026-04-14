import mongoose, { Schema, Document } from "mongoose";

export interface IQuiz extends Document {
  matchId: mongoose.Types.ObjectId;
  brandId: mongoose.Types.ObjectId;
  budget: number;
  rewardCount?: number;
  blockchainCampaignId?: number;
  commitmentTxHash?: string;
  commitmentProofAddress?: string;
  statusTxHash?: string;
  adImages: string[];
  startTime: Date;
  endTime: Date;
  status:
    | "bid_pending"
    | "approved"
    | "rejected"
    | "draft"
    | "scheduled"
    | "active"
    | "completed"
    | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema: Schema = new Schema({
  matchId: { type: Schema.Types.ObjectId, ref: "Match", required: true },
  brandId: { type: Schema.Types.ObjectId, ref: "BrandUser", required: true },
  budget: { type: Number, required: true },
  rewardCount: { type: Number, min: 0 },
  blockchainCampaignId: { type: Number },
  commitmentTxHash: { type: String },
  commitmentProofAddress: { type: String },
  statusTxHash: { type: String },
  adImages: { type: [String], default: [] },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: {
    type: String,
    required: true,
    enum: [
      "bid_pending",
      "approved",
      "rejected",
      "draft",
      "scheduled",
      "active",
      "completed",
      "cancelled",
    ],
    default: "bid_pending",
  },
}, { timestamps: true });

export default mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);
