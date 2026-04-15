import { Schema, model, models, type Document } from "mongoose"

export interface ITeam extends Document {
  name: string
  abbreviation: string
  logoUrl?: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

const TeamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true },
    abbreviation: { type: String, required: true, unique: true, uppercase: true },
    logoUrl: { type: String },
    description: { type: String },
  },
  { timestamps: true }
)

const Team = models.Team || model<ITeam>("Team", TeamSchema)

export default Team
