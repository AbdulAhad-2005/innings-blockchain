import { Schema, model, models, type Document } from "mongoose"

export interface IRewardRedemption extends Document {
  userId: Schema.Types.ObjectId
  rewardId: Schema.Types.ObjectId
  pointsSpent: number
  nftTokenId?: string
  nftTxHash?: string
  nftContractAddress?: string
  redeemedAt: Date
  createdAt: Date
  updatedAt: Date
}

const RewardRedemptionSchema = new Schema<IRewardRedemption>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "CustomerUser", required: true, index: true },
    rewardId: { type: Schema.Types.ObjectId, ref: "Reward", required: true, index: true },
    pointsSpent: { type: Number, required: true, min: 1 },
    nftTokenId: { type: String },
    nftTxHash: { type: String },
    nftContractAddress: { type: String },
    redeemedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

const RewardRedemption =
  models.RewardRedemption || model<IRewardRedemption>("RewardRedemption", RewardRedemptionSchema)

export default RewardRedemption
