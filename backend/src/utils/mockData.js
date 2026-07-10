// Deterministic fallback data mirroring the frontend's expected response shapes.
// Used when USE_MOCK_AI=true or when Gemini/Mongo are not configured.

export const mockData = {
  dashboard: () => ({
    careerScore: 86,
    atsScore: 82,
    learningProgress: 74,
    jobMatch: 81,
    resumeScore: 84,
    profileStrength: 78,
    readiness: 79,
    trends: { careerScore: 4, atsScore: 2, learningProgress: 6, jobMatch: -3 },
    salary: [
      { month: "Jan", value: 6.2 },
      { month: "Feb", value: 6.5 },
      { month: "Mar", value: 7.1 },
      { month: "Apr", value: 7.4 },
      { month: "May", value: 8.0 },
      { month: "Jun", value: 8.6 },
    ],
    skills: [
      { name: "React", level: 90 },
      { name: "Node.js", level: 75 },
      { name: "Python", level: 85 },
      { name: "SQL", level: 60 },
      { name: "AWS", level: 45 },
      { name: "ML", level: 55 },
    ],
    activity: [
      { name: "Mon", visits: 12 },
      { name: "Tue", visits: 18 },
      { name: "Wed", visits: 9 },
      { name: "Thu", visits: 22 },
      { name: "Fri", visits: 16 },
      { name: "Sat", visits: 7 },
      { name: "Sun", visits: 5 },
    ],
    recommendations: [
      { title: "Improve SQL proficiency", detail: "Complete advanced SQL course", priority: "High" },
      { title: "Add cloud projects", detail: "Deploy 2 apps on AWS", priority: "Medium" },
      { title: "Certify in ML", detail: "Andrew Ng specialization", priority: "Medium" },
    ],
  }),

  analytics: () => ({
    scoreOverTime: [
      { month: "Jan", career: 70, ats: 65, readiness: 60 },
      { month: "Feb", career: 73, ats: 68, readiness: 64 },
      { month: "Mar", career: 78, ats: 72, readiness: 70 },
      { month: "Apr", career: 80, ats: 75, readiness: 73 },
      { month: "May", career: 84, ats: 79, readiness: 76 },
      { month: "Jun", career: 86, ats: 82, readiness: 79 },
    ],
    skillRadar: [
      { skill: "Technical", value: 85 },
      { skill: "Communication", value: 70 },
      { skill: "Leadership", value: 60 },
      { skill: "Problem Solving", value: 88 },
      { skill: "Domain", value: 72 },
    ],
    activity: [
      { name: "Mon", visits: 12 },
      { name: "Tue", visits: 18 },
      { name: "Wed", visits: 9 },
      { name: "Thu", visits: 22 },
      { name: "Fri", visits: 16 },
      { name: "Sat", visits: 7 },
      { name: "Sun", visits: 5 },
    ],
    metrics: [
      { label: "Sessions", value: 142, delta: 12 },
      { label: "Resumes Scanned", value: 9, delta: 3 },
      { label: "Interviews", value: 14, delta: 5 },
      { label: "Avg Score", value: 81, delta: 4 },
    ],
  }),

  resume: () => ({
    score: 84,
    fileName: "arya_resume.pdf",
    strengths: ["Clear structure", "Strong projects", "Quantified impact"],
    weaknesses: ["Missing keywords for ATS", "No certifications listed"],
    suggestions: [
      "Add 'Agile', 'CI/CD', 'REST API' keywords",
      "Include AWS certification",
      "Shorten summary to 3 lines",
    ],
    sections: [
      { name: "Contact", score: 95 },
      { name: "Experience", score: 82 },
      { name: "Skills", score: 78 },
      { name: "Education", score: 90 },
      { name: "Projects", score: 88 },
    ],
  }),

  career: () => ({
    summary:
      "You show strong frontend fundamentals with growing backend exposure. Your trajectory aligns with a Full Stack role within 12 months.",
    strengths: ["React", "Problem Solving", "Communication"],
    improvements: ["System Design", "Cloud", "Testing"],
    path: "Full Stack Developer",
    marketDemand: 88,
    fit: 81,
    roles: [
      { title: "Frontend Developer", match: 92 },
      { title: "Full Stack Developer", match: 81 },
      { title: "UI Engineer", match: 76 },
    ],
  }),

  skillGap: () => ({
    current: ["React", "JavaScript", "Git", "HTML/CSS"],
    required: ["React", "Node.js", "Docker", "AWS", "TypeScript", "GraphQL"],
    gaps: [
      { skill: "Node.js", level: 40, required: 80 },
      { skill: "Docker", level: 20, required: 70 },
      { skill: "AWS", level: 30, required: 75 },
      { skill: "TypeScript", level: 55, required: 85 },
      { skill: "GraphQL", level: 15, required: 60 },
    ],
    courses: [
      { skill: "Node.js", course: "Node.js Complete Guide", hours: 32 },
      { skill: "Docker", course: "Docker for Developers", hours: 12 },
      { skill: "AWS", course: "AWS Cloud Practitioner", hours: 20 },
    ],
  }),

  roadmap: () => ({
    steps: [
      { title: "Master React Patterns", status: "completed", weeks: "1-3", detail: "Hooks, Context, Performance" },
      { title: "Learn Node & Express", status: "in-progress", weeks: "4-7", detail: "REST APIs, Auth, Middleware" },
      { title: "Docker & CI/CD", status: "pending", weeks: "8-10", detail: "Containerize apps, GitHub Actions" },
      { title: "AWS Fundamentals", status: "pending", weeks: "11-13", detail: "EC2, S3, Lambda" },
      { title: "System Design", status: "pending", weeks: "14-16", detail: "Scalability, Caching" },
    ],
  }),

  jobs: () => ({
    jobs: [
      { id: 1, title: "Frontend Developer", company: "Infosys", location: "Bengaluru", match: 94, type: "Full-time", salary: "₹8-12 LPA" },
      { id: 2, title: "Full Stack Engineer", company: "TCS", location: "Hyderabad", match: 88, type: "Full-time", salary: "₹10-14 LPA" },
      { id: 3, title: "React Developer", company: "Wipro", location: "Pune", match: 82, type: "Contract", salary: "₹7-9 LPA" },
      { id: 4, title: "Software Engineer", company: "Cognizant", location: "Chennai", match: 79, type: "Full-time", salary: "₹6-10 LPA" },
    ],
  }),

  salary: () => ({
    prediction: 11.4,
    range: [8.5, 14.2],
    factors: [
      { name: "Experience", value: 30 },
      { name: "Skills", value: 25 },
      { name: "Location", value: 20 },
      { name: "Role", value: 15 },
      { name: "Education", value: 10 },
    ],
    history: [
      { year: 2021, salary: 5.5 },
      { year: 2022, salary: 7.0 },
      { year: 2023, salary: 8.8 },
      { year: 2024, salary: 10.2 },
      { year: 2025, salary: 11.4 },
    ],
  }),

  readiness: () => ({
    score: 79,
    dimensions: [
      { name: "Technical", value: 85 },
      { name: "Communication", value: 72 },
      { name: "Interview", value: 68 },
      { name: "Portfolio", value: 80 },
      { name: "Resume", value: 84 },
    ],
    checklist: [
      { item: "LinkedIn optimized", done: true },
      { item: "3 portfolio projects", done: true },
      { item: "Mock interviews done", done: false },
      { item: "Resume ATS passed", done: true },
      { item: "Referral network", done: false },
    ],
  }),

  ats: () => ({
    score: 82,
    keywordsFound: ["React", "JavaScript", "Agile", "REST", "Git"],
    keywordsMissing: ["TypeScript", "AWS", "CI/CD", "Docker"],
    tips: [
      "Include a Skills section with exact job keywords",
      "Use standard section headings (Experience, Education)",
      "Avoid tables and images for critical content",
    ],
  }),

  resources: () => ({
    resources: [
      { id: 1, title: "System Design Primer", type: "Article", tag: "System Design", read: "12 min" },
      { id: 2, title: "React Performance", type: "Video", tag: "Frontend", read: "24 min" },
      { id: 3, title: "AWS Certified", type: "Course", tag: "Cloud", read: "20 hrs" },
      { id: 4, title: "Behavioral Interview", type: "Guide", tag: "Interview", read: "8 min" },
    ],
  }),

  profile: () => ({
    name: "Arya Prabhudesai",
    email: "arya@example.com",
    role: "Full Stack Developer",
    location: "Bengaluru, India",
    phone: "+91 98765 43210",
    bio: "Aspiring full stack developer passionate about building scalable web apps.",
    skills: ["React", "Node.js", "Python", "SQL"],
    experience: "1 year",
    education: "B.Tech Computer Science",
    avatar: "https://i.pravatar.cc/120?img=12",
    strength: 78,
  }),

  chat: () => ({
    messages: [
      { from: "bot", text: "Hi Arya! I'm your AI Career Mentor. Ask me anything about your career path." },
    ],
  }),
};
