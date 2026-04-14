import mongoose, { Schema, Document } from "mongoose";

export interface ITeam extends Document {
  name: string;
  abbreviation: string;
  logoUrl?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeamSchema: Schema = new Schema({
  name: { type: String, required: true },
  abbreviation: { type: String, required: true, unique: true, uppercase: true },
  logoUrl: { type: String },
  description: { type: String },
}, { timestamps: true });

export default mongoose.models.Team || mongoose.model<ITeam>("Team", TeamSchema);
