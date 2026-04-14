import mongoose, { Schema, Document } from "mongoose";

export interface IQuiz extends Document {
  matchId: mongoose.Types.ObjectId;
  brandId: mongoose.Types.ObjectId;
  budget: number;
  startTime: Date;
  endTime: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuizSchema: Schema = new Schema({
  matchId: { type: Schema.Types.ObjectId, ref: "Match", required: true },
  brandId: { type: Schema.Types.ObjectId, ref: "BrandUser", required: true },
  budget: { type: Number, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, required: true, default: "draft" },
}, { timestamps: true });

export default mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema);
