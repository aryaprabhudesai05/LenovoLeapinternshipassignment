import mongoose from "mongoose";

// Extended candidate profile, kept separate from the auth User document.
const ProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    phone: { type: String, default: "" },
    college: { type: String, default: "" },
    degree: { type: String, default: "" },
    branch: { type: String, default: "" },
    graduationYear: { type: Number },
    skills: { type: [String], default: [] },
    projects: { type: [String], default: [] },
    experience: { type: [String], default: [] },
    linkedIn: { type: String, default: "" },
    github: { type: String, default: "" },
    location: { type: String, default: "" },
    summary: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    targetRole: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", ProfileSchema);
