from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON
from datetime import datetime

from app.database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    uid = Column(String(128), unique=True, index=True)
    name = Column(String(128))
    email = Column(String(128), unique=True, index=True)
    role = Column(String(64), default="Student")
    location = Column(String(128))
    phone = Column(String(32))
    bio = Column(Text)
    avatar = Column(String(256))
    created_at = Column(DateTime, default=datetime.utcnow)


class Resume(Base):
    __tablename__ = "resumes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    filename = Column(String(256))
    score = Column(Float, default=0)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(128))
    level = Column(Float, default=0)
    required = Column(Float, default=0)


class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(128))
    company = Column(String(128))
    location = Column(String(128))
    job_type = Column(String(64))
    salary = Column(String(64))
    match = Column(Float, default=0)
    description = Column(Text)


class Interview(Base):
    __tablename__ = "interviews"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    kind = Column(String(32))
    question = Column(Text)
    answer = Column(Text)
    score = Column(Float, default=0)
    feedback = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)


class Roadmap(Base):
    __tablename__ = "roadmaps"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String(128))
    status = Column(String(32))
    weeks = Column(String(32))
    detail = Column(Text)


class CareerAnalysis(Base):
    __tablename__ = "career_analyses"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    summary = Column(Text)
    path = Column(String(128))
    market_demand = Column(Float, default=0)
    fit = Column(Float, default=0)
    data = Column(JSON)


class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    type = Column(String(64))
    payload = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
