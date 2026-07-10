from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user
from app.ai.agents import resume_ats_agent

router = APIRouter(prefix="/resume", tags=["Resume"])


@router.post("/analyze")
def analyze_resume(payload: dict, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return resume_ats_agent(payload.get("content", ""), payload.get("filename", "resume.pdf"))


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...), user=Depends(get_current_user)):
    content = (await file.read()).decode("utf-8", errors="ignore")
    return resume_ats_agent(content, file.filename)
