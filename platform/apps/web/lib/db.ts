import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI ?? process.env.MONGODB_URL

let cached = (global as { mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } }).mongoose

if (!cached) {
  cached = (global as { mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } }).mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached?.conn) {
    return cached.conn
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI or MONGODB_URL environment variable is not defined")
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached!.conn = await cached!.promise
  } catch (e) {
    cached!.promise = null
    throw e
  }

  return cached!.conn
}
