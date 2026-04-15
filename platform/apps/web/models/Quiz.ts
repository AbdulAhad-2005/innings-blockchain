import { Schema, model, models, type Document } from "mongoose"

export type QuizStatus =
  | "bid_pending"
  | "approved"
  | "rejected"
  | "draft"
  | "scheduled"
  | "active"
  | "completed"
  | "cancelled"

export interface IQuiz extends Document {
  title?: string
  matchId?: Schema.Types.ObjectId
  brandId?: Schema.Types.ObjectId
  budget?: number
  rewardCount?: number
  blockchainCampaignId?: number
  commitmentTxHash?: string
  commitmentProofAddress?: string
  statusTxHash?: string
  adImages: string[]
  startTime?: Date
  endTime?: Date
  questions?: Array<{
    question: string
    options: string[]
    correctAnswer: number
  }>
  status: QuizStatus
  rewardPoints?: number
  timeLimit?: number
  createdAt: Date
  updatedAt: Date
}

const QuizSchema = new Schema<IQuiz>(
  {
    title: { type: String },
    matchId: { type: Schema.Types.ObjectId, ref: "Match" },
    brandId: { type: Schema.Types.ObjectId, ref: "BrandUser" },
    budget: { type: Number, min: 0 },
    rewardCount: { type: Number, min: 0 },
    blockchainCampaignId: { type: Number },
    commitmentTxHash: { type: String },
    commitmentProofAddress: { type: String },
    statusTxHash: { type: String },
    adImages: { type: [String], default: [] },
    startTime: { type: Date },
    endTime: { type: Date },
    questions: [
      {
        question: { type: String, required: true },
        options: { type: [String], required: true },
        correctAnswer: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: [
        "bid_pending",
        "approved",
        "rejected",
        "draft",
        "scheduled",
        "active",
        "completed",
        "cancelled",
      ],
      default: "draft",
    },
    rewardPoints: { type: Number, default: 100 },
    timeLimit: { type: Number, default: 60 },
  },
  { timestamps: true }
)

const Quiz = models.Quiz || model<IQuiz>("Quiz", QuizSchema)

export default Quiz
