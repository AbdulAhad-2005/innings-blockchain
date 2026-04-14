import { NextRequest, NextResponse } from "next/server";
import { verifyBrand } from "@/lib/authMiddleware";
import { createBrandCampaign, getBrandCampaigns } from "@/services/campaignService";

interface CreateCampaignBody {
  matchId: string;
  budget: number;
  rewardCount: number;
  startTime: string;
  endTime: string;
  metadata?: Record<string, unknown>;
}

/**
 * @swagger
 * /api/brands/campaigns:
 *   get:
 *     summary: List campaigns for the authenticated brand
 *     tags: [Brand - Campaigns]
 *     security: [{ bearerAuth: [] }]
 *   post:
 *     summary: Create a blockchain-backed campaign commitment
 *     tags: [Brand - Campaigns]
 *     security: [{ bearerAuth: [] }]
 */
export async function GET(req: NextRequest) {
  try {
    const user = verifyBrand(req);
    const campaigns = await getBrandCampaigns(user.userId);
    return NextResponse.json(campaigns);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load campaigns.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = verifyBrand(req);
    const body = (await req.json()) as CreateCampaignBody;

    if (!body.matchId) {
      return NextResponse.json({ error: "matchId is required." }, { status: 400 });
    }

    const result = await createBrandCampaign({
      brandId: user.userId,
      matchId: body.matchId,
      budget: Number(body.budget),
      rewardCount: Number(body.rewardCount),
      startTime: body.startTime,
      endTime: body.endTime,
      metadata: body.metadata,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create campaign.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
