import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
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

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    if (!email || !password || !role) {
      return NextResponse.json(
        { message: "Email, password, and role are required" },
        { status: 400 }
      )
    }

    await connectDB()

    const Model = getModelForRole(role as UserRole)
    const user = await Model.findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      )
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      )
    }

    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { message: "Server configuration error" },
        { status: 500 }
      )
    }

    const payload = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role,
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    })

    const response = NextResponse.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role,
      },
    })

    response.cookies.set("innings_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
