import { NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/serverAuth"
import { connectDB } from "@/lib/db"
import Quiz from "@/models/Quiz"

export async function GET(request: NextRequest) {
  try {
    verifyAdmin(request)
    await connectDB()

    const campaigns = await Quiz.find()
      .populate("brandId", "name email")
      .populate("matchId")
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(campaigns)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized." },
      { status: 401 }
    )
  }
}
