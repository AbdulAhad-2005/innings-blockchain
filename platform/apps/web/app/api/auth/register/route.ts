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
    const { name, email, password, role } = await request.json()

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "Name, email, password, and role are required" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      )
    }

    await connectDB()

    const Model = getModelForRole(role as UserRole)
    const existingUser = await Model.findOne({ email: email.toLowerCase() })

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await Model.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    })

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
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
