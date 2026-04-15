import { NextRequest, NextResponse } from "next/server"
import { verifyCustomer } from "@/lib/serverAuth"
import { connectDB } from "@/lib/db"
import Reward from "@/models/Reward"
import CustomerUser from "@/models/CustomerUser"
import RewardRedemption from "@/models/RewardRedemption"
import { mintRewardNftOnChain } from "@/lib/blockchain"

function hasMintConfig(): boolean {
  return Boolean(
    (process.env.BACKEND_SIGNER_PRIVATE_KEY ||
      process.env.WIREFLUID_PRIVATE_KEY ||
      process.env.WIREFLUID_PRIVATE_KEYS) &&
      process.env.REWARD_SBT_ADDRESS
  )
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = verifyCustomer(request)
    await connectDB()

    const { id } = await params
    const reward = await Reward.findById(id)

    if (!reward) {
      return NextResponse.json({ error: "Reward not found." }, { status: 404 })
    }

    const existingRedemption = await RewardRedemption.findOne({
      userId: user.userId,
      rewardId: reward._id,
    }).lean()

    if (existingRedemption) {
      return NextResponse.json(
        {
          error: "You have already redeemed this reward.",
          redemption: existingRedemption,
        },
        { status: 409 }
      )
    }

    const now = new Date()
    if (now < reward.startDate || now > reward.expirationDate) {
      return NextResponse.json(
        { error: "This reward is not currently active or has expired." },
        { status: 400 }
      )
    }

    const customer = await CustomerUser.findById(user.userId)
    if (!customer) {
      return NextResponse.json({ error: "Customer not found." }, { status: 404 })
    }

    if ((customer.points ?? 0) < reward.points) {
      return NextResponse.json(
        {
          error: `Insufficient points. You need ${reward.points} points, but you have ${customer.points}.`,
        },
        { status: 400 }
      )
    }

    const updatedUser = await CustomerUser.findOneAndUpdate(
      { _id: user.userId, points: { $gte: reward.points } },
      { $inc: { points: -reward.points } },
      { new: true }
    )

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Deduction failed. Please try again." },
        { status: 409 }
      )
    }

    const redemption = await RewardRedemption.create({
      userId: user.userId,
      rewardId: reward._id,
      pointsSpent: reward.points,
      redeemedAt: new Date(),
    })

    let nft: { txHash: string; tokenId: string; contractAddress: string } | null = null

    if (hasMintConfig() && updatedUser.walletAddress) {
      try {
        nft = await mintRewardNftOnChain({
          walletAddress: updatedUser.walletAddress,
          metadataURI: `ipfs://innings/rewards/${reward._id.toString()}/${redemption._id.toString()}`,
        })

        redemption.nftTokenId = nft.tokenId
        redemption.nftTxHash = nft.txHash
        redemption.nftContractAddress = nft.contractAddress
        await redemption.save()
      } catch {
        // Redemption should still succeed if NFT minting fails.
      }
    }

    return NextResponse.json({
      message: nft
        ? "Reward redeemed and NFT minted successfully."
        : "Reward redeemed successfully.",
      redemption,
      remainingPoints: updatedUser.points,
      nft,
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Reward redemption failed." },
      { status: 400 }
    )
  }
}
