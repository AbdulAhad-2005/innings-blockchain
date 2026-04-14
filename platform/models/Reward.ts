import mongoose, { Schema, Document } from "mongoose";

export interface IReward extends Document {
  creatorId: mongoose.Types.ObjectId;
  creatorType: "BrandUser" | "AdminUser";
  points: number; // Cost in points to redeem this reward
  nftTokenId?: string;
  startDate: Date;
  expirationDate: Date;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RewardSchema: Schema = new Schema({
  creatorId: { 
    type: Schema.Types.ObjectId, 
    required: true, 
    refPath: "creatorType",
    index: true
  },
  creatorType: { 
    type: String, 
    required: true, 
    enum: ["BrandUser", "AdminUser"] 
  },
  points: { type: Number, required: true, min: 1 },
  nftTokenId: { type: String },
  startDate: { type: Date, required: true },
  expirationDate: { type: Date, required: true },
  description: { type: String },
  imageUrl: { type: String },
}, { timestamps: true });

export default mongoose.models.Reward || mongoose.model<IReward>("Reward", RewardSchema);
