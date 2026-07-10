export const mockData = {
  dashboard: () => ({
    candidate: {
      id: "mock-user",
      name: "User",
      email: "user@example.com",
      avatar: "",
      role: "Aspiring Developer",
      targetRole: "Full Stack Developer",
      location: "",
    },
    scores: {
      careerScore: 86,
      atsScore: 82,
      interviewScore: 80,
      learningProgress: 74,
      jobMatch: 81,
      resumeStatus: "Uploaded",
      readiness: 79,
    },
    interviewCount: 2,
    latestInterview: {
      id: "mock-interview-1",
      overallScore: 80,
      company: "Lenovo",
      role: "Frontend Developer",
    },
    latestRoadmap: {
      id: "mock-roadmap-1",
      goal: "Full Stack Developer",
      steps: [
        { title: "Master React Patterns", status: "completed", weeks: "1-3", detail: "Hooks, Context, Performance" },
        { title: "Learn Node & Express", status: "in-progress", weeks: "4-7", detail: "REST APIs, Auth, Middleware" },
        { title: "Docker & CI/CD", status: "pending", weeks: "8-10", detail: "Containerize apps, GitHub Actions" },
        { title: "AWS Fundamentals", status: "pending", weeks: "11-13", detail: "EC2, S3, Lambda" },
      ],
    },
    latestCareer: {
      summary: "Strong frontend fundamentals with growing backend exposure.",
      path: "Full Stack Developer",
      roles: [
        { title: "Frontend Developer", match: 92 },
        { title: "Full Stack Developer", match: 81 },
      ],
    },
    activity: [
      { type: "resume", text: "Resume analyzed — score 84", at: new Date(Date.now() - 86400000 * 2).toISOString() },
      { type: "ats", text: "ATS scan — score 82", at: new Date(Date.now() - 86400000).toISOString() },
      { type: "career", text: "Career analysis generated", at: new Date().toISOString() },
      { type: "interview", text: "Interview completed — 80/100", at: new Date(Date.now() - 86400000 * 3).toISOString() },
    ],
    notifications: [
      { id: "n1", title: "Resume analyzed", message: "Your resume scored 84/100", type: "info", read: false, createdAt: new Date().toISOString() },
      { id: "n2", title: "New job matches", message: "3 new jobs match your profile", type: "info", read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
    ],
  }),

  analytics: () => ({
    resumeScoreHistory: [
      { date: new Date(Date.now() - 86400000 * 5).toISOString(), score: 70 },
      { date: new Date(Date.now() - 86400000 * 4).toISOString(), score: 73 },
      { date: new Date(Date.now() - 86400000 * 3).toISOString(), score: 78 },
      { date: new Date(Date.now() - 86400000 * 2).toISOString(), score: 80 },
      { date: new Date(Date.now() - 86400000).toISOString(), score: 84 },
      { date: new Date().toISOString(), score: 86 },
    ],
    atsHistory: [
      { date: new Date(Date.now() - 86400000 * 4).toISOString(), score: 65 },
      { date: new Date(Date.now() - 86400000 * 3).toISOString(), score: 68 },
      { date: new Date(Date.now() - 86400000 * 2).toISOString(), score: 72 },
      { date: new Date(Date.now() - 86400000).toISOString(), score: 75 },
      { date: new Date().toISOString(), score: 82 },
    ],
    interviewPerformance: [
      { label: "Interview 1", score: 72 },
      { label: "Interview 2", score: 80 },
    ],
    careerGrowth: [
      { label: "v1", fit: 65, demand: 70 },
      { label: "v2", fit: 70, demand: 75 },
      { label: "v3", fit: 81, demand: 88 },
    ],
    skillGrowth: [
      { label: "Stage 1", value: 40 },
      { label: "Stage 2", value: 52 },
      { label: "Stage 3", value: 64 },
    ],
    jobApplications: [
      { label: "Set 1", count: 4 },
      { label: "Set 2", count: 6 },
    ],
    learningProgress: 74,
    latest: {
      resumeScore: 86,
      atsScore: 82,
      interviewScore: 80,
      careerScore: 86,
      learningProgress: 74,
      jobMatch: 81,
    },
  }),

  resume: () => ({
    resumes: [
      {
        id: "mock-resume-1",
        fileName: "user_resume.pdf",
        fileUrl: "",
        publicId: "",
        resumeText: "",
        extracted: {
          name: "User",
          education: ["B.Tech Computer Science"],
          experience: ["1 year at Tech Corp"],
          projects: ["E-commerce Platform", "Chat Application"],
          certificates: [],
          technicalSkills: ["React", "Node.js", "JavaScript", "SQL"],
          softSkills: ["Communication", "Teamwork"],
          strengths: ["Clear structure", "Strong projects", "Quantified impact"],
          weaknesses: ["Missing keywords for ATS", "No certifications listed"],
        },
        resumeScore: 84,
        atsScore: 82,
        careerScore: 86,
        summary: "Strong frontend developer with backend exposure. Good project portfolio.",
        suggestions: [
          "Add 'Agile', 'CI/CD', 'REST API' keywords",
          "Include AWS certification",
          "Shorten summary to 3 lines",
        ],
        createdAt: new Date().toISOString(),
      },
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
    goal: "Full Stack Developer",
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
    breakdown: [
      { label: "Skills", value: 85 },
      { label: "Projects", value: 72 },
      { label: "Experience", value: 60 },
      { label: "Education", value: 100 },
      { label: "Online Presence", value: 100 },
    ],
    suggestions: [
      "Complete your profile",
      "Add 2-3 projects",
      "List your experience",
    ],
  }),

  ats: () => ({
    id: "mock-ats-1",
    targetRole: "Full Stack Developer",
    score: 82,
    keywordsFound: ["React", "JavaScript", "Agile", "REST", "Git"],
    keywordsMissing: ["TypeScript", "AWS", "CI/CD", "Docker"],
    tips: [
      "Include a Skills section with exact job keywords",
      "Use standard section headings (Experience, Education)",
      "Avoid tables and images for critical content",
    ],
    createdAt: new Date().toISOString(),
  }),

  resumeList: () => ({
    resumes: [
      {
        id: "mock-resume-1",
        fileName: "user_resume.pdf",
        fileUrl: "",
        publicId: "",
        resumeText: "",
        extracted: {
          name: "User",
          education: ["B.Tech Computer Science"],
          experience: ["1 year at Tech Corp"],
          projects: ["E-commerce Platform", "Chat Application"],
          certificates: [],
          technicalSkills: ["React", "Node.js", "JavaScript", "SQL"],
          softSkills: ["Communication", "Teamwork"],
          strengths: ["Clear structure", "Strong projects", "Quantified impact"],
          weaknesses: ["Missing keywords for ATS", "No certifications listed"],
        },
        resumeScore: 84,
        atsScore: 82,
        careerScore: 86,
        summary: "Strong frontend developer with backend exposure. Good project portfolio.",
        suggestions: [
          "Add 'Agile', 'CI/CD', 'REST API' keywords",
          "Include AWS certification",
          "Shorten summary to 3 lines",
        ],
        createdAt: new Date().toISOString(),
      },
    ],
  }),

  resumeItem: () => ({
    id: "mock-resume-1",
    fileName: "user_resume.pdf",
    fileUrl: "",
    publicId: "",
    resumeText: "",
    extracted: {
      name: "User",
      education: ["B.Tech Computer Science"],
      experience: ["1 year at Tech Corp"],
      projects: ["E-commerce Platform", "Chat Application"],
      certificates: [],
      technicalSkills: ["React", "Node.js", "JavaScript", "SQL"],
      softSkills: ["Communication", "Teamwork"],
      strengths: ["Clear structure", "Strong projects", "Quantified impact"],
      weaknesses: ["Missing keywords for ATS", "No certifications listed"],
    },
    resumeScore: 84,
    atsScore: 82,
    careerScore: 86,
    summary: "Strong frontend developer with backend exposure. Good project portfolio.",
    suggestions: [
      "Add 'Agile', 'CI/CD', 'REST API' keywords",
      "Include AWS certification",
      "Shorten summary to 3 lines",
    ],
    createdAt: new Date().toISOString(),
  }),

  jobRecommendation: () => ({
    jobs: [
      { title: "Frontend Developer", company: "Infosys", location: "Bengaluru", match: 94, type: "Full-time", salary: "₹8-12 LPA", missingSkills: ["System Design"], tips: ["Prepare behavioral stories"] },
      { title: "Full Stack Engineer", company: "TCS", location: "Hyderabad", match: 88, type: "Full-time", salary: "₹10-14 LPA", missingSkills: ["Docker"], tips: ["Build a portfolio project"] },
      { title: "React Developer", company: "Wipro", location: "Pune", match: 82, type: "Contract", salary: "₹7-9 LPA", missingSkills: ["AWS"], tips: ["Get certified"] },
      { title: "Software Engineer", company: "Cognizant", location: "Chennai", match: 79, type: "Full-time", salary: "₹6-10 LPA", missingSkills: ["GraphQL"], tips: ["Learn modern JS frameworks"] },
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
    name: "User",
    email: "user@example.com",
    role: "Aspiring Developer",
    location: "",
    phone: "",
    bio: "",
    skills: [],
    experience: [],
    education: "",
    avatar: "",
    strength: 70,
  }),

  chat: () => ({
    messages: [
      { from: "bot", text: "Hi! I'm your AI Career Mentor. Ask me anything about your career path." },
    ],
  }),
};
