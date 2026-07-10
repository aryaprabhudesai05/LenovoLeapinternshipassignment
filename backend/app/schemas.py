from pydantic import BaseModel
from typing import List, Optional


class UserOut(BaseModel):
    uid: str
    name: str
    email: str
    role: str = "Student"


class RegisterIn(BaseModel):
    name: str
    email: str
    password: str


class LoginIn(BaseModel):
    email: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ResumeIn(BaseModel):
    filename: str
    content: str


class CareerIn(BaseModel):
    skills: List[str] = []
    target_role: str = ""


class InterviewIn(BaseModel):
    kind: str = "hr"
    question: Optional[str] = None
    answer: Optional[str] = None


class RoadmapIn(BaseModel):
    target_role: str = ""


class JobIn(BaseModel):
    skills: List[str] = []


class SalaryIn(BaseModel):
    experience: float = 0
    skills: List[str] = []
    location: str = ""
    role: str = ""
