import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import CustomerUser from "@/models/CustomerUser"
import BrandUser from "@/models/BrandUser"
import AdminUser from "@/models/AdminUser"

type UserRole = "customer" | "brand" | "admin"

function getModelForRole(role: UserRole) {
  switch (role) {
    case "customer":
      return CustomerUser
    case "brand":
      return BrandUser
    case "admin":
      return AdminUser
    default:
      throw new Error(`Unknown role: ${role}`)
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("innings_token")?.value

    if (!token) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      )
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string
      email: string
      name: string
      role: UserRole
    }

    await connectDB()

    const Model = getModelForRole(decoded.role)
    const user = await Model.findById(decoded.userId).select("-password")

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: decoded.role,
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json(
      { message: "Invalid token" },
      { status: 401 }
    )
  }
}
