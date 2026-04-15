import { NextRequest, NextResponse } from "next/server"
import { verifyAdmin } from "@/lib/serverAuth"
import { connectDB } from "@/lib/db"
import BrandUser from "@/models/BrandUser"
import Quiz from "@/models/Quiz"

export async function GET(request: NextRequest) {
  try {
    verifyAdmin(request)
    await connectDB()

    const brands = await BrandUser.find()
      .select("name email walletAddress balance verificationStatus verifiedAt createdAt")
      .sort({ createdAt: -1 })
      .lean()

    const brandIds = brands.map((brand) => brand._id)

    const campaignCounts =
      brandIds.length > 0
        ? await Quiz.aggregate<{ _id: string; campaigns: number }>([
            { $match: { brandId: { $in: brandIds } } },
            { $group: { _id: "$brandId", campaigns: { $sum: 1 } } },
          ])
        : []

    const campaignCountByBrand = new Map(
      campaignCounts.map((entry) => [entry._id.toString(), entry.campaigns])
    )

    const result = brands.map((brand) => ({
      ...brand,
      campaigns: campaignCountByBrand.get(brand._id.toString()) ?? 0,
    }))

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unauthorized." },
      { status: 401 }
    )
  }
}
