import { Schema, model, models, type Document } from "mongoose"

export interface IQuiz extends Document {
  title: string
  matchId?: Schema.Types.ObjectId
  questions: Array<{
    question: string
    options: string[]
    correctAnswer: number
  }>
  status: "draft" | "active" | "completed"
  rewardPoints: number
  timeLimit?: number
  createdAt: Date
  updatedAt: Date
}

const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String, required: true },
    matchId: { type: Schema.Types.ObjectId, ref: "Match" },
    questions: [
      {
        question: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["draft", "active", "completed"],
      default: "draft",
    },
    rewardPoints: { type: Number, default: 100 },
    timeLimit: { type: Number, default: 60 },
  },
  { timestamps: true }
)

const Quiz = models.Quiz || model<IQuiz>("Quiz", QuizSchema)

export default Quiz
