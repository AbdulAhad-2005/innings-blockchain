import { Schema, model, models, type Document } from "mongoose"

export interface IUserAnswer extends Document {
  userId: Schema.Types.ObjectId
  questionId: Schema.Types.ObjectId
  answer: string
  isCorrect: boolean
  similarity: number
  pointsAwarded: number
  proofHash?: string
  proofTxHash?: string
  proofContractAddress?: string
  createdAt: Date
  updatedAt: Date
}

const UserAnswerSchema = new Schema<IUserAnswer>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "CustomerUser", required: true },
    questionId: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    answer: { type: String, required: true, trim: true },
    isCorrect: { type: Boolean, required: true },
    similarity: { type: Number, required: true, min: 0, max: 1 },
    pointsAwarded: { type: Number, required: true, min: 0, default: 0 },
    proofHash: { type: String },
    proofTxHash: { type: String },
    proofContractAddress: { type: String },
  },
  { timestamps: true }
)

UserAnswerSchema.index({ userId: 1, questionId: 1 }, { unique: true })

const UserAnswer = models.UserAnswer || model<IUserAnswer>("UserAnswer", UserAnswerSchema)

export default UserAnswer
