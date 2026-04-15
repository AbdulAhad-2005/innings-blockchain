import { Schema, model, models, type Document } from "mongoose"

export interface IMatch extends Document {
  teamA: unknown
  teamB: unknown
  startTime: Date
  endTime?: Date
  status: "scheduled" | "live" | "completed"
  venue?: string
  score?: { teamA: number; teamB: number }
  createdAt: Date
  updatedAt: Date
}

const MatchSchema = new Schema<IMatch>(
  {
    // Support both object-id refs and embedded team objects.
    teamA: { type: Schema.Types.Mixed, required: true },
    teamB: { type: Schema.Types.Mixed, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    status: {
      type: String,
      enum: ["scheduled", "live", "completed"],
      default: "scheduled",
    },
    venue: { type: String },
    score: {
      teamA: Number,
      teamB: Number,
    },
  },
  { timestamps: true }
)

const Match = models.Match || model<IMatch>("Match", MatchSchema)

export default Match
