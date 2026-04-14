import { NextRequest, NextResponse } from "next/server";
import { verifyBrand } from "@/lib/authMiddleware";
import { updateBrandCampaignStatus } from "@/services/campaignService";

interface UpdateCampaignBody {
  status: "completed" | "cancelled";
}

/**
 * @swagger
 * /api/brands/campaigns/{id}/status:
 *   patch:
 *     summary: Update campaign commitment status on-chain
 *     tags: [Brand - Campaigns]
 *     security: [{ bearerAuth: [] }]
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = verifyBrand(req);
    const { id } = await params;
    const body = (await req.json()) as UpdateCampaignBody;

    if (body.status !== "completed" && body.status !== "cancelled") {
      return NextResponse.json(
        { error: "status must be either 'completed' or 'cancelled'." },
        { status: 400 }
      );
    }

    const result = await updateBrandCampaignStatus({
      brandId: user.userId,
      campaignId: id,
      status: body.status,
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update campaign status.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
