import mongoose, { Schema, Document } from "mongoose";

export interface IMatch extends Document {
  teamA: string;
  teamB: string;
  startTime: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema: Schema = new Schema({
  teamA: { type: String, required: true },
  teamB: { type: String, required: true },
  startTime: { type: Date, required: true },
  status: { type: String, required: true, default: "scheduled" },
}, { timestamps: true });

export default mongoose.models.Match || mongoose.model<IMatch>("Match", MatchSchema);
