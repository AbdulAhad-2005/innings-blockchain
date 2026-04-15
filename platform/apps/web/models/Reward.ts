import { Schema, model, models, type Document } from "mongoose"

export interface IReward extends Document {
  creatorId: Schema.Types.ObjectId
  creatorType: "BrandUser" | "AdminUser"
  points: number
  rewardType?: string
  proofHash?: string
  proofTxHash?: string
  rewardProofAddress?: string
  nftTokenId?: string
  startDate: Date
  expirationDate: Date
  description?: string
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

const RewardSchema = new Schema<IReward>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "creatorType",
      index: true,
    },
    creatorType: {
      type: String,
      required: true,
      enum: ["BrandUser", "AdminUser"],
    },
    points: { type: Number, required: true, min: 1 },
    rewardType: { type: String, default: "points" },
    proofHash: { type: String },
    proofTxHash: { type: String },
    rewardProofAddress: { type: String },
    nftTokenId: { type: String },
    startDate: { type: Date, required: true },
    expirationDate: { type: Date, required: true },
    description: { type: String },
    imageUrl: { type: String },
  },
  { timestamps: true }
)

const Reward = models.Reward || model<IReward>("Reward", RewardSchema)

export default Reward
