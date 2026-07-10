import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri);
    console.log(`[db] MongoDB connected: ${mongoose.connection.name}`);
  } catch (err) {
    console.warn(
      "[db] MongoDB connection failed — running without database (mock data only):",
      err.message
    );
  }
}

mongoose.connection.on("disconnected", () => console.warn("[db] MongoDB disconnected"));

export default mongoose;
