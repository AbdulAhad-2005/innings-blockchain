import mongoose, { Schema, Document } from "mongoose";

export interface IRewardRedemption extends Document {
  userId: mongoose.Types.ObjectId;
  rewardId: mongoose.Types.ObjectId;
  pointsSpent: number;
  redeemedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RewardRedemptionSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "CustomerUser", required: true },
  rewardId: { type: Schema.Types.ObjectId, ref: "Reward", required: true },
  pointsSpent: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.RewardRedemption || mongoose.model<IRewardRedemption>("RewardRedemption", RewardRedemptionSchema);
