import mongoose, { Schema, Document } from "mongoose";

export interface IQuestion extends Document {
  quizId: mongoose.Types.ObjectId;
  questionText: string;
  correctAnswer: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema = new Schema({
  quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  questionText: { type: String, required: true },
  correctAnswer: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema);
