import { NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/serverAuth"
import { connectDB } from "@/lib/db"
import CustomerUser from "@/models/CustomerUser"

export async function GET(request: NextRequest) {
  try {
    verifyAdmin(request)
    await connectDB()

    const customers = await CustomerUser.find()
      .select("name email walletAddress points createdAt")
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(customers)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized." },
      { status: 401 }
    )
  }
}
