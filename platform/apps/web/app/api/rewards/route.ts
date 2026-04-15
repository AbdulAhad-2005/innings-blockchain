import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/serverAuth"
import { connectDB } from "@/lib/db"
import Reward from "@/models/Reward"
import RewardRedemption from "@/models/RewardRedemption"

export async function GET(request: NextRequest) {
  try {
    const user = verifyToken(request)
    await connectDB()

    const { searchParams } = new URL(request.url)
    const mine = searchParams.get("mine") === "true"

    const query: Record<string, unknown> = {}

    if (mine) {
      query.creatorId = user.userId
    }

    if (user.role === "customer") {
      const now = new Date()
      query.startDate = { $lte: now }
      query.expirationDate = { $gte: now }

      const redeemed = await RewardRedemption.find({ userId: user.userId })
        .select("rewardId")
        .lean()

      if (redeemed.length > 0) {
        query._id = { $nin: redeemed.map((item) => item.rewardId) }
      }
    }

    const rewards = await Reward.find(query).sort({ createdAt: -1 }).lean()

    return NextResponse.json(rewards)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized." },
      { status: 401 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request)

    if (user.role !== "admin" && user.role !== "brand") {
      return NextResponse.json(
        { error: "Access denied. Only admin or brand can create rewards." },
        { status: 403 }
      )
    }

    await connectDB()

    const body = (await request.json()) as {
      points: number
      startDate: string
      expirationDate: string
      description?: string
      imageUrl?: string
    }

    if (!Number.isFinite(body.points) || body.points < 1) {
      return NextResponse.json({ error: "points must be a positive number." }, { status: 400 })
    }

    const startDate = new Date(body.startDate)
    const expirationDate = new Date(body.expirationDate)

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(expirationDate.getTime())) {
      return NextResponse.json({ error: "startDate and expirationDate must be valid dates." }, { status: 400 })
    }

    if (expirationDate <= startDate) {
      return NextResponse.json(
        { error: "expirationDate must be after startDate." },
        { status: 400 }
      )
    }

    const reward = await Reward.create({
      creatorId: user.userId,
      creatorType: user.role === "admin" ? "AdminUser" : "BrandUser",
      points: body.points,
      startDate,
      expirationDate,
      description: body.description,
      imageUrl: body.imageUrl,
    })

    return NextResponse.json(reward, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create reward." },
      { status: 400 }
    )
  }
}
