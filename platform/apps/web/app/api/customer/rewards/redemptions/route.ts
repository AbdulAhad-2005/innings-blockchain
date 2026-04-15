import { NextRequest, NextResponse } from "next/server"
import { verifyCustomer } from "@/lib/serverAuth"
import { connectDB } from "@/lib/db"
import RewardRedemption from "@/models/RewardRedemption"

function toId(value: unknown): string {
  if (typeof value === "string") {
    return value
  }

  if (value && typeof value === "object" && "toString" in value) {
    return (value as { toString(): string }).toString()
  }

  return ""
}

export async function GET(request: NextRequest) {
  try {
    const user = verifyCustomer(request)
    await connectDB()

    const redemptions = await RewardRedemption.find({ userId: user.userId })
      .populate("rewardId", "points description expirationDate imageUrl")
      .sort({ redeemedAt: -1 })
      .lean()

    const formatted = redemptions.map((item) => {
      const populatedReward =
        item.rewardId && typeof item.rewardId === "object"
          ? (item.rewardId as {
              _id?: unknown
              points?: number
              description?: string
              expirationDate?: Date
              imageUrl?: string
            })
          : null

      return {
        _id: toId(item._id),
        userId: toId(item.userId),
        rewardId: toId(populatedReward?._id || item.rewardId),
        pointsSpent: item.pointsSpent,
        nftTokenId: item.nftTokenId,
        nftTxHash: item.nftTxHash,
        nftContractAddress: item.nftContractAddress,
        redeemedAt: item.redeemedAt,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        reward: populatedReward
          ? {
              _id: toId(populatedReward._id),
              points: populatedReward.points ?? item.pointsSpent,
              description: populatedReward.description,
              expirationDate: populatedReward.expirationDate,
              imageUrl: populatedReward.imageUrl,
            }
          : null,
      }
    })

    return NextResponse.json(formatted)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to load redemption history." },
      { status: 401 }
    )
  }
}
