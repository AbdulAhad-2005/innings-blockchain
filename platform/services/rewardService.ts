import mongoose from "mongoose";
import { saveFile, deleteFile } from "../lib/storage";
import { connectDB } from "../lib/db";
import Reward, { IReward } from "../models/Reward";
import { JWTPayload } from "../lib/authMiddleware";
import { formatImageUrl } from "../lib/utils";

// ---------------------------------------------------------------------------
// Business Logic
// ---------------------------------------------------------------------------

export interface RewardCreatePayload {
  points: number;
  startDate: string | Date;
  expirationDate: string | Date;
  description?: string;
  image?: File;
}

export async function createReward(data: RewardCreatePayload, user: JWTPayload): Promise<IReward> {
  await connectDB();

  let imageUrl = "";
  if (data.image) {
    imageUrl = await saveFile(data.image, "rewards");
  }

  // Map JWT role to Mongoose model name for refPath
  const creatorType = user.role === "admin" ? "AdminUser" : "BrandUser";

  const reward = await Reward.create({
    creatorId: user.userId,
    creatorType,
    points: data.points,
    startDate: new Date(data.startDate),
    expirationDate: new Date(data.expirationDate),
    description: data.description,
    imageUrl,
  });

  const obj = reward.toObject();
  obj.imageUrl = formatImageUrl(obj.imageUrl);
  return obj;
}

export async function getRewards(filter: { mine?: boolean; userId?: string; role?: string }) {
  await connectDB();

  const query: any = {};

  // If mine=true, filter by current user
  if (filter.mine && filter.userId) {
    query.creatorId = filter.userId;
  }

  const rewards = await Reward.find(query).sort({ createdAt: -1 });
  return rewards.map(r => {
    const obj = r.toObject();
    obj.imageUrl = formatImageUrl(obj.imageUrl);
    return obj;
  });
}

export async function getRewardById(id: string) {
  await connectDB();
  const reward = await Reward.findById(id);
  if (!reward) return null;
  const obj = reward.toObject();
  obj.imageUrl = formatImageUrl(obj.imageUrl);
  return obj;
}

export async function updateReward(id: string, data: Partial<RewardCreatePayload>, user: JWTPayload): Promise<IReward> {
  await connectDB();

  const reward = await Reward.findById(id);
  if (!reward) throw new Error("Reward not found");

  // Auth: Only creator or admin can update
  if (user.role !== "admin" && reward.creatorId.toString() !== user.userId) {
    throw new Error("Access denied. You can only update rewards you created.");
  }

  const updateData: any = { ...data };
  
  if (data.startDate) updateData.startDate = new Date(data.startDate);
  if (data.expirationDate) updateData.expirationDate = new Date(data.expirationDate);

  if (data.image) {
    // Delete old image if it exists
    if (reward.imageUrl) {
      await deleteFile(reward.imageUrl);
    }
    updateData.imageUrl = await saveFile(data.image, "rewards");
    delete updateData.image;
  }

  const updated = await Reward.findByIdAndUpdate(id, updateData, { new: true });
  if (!updated) throw new Error("Failed to update reward");
  const obj = updated.toObject();
  obj.imageUrl = formatImageUrl(obj.imageUrl);
  return obj;
}

export async function deleteReward(id: string, user: JWTPayload) {
  await connectDB();

  const reward = await Reward.findById(id);
  if (!reward) throw new Error("Reward not found");

  // Auth: Only creator or admin can delete
  if (user.role !== "admin" && reward.creatorId.toString() !== user.userId) {
    throw new Error("Access denied. You can only delete rewards you created.");
  }

  // Delete image file
  if (reward.imageUrl) {
    await deleteFile(reward.imageUrl);
  }

  await Reward.findByIdAndDelete(id);
}
