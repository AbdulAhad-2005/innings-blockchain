import { connectDB } from "../lib/db";
import BrandUser from "../models/BrandUser";
import Match from "../models/Match";
import Quiz from "../models/Quiz";
import Transaction from "../models/Transaction";
import {
  buildCampaignMetadataHash,
  cancelCampaignCommitmentOnChain,
  completeCampaignCommitmentOnChain,
  createCampaignCommitmentOnChain,
} from "./blockchainService";

export interface CreateBrandCampaignPayload {
  brandId: string;
  matchId: string;
  budget: number;
  rewardCount: number;
  startTime: string | Date;
  endTime: string | Date;
  metadata?: Record<string, unknown>;
}

export interface UpdateBrandCampaignStatusPayload {
  brandId: string;
  campaignId: string;
  status: "completed" | "cancelled";
}

export async function getBrandCampaigns(brandId: string) {
  await connectDB();

  return Quiz.find({ brandId })
    .populate("matchId")
    .sort({ createdAt: -1 });
}

export async function createBrandCampaign(payload: CreateBrandCampaignPayload) {
  await connectDB();

  if (!Number.isFinite(payload.budget) || payload.budget <= 0) {
    throw new Error("budget must be a positive number.");
  }

  if (!Number.isFinite(payload.rewardCount) || payload.rewardCount <= 0) {
    throw new Error("rewardCount must be a positive number.");
  }

  const startTime = new Date(payload.startTime);
  const endTime = new Date(payload.endTime);

  if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
    throw new Error("startTime and endTime must be valid dates.");
  }

  if (endTime <= startTime) {
    throw new Error("endTime must be after startTime.");
  }

  const [brand, match] = await Promise.all([
    BrandUser.findById(payload.brandId),
    Match.findById(payload.matchId),
  ]);

  if (!brand) {
    throw new Error("Brand not found.");
  }

  if (!match) {
    throw new Error("Match not found.");
  }

  const availableBalance = Number(brand.balance ?? 0);

  if (availableBalance < payload.budget) {
    throw new Error("Insufficient brand balance for campaign commitment.");
  }

  const serializedMetadata = JSON.stringify({
    brandId: payload.brandId,
    matchId: payload.matchId,
    budget: payload.budget,
    rewardCount: payload.rewardCount,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    metadata: payload.metadata || {},
  });

  const metadataHash = buildCampaignMetadataHash(serializedMetadata);

  const chainResult = await createCampaignCommitmentOnChain({
    brandId: payload.brandId,
    rewardCount: payload.rewardCount,
    metadataHash,
  });

  const quiz = await Quiz.create({
    matchId: payload.matchId,
    brandId: payload.brandId,
    budget: payload.budget,
    rewardCount: payload.rewardCount,
    blockchainCampaignId: Number(chainResult.campaignId),
    commitmentTxHash: chainResult.txHash,
    commitmentProofAddress: chainResult.contractAddress,
    startTime,
    endTime,
    status: "active",
  });

  brand.balance = availableBalance - payload.budget;

  await Promise.all([
    brand.save(),
    Transaction.create({
      brandId: brand._id,
      amount: payload.budget,
      type: "campaign_commitment",
      status: "confirmed",
      txHash: chainResult.txHash,
    }),
  ]);

  return {
    quiz,
    metadataHash,
    blockchainCampaignId: chainResult.campaignId,
    txHash: chainResult.txHash,
  };
}

export async function updateBrandCampaignStatus(payload: UpdateBrandCampaignStatusPayload) {
  await connectDB();

  const quiz = await Quiz.findOne({
    _id: payload.campaignId,
    brandId: payload.brandId,
  });

  if (!quiz) {
    throw new Error("Campaign not found.");
  }

  if (!quiz.blockchainCampaignId) {
    throw new Error("Campaign has no blockchainCampaignId linked.");
  }

  if (quiz.status === payload.status) {
    throw new Error(`Campaign is already marked as '${payload.status}'.`);
  }

  if (!["active", "draft", "scheduled"].includes(quiz.status)) {
    throw new Error(`Cannot transition campaign from '${quiz.status}' to '${payload.status}'.`);
  }

  let txHash: string;

  if (payload.status === "completed") {
    const chainResult = await completeCampaignCommitmentOnChain(
      quiz.blockchainCampaignId.toString()
    );
    txHash = chainResult.txHash;
  } else {
    const chainResult = await cancelCampaignCommitmentOnChain(
      quiz.blockchainCampaignId.toString()
    );
    txHash = chainResult.txHash;

    const brand = await BrandUser.findById(payload.brandId);
    if (brand) {
      brand.balance = Number(brand.balance ?? 0) + quiz.budget;
      await brand.save();
    }
  }

  quiz.status = payload.status;
  quiz.statusTxHash = txHash;
  await quiz.save();

  await Transaction.create({
    brandId: quiz.brandId,
    amount: quiz.budget,
    type: payload.status === "completed" ? "campaign_completed" : "campaign_cancelled",
    status: "confirmed",
    txHash,
  });

  return {
    quiz,
    txHash,
  };
}
