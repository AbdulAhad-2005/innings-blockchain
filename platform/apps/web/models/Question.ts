import { Schema, model, models, type Document } from "mongoose"

export interface IQuestion extends Document {
  quizId: Schema.Types.ObjectId
  questionText: string
  correctAnswer: string
  options: string[]
  createdAt: Date
  updatedAt: Date
}

const QuestionSchema = new Schema<IQuestion>(
  {
    quizId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true, index: true },
    questionText: { type: String, required: true, trim: true },
    correctAnswer: { type: String, required: true, trim: true },
    options: { type: [String], default: [] },
  },
  { timestamps: true }
)

const Question = models.Question || model<IQuestion>("Question", QuestionSchema)

export default Question
