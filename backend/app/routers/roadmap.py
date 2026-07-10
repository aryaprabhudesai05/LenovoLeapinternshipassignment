from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.security import get_current_user
from app.ai.agents import learning_roadmap_agent

router = APIRouter(prefix="/roadmap", tags=["Roadmap"])


@router.post("/generate")
def generate(payload: dict, user=Depends(get_current_user), db: Session = Depends(get_db)):
    return learning_roadmap_agent(payload.get("target_role", ""))
