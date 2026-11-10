import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "M.K AI"
    CREATOR: str = "Manish Meena"
    TAGLINE: str = "Your Intelligence. Your Control."
    SECRET_KEY: str = os.getenv("SECRET_KEY", "mk-ai-sovereign-vault-key-2026-secure")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days
    
    # AI Engine
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_DEFAULT_MODEL: str = "gemini-3.8-flash"
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_DEFAULT_MODEL: str = "llama-3.3-70b-versatile"
    OLLAMA_URL: str = os.getenv("OLLAMA_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3:8b")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./mk_ai_local.db")
    
    class Config:
        env_file = ".env"

settings = Settings()
