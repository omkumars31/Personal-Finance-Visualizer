import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error(" MONGODB_URI not defined in .env.local");
}

let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectToDB() {
  if (cached.conn) {
    console.log("✅Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    try {
      console.log("🔌 Connecting to MongoDB...");
      cached.promise = mongoose.connect(MONGODB_URI, {
        dbName: "finance",
      });
    } catch (err) {
      console.error(" Failed to connect to MongoDB:", err);
      throw err;
    }
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ MongoDB connected");
    return cached.conn;
  } catch (err) {
    console.error("Awaited connection failed:", err);
    throw err;
  }
}
