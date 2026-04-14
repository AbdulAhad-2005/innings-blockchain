import { connectDB } from "../lib/db";
import Reward from "../models/Reward";
import CustomerUser from "../models/CustomerUser";
import RewardRedemption from "../models/RewardRedemption";
import mongoose from "mongoose";

export async function redeemReward(userId: string, rewardId: string) {
  await connectDB();

  const reward = await Reward.findById(rewardId);
  if (!reward) throw new Error("Reward not found");

  const now = new Date();
  if (now < reward.startDate || now > reward.expirationDate) {
    throw new Error("This reward is not currently active or has expired.");
  }

  // Use a transaction if available, otherwise atomic check/update
  // For this implementation, we'll do an atomic check and update on the user points
  
  const user = await CustomerUser.findById(userId);
  if (!user) throw new Error("User not found");

  if (user.points < reward.points) {
    throw new Error(`Insufficient points. You need ${reward.points} points, but you have ${user.points}.`);
  }

  // Deduct points and create redemption record
  // We use findOneAndUpdate with a filter to ensure points didn't change between check and update
  const updatedUser = await CustomerUser.findOneAndUpdate(
    { _id: userId, points: { $gte: reward.points } },
    { $inc: { points: -reward.points } },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("Deduction failed. Please try again.");
  }

  const redemption = await RewardRedemption.create({
    userId,
    rewardId,
    pointsSpent: reward.points,
    redeemedAt: new Date()
  });

  return redemption;
}

export async function getRedemptionsByUser(userId: string) {
  await connectDB();
  return await RewardRedemption.find({ userId }).populate("rewardId");
}
