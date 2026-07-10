from dotenv import load_dotenv

load_dotenv()

import os

class Settings:
    PROJECT_NAME = "AI Career Mentor Portal"
    API_V1_PREFIX = "/api"

    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-me")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

    DATABASE_URL = os.getenv(
        "DATABASE_URL",
        "mysql+mysqlconnector://root:root@localhost:3306/career_mentor",
    )

    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

    USE_MOCK_AI = os.getenv("USE_MOCK_AI", "true").lower() == "true"


settings = Settings()
