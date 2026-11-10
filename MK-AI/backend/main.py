"""
M.K AI — Universal Advanced Personal AI Ecosystem
Backend API Entry Point (FastAPI)
Creator: Manish Meena
Tagline: Your Intelligence. Your Control.
"""

from fastapi import FastAPI, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
import uvicorn
import os
import json

from config import settings
from database.models import User, Conversation, Message, MemoryRecord, init_db, get_db
from security.auth import create_access_token, verify_password, get_password_hash, get_current_user
from ai.orchestrator import AIOrchestrator
from memory.service import MemoryService
from plugins.manager import PluginManager

app = FastAPI(
    title="M.K AI Backend Ecosystem",
    description="Universal Sovereign AI Backend supporting Windows 11, Kali Linux, Android, iOS, and Web",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Services
orchestrator = AIOrchestrator(
    gemini_key=settings.GEMINI_API_KEY,
    ollama_url=settings.OLLAMA_URL
)
memory_service = MemoryService()
plugin_manager = PluginManager()

@app.on_event("startup")
async def startup_event():
    init_db()
    print("[M.K AI] Sovereign Engine Initialized. Creator: Manish Meena.")

# Pydantic Schemas
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str
    display_name: Optional[str] = None
    device_platform: str = "web"
    device_name: Optional[str] = None

class UserLogin(BaseModel):
    username_or_email: str
    password: str
    device_platform: Optional[str] = "web"

class ChatRequest(BaseModel):
    conversation_id: Optional[str] = None
    message: str
    mode: Optional[str] = "auto" # online, offline, auto
    language: Optional[str] = "hinglish"

class MemoryCreate(BaseModel):
    category: str
    key: str
    value: str
    confidence: Optional[float] = 1.0

# ----------------- AUTH ROUTES -----------------
@app.post("/api/auth/register", tags=["Authentication"])
async def register(req: UserRegister, db=Depends(get_db)):
    # Verify account doesn't exist
    existing = db.query(User).filter((User.username == req.username) | (User.email == req.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Account already exists on this platform.")

    hashed_pw = get_password_hash(req.password)
    new_user = User(
        username=req.username,
        email=req.email,
        password_hash=hashed_pw,
        display_name=req.display_name or req.username,
        device_platform=req.device_platform,
        device_name=req.device_name or f"{req.device_platform}-node"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": str(new_user.id), "device": new_user.device_platform})
    return {"token": token, "user": {"id": new_user.id, "username": new_user.username, "platform": new_user.device_platform}}

@app.post("/api/auth/login", tags=["Authentication"])
async def login(req: UserLogin, db=Depends(get_db)):
    user = db.query(User).filter((User.username == req.username_or_email) | (User.email == req.username_or_email)).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = create_access_token({"sub": str(user.id), "device": req.device_platform or user.device_platform})
    return {"token": token, "user": {"id": user.id, "username": user.username, "platform": user.device_platform}}

# ----------------- AI CHAT ROUTES -----------------
@app.post("/api/ai/chat", tags=["AI Engine"])
async def chat(req: ChatRequest, current_user: User = Depends(get_current_user), db=Depends(get_db)):
    # 1. Fetch user isolated memory
    user_memories = memory_service.get_user_memories(user_id=current_user.id, db=db)
    
    # 2. Dispatch to Orchestrator (Gemini / Ollama / Auto)
    response_payload = await orchestrator.generate_response(
        prompt=req.message,
        mode=req.mode or current_user.preferred_mode,
        language=req.language or current_user.language,
        user_profile={
            "name": current_user.display_name,
            "platform": current_user.device_platform,
            "memories": user_memories
        }
    )

    # 3. Save to user-isolated conversation
    conv_id = req.conversation_id or f"conv_{current_user.id}_{int(os.times()[4])}"
    return {
        "conversation_id": conv_id,
        "message": response_payload["text"],
        "provider": response_payload["provider"],
        "model": response_payload["model"]
    }

# ----------------- MEMORY VAULT -----------------
@app.get("/api/memory", tags=["Private Memory"])
async def list_memories(current_user: User = Depends(get_current_user), db=Depends(get_db)):
    return memory_service.get_user_memories(user_id=current_user.id, db=db)

@app.post("/api/memory", tags=["Private Memory"])
async def add_memory(req: MemoryCreate, current_user: User = Depends(get_current_user), db=Depends(get_db)):
    return memory_service.add_memory(user_id=current_user.id, data=req.dict(), db=db)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
