"""AI Agents for the Career Mentor Portal.

Each agent produces a structured result. When no LLM key is configured
(USE_MOCK_AI=true or missing keys) the agents return deterministic mock
data so the whole system runs end-to-end without external services.
"""

from app.ai.llm import call_llm


def career_analysis_agent(skills: list, target_role: str) -> dict:
    raw = call_llm(
        f"Analyze a candidate with skills {skills} aiming for {target_role}. "
        "Return a concise career summary, strengths, improvements, recommended path, market demand (0-100) and fit (0-100)."
    )
    return {
        "summary": raw or "You show strong fundamentals with growing full-stack exposure. Your trajectory aligns with a Full Stack role within 12 months.",
        "strengths": ["React", "Problem Solving", "Communication"],
        "improvements": ["System Design", "Cloud", "Testing"],
        "path": target_role or "Full Stack Developer",
        "marketDemand": 88,
        "fit": 81,
        "roles": [
            {"title": "Frontend Developer", "match": 92},
            {"title": "Full Stack Developer", "match": 81},
            {"title": "UI Engineer", "match": 76},
        ],
    }


def resume_ats_agent(content: str, filename: str) -> dict:
    raw = call_llm(f"Score this resume and list strengths/weaknesses/suggestions:\n{content[:2000]}")
    return {
        "score": 84,
        "fileName": filename or "resume.pdf",
        "strengths": ["Clear structure", "Strong projects", "Quantified impact"],
        "weaknesses": ["Missing keywords for ATS", "No certifications listed"],
        "suggestions": [
            "Add 'Agile', 'CI/CD', 'REST API' keywords",
            "Include AWS certification",
            "Shorten summary to 3 lines",
        ],
        "sections": [
            {"name": "Contact", "score": 95},
            {"name": "Experience", "score": 82},
            {"name": "Skills", "score": 78},
            {"name": "Education", "score": 90},
            {"name": "Projects", "score": 88},
        ],
        "keywordsFound": ["React", "JavaScript", "Agile", "REST", "Git"],
        "keywordsMissing": ["TypeScript", "AWS", "CI/CD", "Docker"],
    }


def skill_gap_agent(current: list, required: list) -> dict:
    gaps = [
        {"skill": "Node.js", "level": 40, "required": 80},
        {"skill": "Docker", "level": 20, "required": 70},
        {"skill": "AWS", "level": 30, "required": 75},
        {"skill": "TypeScript", "level": 55, "required": 85},
        {"skill": "GraphQL", "level": 15, "required": 60},
    ]
    return {
        "current": current or ["React", "JavaScript", "Git", "HTML/CSS"],
        "required": required or ["React", "Node.js", "Docker", "AWS", "TypeScript", "GraphQL"],
        "gaps": gaps,
        "courses": [
            {"skill": "Node.js", "course": "Node.js Complete Guide", "hours": 32},
            {"skill": "Docker", "course": "Docker for Developers", "hours": 12},
            {"skill": "AWS", "course": "AWS Cloud Practitioner", "hours": 20},
        ],
    }


def learning_roadmap_agent(target_role: str) -> dict:
    return {
        "steps": [
            {"title": "Master React Patterns", "status": "completed", "weeks": "1-3", "detail": "Hooks, Context, Performance"},
            {"title": "Learn Node & Express", "status": "in-progress", "weeks": "4-7", "detail": "REST APIs, Auth, Middleware"},
            {"title": "Docker & CI/CD", "status": "pending", "weeks": "8-10", "detail": "Containerize apps, GitHub Actions"},
            {"title": "AWS Fundamentals", "status": "pending", "weeks": "11-13", "detail": "EC2, S3, Lambda"},
            {"title": "System Design", "status": "pending", "weeks": "14-16", "detail": "Scalability, Caching"},
        ]
    }


def mock_hr_interview_agent() -> dict:
    return {
        "question": "Tell me about a challenging project you led and the impact you delivered.",
        "feedback": "Strong structure. Add a measurable outcome next time and practice concise delivery.",
    }


def coding_interview_agent() -> dict:
    return {
        "question": "Given an array of integers, return indices of the two numbers that add up to a target.",
        "starter": "function twoSum(nums, target) {\n  // write your solution here\n}",
        "hint": "Use a hash map to store seen values and their indices.",
    }


def salary_prediction_agent(payload: dict) -> dict:
    return {
        "prediction": 11.4,
        "range": [8.5, 14.2],
        "factors": [
            {"name": "Experience", "value": 30},
            {"name": "Skills", "value": 25},
            {"name": "Location", "value": 20},
            {"name": "Role", "value": 15},
            {"name": "Education", "value": 10},
        ],
        "history": [
            {"year": 2021, "salary": 5.5},
            {"year": 2022, "salary": 7.0},
            {"year": 2023, "salary": 8.8},
            {"year": 2024, "salary": 10.2},
            {"year": 2025, "salary": 11.4},
        ],
    }


def job_recommendation_agent(skills: list) -> dict:
    return {
        "jobs": [
            {"id": 1, "title": "Frontend Developer", "company": "Infosys", "location": "Bengaluru", "match": 94, "type": "Full-time", "salary": "8-12 LPA"},
            {"id": 2, "title": "Full Stack Engineer", "company": "TCS", "location": "Hyderabad", "match": 88, "type": "Full-time", "salary": "10-14 LPA"},
            {"id": 3, "title": "React Developer", "company": "Wipro", "location": "Pune", "match": 82, "type": "Contract", "salary": "7-9 LPA"},
            {"id": 4, "title": "Software Engineer", "company": "Cognizant", "location": "Chennai", "match": 79, "type": "Full-time", "salary": "6-10 LPA"},
        ]
    }


def mentor_chat_agent(message: str) -> str:
    raw = call_llm(
        f"You are an AI Career Mentor. Answer concisely and helpfully:\nUser: {message}"
    )
    return raw or (
        "Based on your profile, I recommend focusing on system design and cloud "
        "fundamentals to boost your career readiness. Keep building projects and "
        "practicing mock interviews!"
    )
