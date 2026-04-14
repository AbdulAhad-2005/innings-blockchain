import mongoose, { Schema, Document } from "mongoose";

export interface IBrandUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const BrandUserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.BrandUser || mongoose.model<IBrandUser>("BrandUser", BrandUserSchema);
