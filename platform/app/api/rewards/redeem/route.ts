import { NextRequest, NextResponse } from "next/server";
import { ethers } from "ethers";
import { verifyCustomer } from "@/lib/authMiddleware";
import { connectDB } from "@/lib/db";
import CustomerUser from "@/models/CustomerUser";
import Reward from "@/models/Reward";
import RewardRedemption from "@/models/RewardRedemption";
import { mintRewardNftOnChain } from "@/services/blockchainService";
import { redeemReward } from "@/services/redemptionService";

interface RedeemPayload {
  rewardId: string;
  metadataURI?: string;
}

/**
 * @swagger
 * /api/rewards/redeem:
 *   post:
 *     summary: Redeem a reward and mint authenticity NFT
 *     tags: [Rewards - Blockchain]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rewardId]
 *             properties:
 *               rewardId: { type: string }
 *               metadataURI: { type: string }
 */
export async function POST(req: NextRequest) {
  try {
    const user = verifyCustomer(req);
    const body = (await req.json()) as RedeemPayload;

    if (!body.rewardId) {
      return NextResponse.json({ error: "rewardId is required." }, { status: 400 });
    }

    await connectDB();

    const customer = await CustomerUser.findById(user.userId).select("walletAddress");
    if (!customer?.walletAddress) {
      return NextResponse.json(
        { error: "Customer wallet address is required for NFT minting." },
        { status: 400 }
      );
    }

    if (!ethers.isAddress(customer.walletAddress)) {
      return NextResponse.json({ error: "Invalid customer wallet address." }, { status: 400 });
    }

    const reward = await Reward.findById(body.rewardId);
    if (!reward) {
      return NextResponse.json({ error: "Reward not found." }, { status: 404 });
    }

    const redemption = await redeemReward(user.userId, body.rewardId);

    const metadataURI =
      body.metadataURI?.trim() ||
      `ipfs://innings/rewards/${body.rewardId}/${redemption._id.toString()}`;

    let chainResult;
    try {
      chainResult = await mintRewardNftOnChain({
        walletAddress: customer.walletAddress,
        metadataURI,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "NFT mint failed.";
      return NextResponse.json(
        {
          error: "Reward redeemed but NFT mint failed.",
          details: message,
          redemptionId: redemption._id.toString(),
        },
        { status: 502 }
      );
    }

    await Promise.all([
      RewardRedemption.findByIdAndUpdate(redemption._id, {
        nftTokenId: chainResult.tokenId,
        nftTxHash: chainResult.txHash,
        nftContractAddress: chainResult.contractAddress,
      }),
      Reward.findByIdAndUpdate(body.rewardId, { nftTokenId: chainResult.tokenId }),
    ]);

    const updatedRedemption = await RewardRedemption.findById(redemption._id).populate("rewardId");

    return NextResponse.json({
      redemption: updatedRedemption || redemption,
      nft: chainResult,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Reward redemption failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
