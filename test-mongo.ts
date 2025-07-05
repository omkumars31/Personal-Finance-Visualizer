import mongoose from "mongoose";

async function testMongo() {
  try {
    const uri = process.env.MONGODB_URI || "";
    await mongoose.connect(uri);
    console.log("✅ Test MongoDB connection successful");
    process.exit(0);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

testMongo();
