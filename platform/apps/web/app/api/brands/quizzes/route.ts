import { NextRequest, NextResponse } from "next/server"
import { verifyBrand } from "@/lib/serverAuth"
import { connectDB } from "@/lib/db"
import Quiz from "@/models/Quiz"
import Match from "@/models/Match"
import {
  buildCampaignMetadataHash,
  createCampaignCommitmentOnChain,
  hasBlockchainSigningConfig,
} from "@/lib/blockchain"

interface CreateQuizBody {
  title?: string
  matchId: string
  rewardCount?: number
  rewardPoints?: number
  budget?: number
  startTime?: string
  endTime?: string
  status?: "draft" | "scheduled" | "active"
}

export async function GET(request: NextRequest) {
  try {
    const user = verifyBrand(request)
    await connectDB()

    const quizzes = await Quiz.find({ brandId: user.userId })
      .populate("matchId")
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json(quizzes)
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

    const body = (await request.json()) as CreateQuizBody

    if (!body.matchId) {
      return NextResponse.json({ error: "matchId is required." }, { status: 400 })
    }

    const match = await Match.findById(body.matchId)
    if (!match) {
      return NextResponse.json({ error: "Match not found." }, { status: 404 })
    }

    const startTime = body.startTime ? new Date(body.startTime) : new Date()
    const endTime = body.endTime
      ? new Date(body.endTime)
      : new Date(startTime.getTime() + 2 * 60 * 60 * 1000)

    if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
      return NextResponse.json(
        { error: "startTime and endTime must be valid dates." },
        { status: 400 }
      )
    }

    if (endTime <= startTime) {
      return NextResponse.json({ error: "endTime must be after startTime." }, { status: 400 })
    }

    const rewardCount = Number(body.rewardCount ?? 100)
    const budget = Number(body.budget ?? rewardCount)

    if (!Number.isFinite(rewardCount) || rewardCount <= 0) {
      return NextResponse.json({ error: "rewardCount must be a positive number." }, { status: 400 })
    }

    if (!Number.isFinite(budget) || budget <= 0) {
      return NextResponse.json({ error: "budget must be a positive number." }, { status: 400 })
    }

    let blockchainCampaignId: number | undefined
    let commitmentTxHash: string | undefined
    let commitmentProofAddress: string | undefined

    if (hasBlockchainSigningConfig()) {
      const metadataHash = buildCampaignMetadataHash(
        JSON.stringify({
          brandId: user.userId,
          matchId: body.matchId,
          title: body.title,
          rewardCount,
          budget,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        })
      )

      try {
        const chainResult = await createCampaignCommitmentOnChain({
          brandId: user.userId,
          rewardCount,
          metadataHash,
        })

        blockchainCampaignId = Number(chainResult.campaignId)
        commitmentTxHash = chainResult.txHash
        commitmentProofAddress = chainResult.contractAddress
      } catch (chainError) {
        return NextResponse.json(
          {
            error:
              chainError instanceof Error
                ? `On-chain campaign creation failed: ${chainError.message}`
                : "On-chain campaign creation failed.",
          },
          { status: 502 }
        )
      }
    }

    const quiz = await Quiz.create({
      title: body.title?.trim() || "Match Quiz",
      matchId: body.matchId,
      brandId: user.userId,
      budget,
      rewardCount,
      rewardPoints: Number(body.rewardPoints ?? rewardCount),
      startTime,
      endTime,
      status: body.status || "active",
      blockchainCampaignId,
      commitmentTxHash,
      commitmentProofAddress,
      questions: [],
    })

    return NextResponse.json(quiz, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create quiz." },
      { status: 400 }
    )
  }
}
