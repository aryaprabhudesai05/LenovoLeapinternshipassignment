from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings

DATABASE_URL = settings.DATABASE_URL

# Graceful fallback: if the MySQL driver is not installed the API still boots
# using a local SQLite database so the project runs out-of-the-box.
try:
    import mysql.connector  # noqa: F401
except Exception:
    DATABASE_URL = "sqlite:///./career_mentor.db"

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
