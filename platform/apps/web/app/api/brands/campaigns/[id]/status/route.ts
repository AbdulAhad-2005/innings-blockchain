import { NextRequest, NextResponse } from "next/server"
import { verifyBrand } from "@/lib/serverAuth"
import { connectDB } from "@/lib/db"
import Quiz from "@/models/Quiz"

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

    const campaign = await Quiz.findOneAndUpdate(
      { _id: id, brandId: user.userId },
      { status: body.status },
      { new: true }
    )

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found." }, { status: 404 })
    }

    return NextResponse.json(campaign)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update campaign status." },
      { status: 400 }
    )
  }
}
