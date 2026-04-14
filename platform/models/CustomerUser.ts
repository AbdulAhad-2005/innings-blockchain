import mongoose, { Schema, Document } from "mongoose";

export interface ICustomerUser extends Document {
  name: string;
  email: string;
  password: string;
  walletAddress: string;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerUserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  walletAddress: { type: String, required: true },
  points: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.CustomerUser || mongoose.model<ICustomerUser>("CustomerUser", CustomerUserSchema);
