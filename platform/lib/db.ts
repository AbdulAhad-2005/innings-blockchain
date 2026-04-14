// /lib/db.ts
import mongoose from "mongoose";

export const connectDB = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("MongoDB is already connected");
    return;
  }

  const mongoUri = process.env.MONGODB_URI ?? process.env.MONGODB_URL;

  if (!mongoUri) {
    throw new Error(
      "Missing MongoDB connection string. Set MONGODB_URI (or MONGODB_URL) in your environment."
    );
  }

  try {
    console.log("Attempting to connect to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};
