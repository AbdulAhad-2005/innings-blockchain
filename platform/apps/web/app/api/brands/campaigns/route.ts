import { NextRequest, NextResponse } from "next/server"
import { verifyBrand } from "@/lib/serverAuth"
import { connectDB } from "@/lib/db"
import Match from "@/models/Match"
import Quiz from "@/models/Quiz"

interface CreateCampaignBody {
  matchId: string
  budget: number
  rewardCount: number
  startTime: string
  endTime: string
  metadata?: Record<string, unknown>
}

export async function GET(request: NextRequest) {
  try {
    const user = verifyBrand(request)
    await connectDB()

    const campaigns = await Quiz.find({ brandId: user.userId })
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

export async function POST(request: NextRequest) {
  try {
    const user = verifyBrand(request)
    await connectDB()

    const body = (await request.json()) as CreateCampaignBody

    if (!body.matchId) {
      return NextResponse.json({ error: "matchId is required." }, { status: 400 })
    }

    if (!Number.isFinite(body.budget) || body.budget <= 0) {
      return NextResponse.json({ error: "budget must be a positive number." }, { status: 400 })
    }

    if (!Number.isFinite(body.rewardCount) || body.rewardCount <= 0) {
      return NextResponse.json({ error: "rewardCount must be a positive number." }, { status: 400 })
    }

    const startTime = new Date(body.startTime)
    const endTime = new Date(body.endTime)

    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
      return NextResponse.json({ error: "startTime and endTime must be valid dates." }, { status: 400 })
    }

    if (endTime <= startTime) {
      return NextResponse.json({ error: "endTime must be after startTime." }, { status: 400 })
    }

    const match = await Match.findById(body.matchId)
    if (!match) {
      return NextResponse.json({ error: "Match not found." }, { status: 404 })
    }

    const campaign = await Quiz.create({
      title: body.metadata?.title || "Campaign",
      brandId: user.userId,
      matchId: body.matchId,
      budget: Number(body.budget),
      rewardCount: Number(body.rewardCount),
      startTime,
      endTime,
      status: "active",
      rewardPoints: Number(body.rewardCount),
      metadata: body.metadata,
    })

    return NextResponse.json(campaign, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create campaign." },
      { status: 400 }
    )
  }
}
