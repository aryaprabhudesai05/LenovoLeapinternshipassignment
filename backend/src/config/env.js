import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 8000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/career_mentor",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-key-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  useMockAi: (process.env.USE_MOCK_AI || "true") === "true" || !process.env.GEMINI_API_KEY,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
};
