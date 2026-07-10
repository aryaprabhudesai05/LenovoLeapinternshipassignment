import InterviewSession from "../models/InterviewSession.js";
import { generateText, generateJSON } from "../utils/gemini.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { HttpError } from "../middleware/errorHandler.js";

const COMPANIES = [
  "Google", "Microsoft", "Amazon", "TCS", "Infosys", "Wipro",
  "Accenture", "Capgemini", "Deloitte", "Cognizant", "Other",
];

const FALLBACK_FIRST_QUESTION = "Tell me about yourself.";

const FALLBACK_FEEDBACK =
  "Strong structure. Add a measurable outcome next time and keep answers under two minutes.";

const CODING_PROBLEMS = [
  {
    question: "Write a function that returns indices of the two numbers that add up to target.",
    difficulty: "Easy",
    tags: ["Arrays", "Hash Map"],
    hint: "Use a hash map to store seen values and their indices.",
    tests: [
      { input: "nums=[2,7,11,15], target=9", expected: "[0,1]" },
      { input: "nums=[3,2,4], target=6", expected: "[1,2]" },
    ],
  },
  {
    question: "Given the head of a singly linked list, reverse the list and return it.",
    difficulty: "Medium",
    tags: ["Linked List", "Recursion"],
    hint: "Iterate and re-point each node's next to the previous node.",
    tests: [{ input: "head=[1,2,3,4,5]", expected: "[5,4,3,2,1]" }],
  },
  {
    question: "Determine if a string containing ()[]{} is valid.",
    difficulty: "Easy",
    tags: ["Stack", "String"],
    hint: "Use a stack and match closing brackets with the most recent opener.",
    tests: [
      { input: 's="()"', expected: "true" },
      { input: 's="(]"', expected: "false" },
    ],
  },
];

// ----------------------------- Heuristics (offline fallback) -----------------------------

function heuristicScores(transcript = "") {
  const t = transcript || "";
  const words = t.trim().split(/\s+/).filter(Boolean).length;
  const sentences = t.split(/[.!?]+/).filter(Boolean).length || 1;
  const leadershipHits = (t.match(/\b(led|lead|managed|mentored|team|owned|drove)\b/gi) || []).length;
  const techHits = (t.match(/\b(system|api|database|algorithm|framework|architecture|scal|deploy)\b/gi) || []).length;
  const avgWordsPerSentence = words / sentences;
  const fillers = (t.match(/\b(um|uh|like|you know|basically)\b/gi) || []).length;

  const communication = Math.min(98, 45 + words * 1.1);
  const confidence = Math.min(98, 48 + words * 0.8 + (t.toLowerCase().includes("i") ? 4 : 0));
  const technical = Math.min(98, 38 + words * 0.8 + techHits * 4);
  const grammar = Math.min(98, 60 + sentences * 3 - (avgWordsPerSentence > 32 ? 12 : 0));
  const fluency = Math.min(98, 70 + words * 0.3 - fillers * 3);
  const leadership = Math.min(98, 40 + leadershipHits * 9);
  const problemSolving = Math.min(98, 42 + techHits * 5 + words * 0.4);
  const overall = Math.round(
    (communication + confidence + technical + grammar + fluency + leadership + problemSolving) / 7
  );
  return {
    communication: Math.round(communication),
    confidence: Math.round(confidence),
    technical: Math.round(technical),
    grammar: Math.round(grammar),
    fluency: Math.round(fluency),
    leadership: Math.round(leadership),
    problemSolving: Math.round(problemSolving),
    overall,
  };
}

function heuristicFeedback(qa) {
  const totalWords = qa.reduce((a, x) => a + (x.answer || "").trim().split(/\s+/).filter(Boolean).length, 0);
  const strengths = [
    totalWords > 150 ? "You spoke at good length and gave substantive answers." : "You participated actively in the conversation.",
    qa.length >= 3 ? "You handled multiple questions across the interview." : "You completed the core interview questions.",
  ];
  const weaknesses = [
    totalWords < 80 ? "Answers were brief — expand with concrete examples and outcomes." : "Some answers could include more measurable results.",
    "Consider pausing less and structuring responses with the STAR method.",
  ];
  const suggestions = [
    "Use the STAR method (Situation, Task, Action, Result) for behavioral answers.",
    "Quantify impact with metrics (e.g., 'improved performance by 30%').",
    "Keep answers to 1–2 minutes and lead with the most relevant point.",
  ];
  return {
    strengths: strengths.join(" "),
    weaknesses: weaknesses.join(" "),
    suggestions: suggestions.join(" "),
    report: `You completed a ${qa.length}-question AI interview. Overall score: ${heuristicScores(qa.map((x) => x.answer).join(" ")).overall}/100.`,
  };
}

// ----------------------------- AI prompt helpers -----------------------------

function buildHistory(qa) {
  return qa
    .map((x, i) => `Q${i + 1}: ${x.question}\nCandidate: ${x.answer || "(no answer)"}`)
    .join("\n\n");
}

async function generateFirstQuestion(company, interviewType) {
  const prompt = `You are an interviewer at ${company}. Conduct a ${interviewType} interview.
Ask ONLY the very first question a candidate would hear at the start of the interview.
For an HR interview the first question must be exactly: "Tell me about yourself."
For Technical/Behavioral, ask a natural opening question appropriate to the type.
Return ONLY the question text, no quotes, no extra commentary.`;
  return generateText(prompt, FALLBACK_FIRST_QUESTION);
}

async function generateNextQuestion(company, interviewType, qa) {
  const history = buildHistory(qa);
  const prompt = `You are an interviewer at ${company} conducting a ${interviewType} interview.
Here is the conversation so far:
${history}

Based on the candidate's answers, ask the NEXT relevant follow-up question.
Make it specific, build on what they said, and avoid repeating earlier questions.
Return ONLY the next question text, no quotes, no extra commentary.`;
  return generateText(prompt, "Can you elaborate on that with a concrete example?");
}

async function generateEvaluation(company, interviewType, qa) {
  const history = buildHistory(qa);
  const prompt = `You are an interview evaluator. Review this ${interviewType} interview for ${company}.

Conversation:
${history}

Score the candidate from 0-100 on each dimension and provide concise textual feedback.
Respond ONLY with valid minified JSON, no markdown, in this exact shape:
{
  "communication": number,
  "confidence": number,
  "technical": number,
  "grammar": number,
  "fluency": number,
  "leadership": number,
  "problemSolving": number,
  "overall": number,
  "strengths": "short paragraph",
  "weaknesses": "short paragraph",
  "suggestions": "short paragraph",
  "report": "one sentence summary"
}`;
  const fallbackScores = heuristicScores(qa.map((x) => x.answer).join(" "));
  const fb = heuristicFeedback(qa);
  const fallback = {
    ...fallbackScores,
    strengths: fb.strengths,
    weaknesses: fb.weaknesses,
    suggestions: fb.suggestions,
    report: fb.report,
  };
  const result = await generateJSON(prompt, fallback);
  // Ensure all numeric fields exist and are valid.
  const num = (v, d = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : d;
  };
  const scores = {
    communication: num(result.communication, fallbackScores.communication),
    confidence: num(result.confidence, fallbackScores.confidence),
    technical: num(result.technical, fallbackScores.technical),
    grammar: num(result.grammar, fallbackScores.grammar),
    fluency: num(result.fluency, fallbackScores.fluency),
    leadership: num(result.leadership, fallbackScores.leadership),
    problemSolving: num(result.problemSolving, fallbackScores.problemSolving),
    overall: num(result.overall, fallbackScores.overall),
  };
  return {
    ...scores,
    strengths: result.strengths || fb.strengths,
    weaknesses: result.weaknesses || fb.weaknesses,
    suggestions: result.suggestions || fb.suggestions,
    report: result.report || fb.report,
  };
}

// ----------------------------- Controllers -----------------------------

export async function startInterview(req, res, next) {
  try {
    const company = COMPANIES.includes(req.body?.company) ? req.body.company : "Other";
    const interviewType = ["HR", "Technical", "Behavioral"].includes(req.body?.interviewType)
      ? req.body.interviewType
      : "HR";
    const duration = Number(req.body?.duration) || 10;

    const firstQuestion = await generateFirstQuestion(company, interviewType);

    const session = await InterviewSession.create({
      user: req.user?.id || req.body?.userId || null,
      company,
      interviewType,
      role: req.body?.role || "",
      duration,
      questions: [{ question: firstQuestion, answer: "", time: 0 }],
      transcript: `AI: ${firstQuestion}\n`,
    });

    res.status(201).json({
      interviewId: session._id.toString(),
      firstQuestion,
    });
  } catch (err) {
    next(err);
  }
}

export async function answerInterview(req, res, next) {
  try {
    const { interviewId, answer, question } = req.body || {};
    if (!interviewId) throw new HttpError(400, "interviewId is required");
    const session = await InterviewSession.findById(interviewId);
    if (!session) throw new HttpError(404, "Interview not found");

    const last = session.questions[session.questions.length - 1];
    const time = Number(req.body?.time) || 0;
    if (last) {
      last.answer = (answer || "").toString();
      last.time = time;
    }
    session.transcript = `${session.transcript || ""}Candidate: ${answer || "(no answer)"}\n`;

    const nextQuestion = await generateNextQuestion(session.company, session.interviewType, session.questions);
    session.questions.push({ question: nextQuestion, answer: "", time: 0 });
    session.transcript = `${session.transcript}AI: ${nextQuestion}\n`;
    await session.save();

    res.json({ nextQuestion, questionCount: session.questions.length });
  } catch (err) {
    next(err);
  }
}

export async function endInterview(req, res, next) {
  try {
    const { interviewId } = req.body || {};
    if (!interviewId) throw new HttpError(400, "interviewId is required");
    const session = await InterviewSession.findById(interviewId);
    if (!session) throw new HttpError(404, "Interview not found");

    // Persist the final answer of the last question if provided.
    const finalAnswer = req.body?.answer;
    if (finalAnswer != null) {
      const last = session.questions[session.questions.length - 1];
      if (last && !last.answer) {
        last.answer = finalAnswer.toString();
        session.transcript = `${session.transcript || ""}Candidate: ${finalAnswer}\n`;
      }
    }

    const evaluation = await generateEvaluation(session.company, session.interviewType, session.questions);
    session.communicationScore = evaluation.communication;
    session.confidenceScore = evaluation.confidence;
    session.technicalScore = evaluation.technical;
    session.grammarScore = evaluation.grammar;
    session.fluencyScore = evaluation.fluency;
    session.leadershipScore = evaluation.leadership;
    session.problemSolvingScore = evaluation.problemSolving;
    session.overallScore = evaluation.overall;
    session.strengths = evaluation.strengths;
    session.weaknesses = evaluation.weaknesses;
    session.suggestions = evaluation.suggestions;
    session.report = evaluation.report;
    await session.save();

    res.json({ id: session._id.toString(), ...evaluation });
  } catch (err) {
    next(err);
  }
}

export async function getResult(req, res, next) {
  try {
    const session = await InterviewSession.findOne({ _id: req.params.id, user: req.user?.id }).lean();
    if (!session) throw new HttpError(404, "Interview not found");
    res.json({ session: { ...session, id: session._id.toString() } });
  } catch (err) {
    next(err);
  }
}

export async function hrQuestion(req, res, next) {
  try {
    const category = req.body?.category || "behavioral";
    const question = await generateText(
      `Act as an HR interviewer. Ask one ${category} interview question. Return only the question.`,
      FALLBACK_FIRST_QUESTION
    );
    res.json({ question });
  } catch (err) {
    next(err);
  }
}

export async function interviewFeedback(req, res, next) {
  try {
    const answer = req.body?.answer || "";
    const feedback = await generateText(
      `You are an interview coach. Give concise feedback (1-2 sentences) on this answer:\n"${answer}"`,
      FALLBACK_FEEDBACK
    );
    res.json({ feedback });
  } catch (err) {
    next(err);
  }
}

export async function codingProblem(req, res, next) {
  try {
    const index = req.body?.index ?? Math.floor(Math.random() * CODING_PROBLEMS.length);
    res.json(CODING_PROBLEMS[index % CODING_PROBLEMS.length]);
  } catch (err) {
    next(err);
  }
}

export const listInterviews = asyncHandler(async (req, res) => {
  const sessions = await InterviewSession.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .select("-questions.answer -videoUrl -transcript")
    .lean();
  res.json({ sessions: sessions.map((s) => ({ ...s, id: s._id.toString() })) });
});

export const getInterview = asyncHandler(async (req, res) => {
  const session = await InterviewSession.findOne({ _id: req.params.id, user: req.user.id }).lean();
  if (!session) throw new HttpError(404, "Interview not found");
  res.json({ session: { ...session, id: session._id.toString() } });
});

export const saveInterview = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const questions = body.questions || [];
  const session = await InterviewSession.create({
    user: req.user.id,
    company: body.company,
    interviewType: body.interviewType || "HR",
    role: body.role || "",
    duration: body.duration || 10,
    videoUrl: body.videoUrl || "",
    questions,
    transcript: body.transcript || "",
    communicationScore: body.communicationScore,
    confidenceScore: body.confidenceScore,
    technicalScore: body.technicalScore,
    grammarScore: body.grammarScore,
    fluencyScore: body.fluencyScore,
    leadershipScore: body.leadershipScore,
    problemSolvingScore: body.problemSolvingScore,
    overallScore: body.overallScore,
    strengths: body.strengths || "",
    weaknesses: body.weaknesses || "",
    suggestions: body.suggestions || "",
    report: body.report || "",
  });
  res.status(201).json({ ...session.toObject(), id: session._id.toString() });
});
