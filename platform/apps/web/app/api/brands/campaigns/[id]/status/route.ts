import { NextRequest, NextResponse } from "next/server"
import { verifyBrand } from "@/lib/serverAuth"
import { connectDB } from "@/lib/db"
import Quiz from "@/models/Quiz"
import {
  cancelCampaignCommitmentOnChain,
  completeCampaignCommitmentOnChain,
  hasBlockchainSigningConfig,
} from "@/lib/blockchain"

const ALLOWED_STATUSES = ["scheduled", "active", "completed", "cancelled"] as const

type AllowedStatus = (typeof ALLOWED_STATUSES)[number]

interface UpdateCampaignBody {
  status: AllowedStatus
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = verifyBrand(request)
    await connectDB()

    const { id } = await params
    const body = (await request.json()) as UpdateCampaignBody

    if (!ALLOWED_STATUSES.includes(body.status)) {
      return NextResponse.json(
        { error: `status must be one of: ${ALLOWED_STATUSES.join(", ")}.` },
        { status: 400 }
      )
    }

    const campaign = await Quiz.findOne({ _id: id, brandId: user.userId })

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found." }, { status: 404 })
    }

    let statusTxHash = campaign.statusTxHash

    if (
      campaign.blockchainCampaignId &&
      hasBlockchainSigningConfig() &&
      (body.status === "completed" || body.status === "cancelled")
    ) {
      try {
        const chainResult =
          body.status === "completed"
            ? await completeCampaignCommitmentOnChain(campaign.blockchainCampaignId.toString())
            : await cancelCampaignCommitmentOnChain(campaign.blockchainCampaignId.toString())

        statusTxHash = chainResult.txHash
      } catch (chainError) {
        return NextResponse.json(
          {
            error:
              chainError instanceof Error
                ? `On-chain status update failed: ${chainError.message}`
                : "On-chain status update failed.",
          },
          { status: 502 }
        )
      }
    }

    campaign.status = body.status
    if (statusTxHash) {
      campaign.statusTxHash = statusTxHash
    }

    await campaign.save()

    return NextResponse.json(campaign)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update campaign status." },
      { status: 400 }
    )
  }
}
