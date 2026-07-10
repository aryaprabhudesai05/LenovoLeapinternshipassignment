import { generateText } from "../utils/gemini.js";
import { getUserContext } from "../utils/aiContext.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const predictSalary = asyncHandler(async (req, res) => {
  const ctx = await getUserContext(req.user.id);
  const role = req.body?.role || ctx.targetRole || "Software Engineer";
  const location = req.body?.location || ctx.location || "India";
  const experience = req.body?.experience || ctx.experience?.length || 0;

  const salary = await generateText(
    `Estimate the salary range (in INR) for a ${role} with ${experience} years experience in ${location}. ` +
      `Give a concise range and a one-line note. Candidate skills: ${(ctx.skills || []).join(", ")}.`,
    "₹6,00,000 – ₹12,00,000 per annum depending on role and location."
  );
  res.json({ role, location, experience, prediction: salary });
});
