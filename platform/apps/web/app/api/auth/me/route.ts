import { NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { verifyToken, type UserRole } from "@/lib/serverAuth"
import CustomerUser from "@/models/CustomerUser"
import BrandUser from "@/models/BrandUser"
import AdminUser from "@/models/AdminUser"

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
    const decoded = verifyToken(request)

    await connectDB()

    const Model = getModelForRole(decoded.role)
    const user = await Model.findById(decoded.userId).select("-password")

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: decoded.role,
        ...(decoded.role === "customer" ? { points: (user as { points?: number }).points ?? 0 } : {}),
      },
    })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid token." },
      { status: 401 }
    )
  }
}
