import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

(async () => {
  try {
    // --- MongoDB ---
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected OK");

    // --- Cloudinary ---
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const result = await cloudinary.api.ping();
    console.log("✅ Cloudinary connected OK:", result.status);

    process.exit(0);
  } catch (err) {
    console.error("❌ Connection error:", err.message);
    process.exit(1);
  }
})();
