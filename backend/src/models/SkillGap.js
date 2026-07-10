import mongoose from "mongoose";

const SkillGapSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    targetRole: String,
    current: [String],
    required: [String],
    gaps: [{ skill: String, level: Number, required: Number, priority: String }],
    courses: [{ skill: String, course: String, hours: Number }],
  },
  { timestamps: true }
);

export default mongoose.model("SkillGap", SkillGapSchema);
