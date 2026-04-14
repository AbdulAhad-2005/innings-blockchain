import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/authMiddleware";
import { connectDB } from "@/lib/db";
import Reward from "@/models/Reward";
import { recordRewardWinOnChain } from "@/services/blockchainService";

interface RecordWinPayload {
  userId: string;
  matchId: string;
  rewardId: string;
  credits: number;
  rewardType?: string;
  timestamp?: number;
}

/**
 * @swagger
 * /api/rewards/win:
 *   post:
 *     summary: Record immutable reward proof on-chain
 *     tags: [Rewards - Blockchain]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, matchId, rewardId, credits]
 *             properties:
 *               userId: { type: string }
 *               matchId: { type: string }
 *               rewardId: { type: string }
 *               credits: { type: number }
 *               rewardType: { type: string }
 *               timestamp: { type: number }
 */
export async function POST(req: NextRequest) {
  try {
    verifyAdmin(req);
    const body = (await req.json()) as RecordWinPayload;

    if (!body.userId || !body.matchId || !body.rewardId) {
      return NextResponse.json(
        { error: "userId, matchId, and rewardId are required." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(body.credits) || body.credits <= 0) {
      return NextResponse.json(
        { error: "credits must be a positive number." },
        { status: 400 }
      );
    }

    await connectDB();
    const reward = await Reward.findById(body.rewardId);
    if (!reward) {
      return NextResponse.json({ error: "Reward not found." }, { status: 404 });
    }

    const rewardType = body.rewardType || "points";

    const chainResult = await recordRewardWinOnChain({
      userId: body.userId,
      matchId: body.matchId,
      rewardId: body.rewardId,
      credits: body.credits,
      rewardType,
      timestamp: body.timestamp,
    });

    reward.proofHash = chainResult.proofHash;
    reward.proofTxHash = chainResult.txHash;
    reward.rewardProofAddress = chainResult.contractAddress;
    reward.rewardType = rewardType;
    await reward.save();

    return NextResponse.json({
      message: "Reward win proof recorded successfully.",
      proof: chainResult,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to record reward win proof.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
