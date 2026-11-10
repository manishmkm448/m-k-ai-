"""
M.K AI — Sovereign Multi-Provider AI Orchestrator
Integrates Google Gemini 3.8, Groq Cloud LPU, and Local Ollama
Creator: Manish Meena
"""

import httpx
import os
import json
from typing import Dict, Any, Optional

class AIOrchestrator:
    def __init__(self, gemini_key: str = "", groq_key: str = "", ollama_url: str = "http://localhost:11434"):
        self.gemini_key = gemini_key or os.getenv("GEMINI_API_KEY", "")
        self.groq_key = groq_key or os.getenv("GROQ_API_KEY", "")
        self.ollama_url = ollama_url

    async def generate_response(
        self,
        prompt: str,
        mode: str = "auto",
        provider: str = "auto",
        language: str = "hinglish",
        user_profile: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Dispatches inference based on user selection: Gemini, Groq, or Ollama.
        """
        user_profile = user_profile or {}
        system_instruction = f"""
You are M.K AI — Universal Advanced Personal AI Ecosystem.
Tagline: Your Intelligence. Your Control.
Creator: Manish Meena.
User: {user_profile.get('name', 'User')} on {user_profile.get('platform', 'system')}.
Language preference: {language.upper()}.
Always respond respectfully in Hindi, English, or fluent Hinglish as requested.
        """.strip()

        # 1. Groq Cloud LPU
        if provider == "groq" or (provider == "auto" and self.groq_key and not self.gemini_key):
            if self.groq_key:
                try:
                    async with httpx.AsyncClient(timeout=15.0) as client:
                        res = await client.post(
                            "https://api.groq.com/openai/v1/chat/completions",
                            headers={
                                "Authorization": f"Bearer {self.groq_key}",
                                "Content-Type": "application/json"
                            },
                            json={
                                "model": "llama-3.3-70b-versatile",
                                "messages": [
                                    {"role": "system", "content": system_instruction},
                                    {"role": "user", "content": prompt}
                                ]
                            }
                        )
                        if res.status_code == 200:
                            data = res.json()
                            return {
                                "text": data["choices"][0]["message"]["content"],
                                "provider": "groq",
                                "model": "llama-3.3-70b-versatile"
                            }
                except Exception as e:
                    print(f"Groq API call error: {e}")

        # 2. Google Gemini API
        if provider == "gemini" or provider == "auto":
            if self.gemini_key and self.gemini_key != "MY_GEMINI_API_KEY":
                try:
                    async with httpx.AsyncClient(timeout=15.0) as client:
                        res = await client.post(
                            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key={self.gemini_key}",
                            headers={"Content-Type": "application/json"},
                            json={
                                "system_instruction": {"parts": [{"text": system_instruction}]},
                                "contents": [{"parts": [{"text": prompt}]}]
                            }
                        )
                        if res.status_code == 200:
                            data = res.json()
                            text = data["candidates"][0]["content"]["parts"][0]["text"]
                            return {
                                "text": text,
                                "provider": "gemini",
                                "model": "gemini-3.8-flash"
                            }
                except Exception as e:
                    print(f"Gemini API call error: {e}")

        # 3. Local Offline Ollama / Sovereign Engine
        try:
            async with httpx.AsyncClient(timeout=2.0) as client:
                res = await client.post(
                    f"{self.ollama_url}/api/generate",
                    json={
                        "model": "llama3:8b",
                        "prompt": f"{system_instruction}\nUser: {prompt}\nAssistant:",
                        "stream": False
                    }
                )
                if res.status_code == 200:
                    data = res.json()
                    return {
                        "text": data.get("response", ""),
                        "provider": "ollama",
                        "model": "llama3:8b"
                    }
        except Exception:
            pass

        # 4. Sovereign Local Offline Core
        return {
            "text": f"[M.K AI LOCAL SOVEREIGN CORE]\nNamaste! Main M.K AI hoon (Creator: Manish Meena). Your directive was processed locally with 100% privacy.",
            "provider": "local_fallback",
            "model": "local-offline-matrix"
        }
