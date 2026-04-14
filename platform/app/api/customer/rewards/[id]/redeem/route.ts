import { NextRequest, NextResponse } from "next/server";
import { verifyCustomer } from "@/lib/authMiddleware";
import { redeemReward } from "@/services/redemptionService";

/**
 * @swagger
 * /api/customer/rewards/{id}/redeem:
 *   post:
 *     summary: Redeem points for a specific reward
 *     tags: [Customer - Rewards]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Reward redeemed successfully. Points are deducted from the user.
 *       400:
 *         description: Insufficient points or reward not found/inactive.
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = verifyCustomer(req);
    const { id } = await params;
    
    const redemption = await redeemReward(user.userId, id);
    return NextResponse.json(redemption);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
