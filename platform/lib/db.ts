// /lib/db.ts
import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL!);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};