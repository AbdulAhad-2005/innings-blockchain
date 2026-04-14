import mongoose, { Schema, Document } from "mongoose";

export interface IBrandUser extends Document {
  name: string;
  email: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}

const BrandUserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.BrandUser || mongoose.model<IBrandUser>("BrandUser", BrandUserSchema);
