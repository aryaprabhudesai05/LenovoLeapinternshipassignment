import { getUserContext, computeReadiness } from "../utils/aiContext.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getReadiness = asyncHandler(async (req, res) => {
  const ctx = await getUserContext(req.user.id);
  const score = computeReadiness(ctx);
  const breakdown = [
    { label: "Skills", value: Math.min(100, (ctx.skills?.length || 0) * 20) },
    { label: "Projects", value: Math.min(100, (ctx.projects?.length || 0) * 30) },
    { label: "Experience", value: Math.min(100, (ctx.experience?.length || 0) * 40) },
    { label: "Education", value: ctx.education ? 100 : 0 },
    { label: "Online Presence", value: ctx.linkedIn || ctx.github ? 100 : 0 },
  ];
  res.json({
    score,
    breakdown,
    suggestions:
      score < 60
        ? ["Complete your profile", "Add 2-3 projects", "List your experience"]
        : ["Keep building", "Prepare for interviews"],
  });
});
