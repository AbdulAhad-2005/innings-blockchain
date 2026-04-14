import mongoose, { Schema, Document } from "mongoose";

export interface IMatch extends Document {
  teamA: mongoose.Types.ObjectId;
  teamB: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema: Schema = new Schema({
  teamA: { type: Schema.Types.ObjectId, ref: "Team", required: true },
  teamB: { type: Schema.Types.ObjectId, ref: "Team", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  status: { type: String, required: true, default: "scheduled" },
}, { timestamps: true });

// Index for query performance
MatchSchema.index({ startTime: 1, status: 1 });

export default mongoose.models.Match || mongoose.model<IMatch>("Match", MatchSchema);
