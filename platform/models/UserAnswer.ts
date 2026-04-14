import mongoose, { Schema, Document } from "mongoose";

export interface IUserAnswer extends Document {
  userId: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  answer: string;
  isCorrect: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserAnswerSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "CustomerUser", required: true },
  questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  answer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
}, { timestamps: true });

export default mongoose.models.UserAnswer || mongoose.model<IUserAnswer>("UserAnswer", UserAnswerSchema);
