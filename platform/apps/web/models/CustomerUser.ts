import { Schema, model, models, type Document } from "mongoose"

export interface ICustomerUser extends Document {
  name: string
  email: string
  password: string
  walletAddress: string
  points: number
  createdAt: Date
  updatedAt: Date
}

const CustomerUserSchema = new Schema<ICustomerUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    walletAddress: { type: String, required: true },
    points: { type: Number, default: 0 },
  },
  { timestamps: true }
)

const CustomerUser = models.CustomerUser || model<ICustomerUser>("CustomerUser", CustomerUserSchema)

export default CustomerUser
