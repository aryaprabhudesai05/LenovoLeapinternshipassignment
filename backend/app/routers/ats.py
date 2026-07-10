from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user
from app.ai.agents import resume_ats_agent

router = APIRouter(prefix="/ats", tags=["ATS"])


@router.post("/check")
def ats_check(payload: dict, user=Depends(get_current_user), db: Session = Depends(get_db)):
    result = resume_ats_agent(payload.get("content", ""), payload.get("filename", "resume.pdf"))
    return {
        "score": result["score"],
        "keywordsFound": result["keywordsFound"],
        "keywordsMissing": result["keywordsMissing"],
        "tips": [
            "Include a Skills section with exact job keywords",
            "Use standard section headings (Experience, Education)",
            "Avoid tables and images for critical content",
        ],
    }
