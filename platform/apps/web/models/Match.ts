import { Schema, model, models, type Document } from "mongoose"

export interface IMatch extends Document {
  teamA: { name: string; shortName: string; logo?: string }
  teamB: { name: string; shortName: string; logo?: string }
  startTime: Date
  status: "scheduled" | "live" | "completed"
  venue: string
  score?: { teamA: number; teamB: number }
  createdAt: Date
  updatedAt: Date
}

const MatchSchema = new Schema<IMatch>(
  {
    teamA: {
      name: { type: String, required: true },
      shortName: { type: String, required: true },
      logo: String,
    },
    teamB: {
      name: { type: String, required: true },
      shortName: { type: String, required: true },
      logo: String,
    },
    startTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["scheduled", "live", "completed"],
      default: "scheduled",
    },
    venue: { type: String, required: true },
    score: {
      teamA: Number,
      teamB: Number,
    },
  },
  { timestamps: true }
)

const Match = models.Match || model<IMatch>("Match", MatchSchema)

export default Match
