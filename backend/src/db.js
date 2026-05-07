const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in .env");
  }

  try {
    await mongoose.connect(uri);
    console.log(`✅ Kết nối thành công tới MongoDB: ${mongoose.connection.name}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err;
  }

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
  });
}

async function testDb() {
  try {
    const ok = mongoose.connection.readyState === 1;
    if (ok) console.log(`✅ MongoDB connected: ${mongoose.connection.name}`);
    return ok;
  } catch (e) {
    console.error("❌ DB Check error:", e.message);
    return false;
  }
}

module.exports = { mongoose, connectDB, testDb };
