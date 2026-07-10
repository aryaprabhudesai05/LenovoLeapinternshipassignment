import { mockData } from "../utils/mockData";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

function getStoredUser() {
  return {
    id: localStorage.getItem("userId") || "mock-user-id",
    name: localStorage.getItem("userName") || "User",
    email: localStorage.getItem("userEmail") || "user@example.com",
    role: localStorage.getItem("userRole") || "Aspiring Developer",
    avatar: localStorage.getItem("userImage") || "",
    bio: "",
    skills: [],
    location: "",
    phone: "",
    strength: 70,
  };
}

export const mockApi = {
  async get(url) {
    await delay(450);
    if (url.includes("auth/me")) {
      return getStoredUser();
    }
    if (url.includes("dashboard")) return mockData.dashboard();
    if (url.includes("analytics")) return mockData.analytics();
    if (url.includes("resume")) return mockData.resumeList();
    if (url.includes("career")) return { analysis: mockData.career() };
    if (url.includes("skill")) return { skillGap: mockData.skillGap() };
    if (url.includes("roadmap")) return { roadmap: mockData.roadmap() };
    if (url.includes("jobs")) return mockData.jobs();
    if (url.includes("salary")) return { prediction: "₹8,00,000 – ₹14,00,000 per annum" };
    if (url.includes("readiness")) return mockData.readiness();
    if (url.includes("ats")) return { results: [mockData.ats()] };
    if (url.includes("resources")) return mockData.resources();
    if (url.includes("profile")) return mockData.profile();
    if (url.includes("chat")) return mockData.chat();
    if (url.includes("interview")) return { sessions: [] };
    if (url.includes("coding")) return { sessions: [] };
    if (url.includes("recommendations")) return { recommendations: [] };
    return mockData.dashboard();
  },
  async post(url, body) {
    await delay(700);
    if (url.includes("auth/login") || url.includes("auth/register")) {
      const user = {
        id: `mock-${Date.now()}`,
        name: body?.name || getStoredUser().name,
        email: body?.email || getStoredUser().email,
        role: body?.role || getStoredUser().role,
        avatar: "",
        bio: "",
        skills: [],
        location: "",
        phone: "",
        strength: 70,
      };
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userRole", user.role);
      localStorage.setItem("userImage", user.avatar);
      return {
        access_token: `mock-token-${user.id}`,
        user,
      };
    }
    if (url.includes("auth/forgot")) {
      return { message: "If an account exists, a reset link has been sent." };
    }
    if (url.includes("ats")) return { ...mockData.ats(), id: `mock-ats-${Date.now()}` };
    if (url.includes("resume")) return { ...mockData.resumeItem(), ...body };
    if (url.includes("career")) return { ...mockData.career(), id: `mock-career-${Date.now()}` };
    if (url.includes("skill")) return { ...mockData.skillGap(), id: `mock-skill-${Date.now()}` };
    if (url.includes("roadmap")) return { ...mockData.roadmap(), id: `mock-roadmap-${Date.now()}` };
    if (url.includes("chat"))
      return {
        reply:
          "Based on your profile, I recommend focusing on system design and cloud fundamentals to boost your career readiness. Keep building projects!",
      };
    if (url.includes("interview/start"))
      return {
        interviewId: `mock-${Date.now()}`,
        firstQuestion: "Tell me about yourself.",
      };
    if (url.includes("interview/answer"))
      return {
        nextQuestion: "Can you elaborate on that with a concrete example and the impact it had?",
        questionCount: ((body?._count || 0) + 2),
      };
    if (url.includes("interview/end"))
      return {
        id: "mock-end",
        communication: 82,
        confidence: 78,
        technical: 80,
        grammar: 85,
        fluency: 83,
        leadership: 76,
        problemSolving: 79,
        overall: 80,
        strengths: "You communicated clearly and gave structured answers with good examples.",
        weaknesses: "Some answers lacked measurable outcomes and were occasionally brief.",
        suggestions:
          "Use the STAR method and quantify impact. Keep answers to 1-2 minutes and lead with the most relevant point.",
        report: "You completed a mock AI interview with an overall score of 80/100.",
      };
    if (url.includes("interview"))
      return {
        question: "Tell me about a challenging project you led.",
        feedback: "Strong structure. Add a measurable outcome next time.",
      };
    if (url.includes("coding"))
      return {
        id: `mock-coding-${Date.now()}`,
        problem: { question: "Two Sum", difficulty: "Easy", tags: ["Arrays", "Hash Map"] },
        language: body?.language || "javascript",
        code: body?.code || "",
        passed: body?.passed || 0,
        total: body?.total || 0,
        score: body?.score || 0,
        durationSec: body?.durationSec || 0,
        createdAt: new Date().toISOString(),
      };
    if (url.includes("jobs/recommend"))
      return { ...mockData.jobRecommendation(), id: `mock-jobs-${Date.now()}` };
    return { ok: true, ...body };
  },
  async upload(url) {
    await delay(1200);
    return { url: "https://example.com/resume.pdf", score: 84 };
  },
};
