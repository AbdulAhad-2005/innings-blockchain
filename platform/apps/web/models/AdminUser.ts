import { Schema, model, models, type Document } from "mongoose"

export interface IAdminUser extends Document {
  name: string
  email: string
  password: string
  role: "admin" | "superadmin"
  permissions: string[]
  createdAt: Date
  updatedAt: Date
}

const AdminUserSchema = new Schema<IAdminUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "superadmin"],
      default: "admin",
    },
    permissions: [{ type: String }],
  },
  { timestamps: true }
)

const AdminUser = models.AdminUser || model<IAdminUser>("AdminUser", AdminUserSchema)

export default AdminUser
