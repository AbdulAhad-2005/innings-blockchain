import { ethers } from "ethers";
import { connectDB } from "../lib/db";
import BrandUser from "../models/BrandUser";
import Transaction from "../models/Transaction";
import {
  isBrandVerifiedOnChain,
  issueBrandBadgeOnChain,
  revokeBrandBadgeOnChain,
} from "./blockchainService";

export interface VerifyBrandBadgePayload {
  brandId: string;
  adminUserId: string;
  metadataURI: string;
  walletAddress?: string;
}

export interface RevokeBrandBadgePayload {
  brandId: string;
  adminUserId: string;
}

export async function issueBrandVerificationBadge(payload: VerifyBrandBadgePayload) {
  await connectDB();

  const brand = await BrandUser.findById(payload.brandId);
  if (!brand) {
    throw new Error("Brand not found.");
  }

  const walletAddress = payload.walletAddress || brand.walletAddress;
  if (!walletAddress) {
    throw new Error("Brand wallet address is required to issue verification badge.");
  }

  if (!ethers.isAddress(walletAddress)) {
    throw new Error("Invalid wallet address format.");
  }

  if (brand.verificationStatus === "verified" && brand.verificationBadgeTokenId) {
    throw new Error("Brand is already verified.");
  }

  const chainResult = await issueBrandBadgeOnChain({
    brandWallet: walletAddress,
    brandId: brand._id.toString(),
    metadataURI: payload.metadataURI,
  });

  brand.walletAddress = walletAddress;
  brand.verificationStatus = "verified";
  brand.verificationBadgeTokenId = chainResult.tokenId;
  brand.verificationBadgeAddress = chainResult.contractAddress;
  brand.verifiedAt = new Date();
  brand.set("verifiedBy", payload.adminUserId);

  await Promise.all([
    brand.save(),
    Transaction.create({
      brandId: brand._id,
      amount: 0,
      type: "brand_verification_issue",
      status: "confirmed",
      txHash: chainResult.txHash,
    }),
  ]);

  return {
    brand,
    tokenId: chainResult.tokenId,
    txHash: chainResult.txHash,
    issuedBy: payload.adminUserId,
  };
}

export async function revokeBrandVerificationBadge(payload: RevokeBrandBadgePayload) {
  await connectDB();

  const brand = await BrandUser.findById(payload.brandId);
  if (!brand) {
    throw new Error("Brand not found.");
  }

  if (!brand.verificationBadgeTokenId) {
    throw new Error("Brand does not have a verification badge token linked.");
  }

  const chainResult = await revokeBrandBadgeOnChain(brand.verificationBadgeTokenId);

  brand.verificationStatus = "revoked";
  brand.verifiedAt = undefined;
  brand.verifiedBy = undefined;

  await Promise.all([
    brand.save(),
    Transaction.create({
      brandId: brand._id,
      amount: 0,
      type: "brand_verification_revoke",
      status: "confirmed",
      txHash: chainResult.txHash,
    }),
  ]);

  return {
    brand,
    txHash: chainResult.txHash,
    revokedBy: payload.adminUserId,
  };
}

export async function getBrandBadgeStatus(brandId: string) {
  await connectDB();

  const brand = await BrandUser.findById(brandId).select(
    "name walletAddress verificationStatus verificationBadgeTokenId verificationBadgeAddress verifiedAt"
  );

  if (!brand) {
    throw new Error("Brand not found.");
  }

  const onChainVerified =
    !!brand.walletAddress && ethers.isAddress(brand.walletAddress)
      ? await isBrandVerifiedOnChain(brand.walletAddress)
      : false;

  return {
    brand,
    onChainVerified,
  };
}
