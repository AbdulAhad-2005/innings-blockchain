import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  brandId: mongoose.Types.ObjectId;
  amount: number;
  type: string;
  status: string;
  txHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema({
  brandId: { type: Schema.Types.ObjectId, ref: "BrandUser", required: true },
  amount: { type: Number, required: true },
  type: { type: String, required: true },
  status: { type: String, required: true, default: "pending" },
  txHash: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);
