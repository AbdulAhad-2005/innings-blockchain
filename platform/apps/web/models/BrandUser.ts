import { Schema, model, models, type Document } from "mongoose"

export interface IBrandUser extends Document {
  name: string
  email: string
  password: string
  companyName: string
  apiKey?: string
  campaigns: Schema.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const BrandUserSchema = new Schema<IBrandUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    companyName: { type: String, required: true },
    apiKey: String,
    campaigns: [{ type: Schema.Types.ObjectId, ref: "Campaign" }],
  },
  { timestamps: true }
)

const BrandUser = models.BrandUser || model<IBrandUser>("BrandUser", BrandUserSchema)

export default BrandUser
