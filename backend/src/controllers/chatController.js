import { generateText } from "../utils/gemini.js";
import { mockData } from "../utils/mockData.js";

export async function getChat(req, res, next) {
  try {
    res.json({ messages: [] });
  } catch (err) {
    next(err);
  }
}

export async function postChat(req, res, next) {
  try {
    const message = req.body?.message || "";
    const fallback =
      "Based on your profile, I recommend focusing on system design and cloud fundamentals to boost your career readiness. Keep building projects!";
    const reply = await generateText(
      `You are a friendly AI Career Mentor. Answer the user's question concisely and helpfully.\nUser: ${message}`,
      fallback
    );
    res.json({ reply });
  } catch (err) {
    next(err);
  }
}
