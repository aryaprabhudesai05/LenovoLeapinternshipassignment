import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    role: { type: String, default: "Aspiring Developer" },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    skills: { type: [String], default: [] },
    location: { type: String, default: "" },
    phone: { type: String, default: "" },
    strength: { type: Number, default: 70 },
    provider: { type: String, default: "local" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
