# M.K AI — Universal Advanced Personal AI Ecosystem
> **Tagline:** *Your Intelligence. Your Control.*  
> **Creator & Lead Architect:** *Manish Meena*  
> **Supported Platforms:** Windows 11, Kali Linux, Android, iOS, iPadOS, Web Browsers

---

## 1. Executive Overview

**M.K AI** is a sovereign, production-oriented personal artificial intelligence ecosystem built from scratch. Unlike generic chatbots, M.K AI operates as an integrated intelligence layer combining:

1. **Dual AI Brain Orchestration**:
   - **Online Mode**: State-of-the-art Google Gemini API (`gemini-3.8-flash`) with multi-modal vision and internet search grounding.
   - **Offline Mode**: Sovereign on-device Ollama inference (`llama3:8b`, `mistral`) and local neural fallback with **zero data leakage**.
   - **Automatic Mode**: Auto-selects the fastest available provider.
2. **Strict Multi-Device Account Isolation**:
   - Each hardware installation (Windows 11, Kali Linux, Android, iOS, Web) operates its own sovereign account with dedicated encryption keys, private memory vaults, and conversation histories.
   - **Never automatically merged.** Accounts remain under strict owner custody.
3. **Persistent Private Memory Vault**:
   - Explicit facts, contextual preferences, and custom instructions stored locally and isolated by User ID.
4. **Voice Assistant Subsystem**:
   - Web Speech & Native Audio recognition with Hindi, English, and natural Hinglish support, wake-word ("M.K AI"), and voice synthesis.
5. **Computer Automation & Safe Execution Guardrails**:
   - Privileged operating system commands, file indexing, and Kali Linux cybersecurity diagnostics with mandatory user confirmation and an instant emergency brake.
6. **Futuristic Hybrid UI**:
   - Fusion of **JARVIS** HUD aesthetics (cyberpunk arc-reactor visualizer, neon cyan/blue HUD, telemetry diagnostics) and **ChatGPT**-grade clean ergonomics.

---

## 2. Architecture Matrix

```
MK-AI/
  ├── backend/          # Python FastAPI sovereign backend (PostgreSQL / SQLite)
  │    ├── main.py      # REST & WebSocket API Gateway
  │    ├── config.py    # Environment settings & Model routing
  │    ├── ai/          # Gemini & Ollama adapters
  │    ├── memory/      # Private memory vault engine
  │    └── security/    # PBKDF2 / JWT token & RBAC isolation
  ├── frontend/         # Cross-platform Flutter client
  │    └── lib/         # Universal UI for Windows, Linux, Android, iOS
  ├── scripts/          # Automated installers (Windows PS1 & Kali Bash)
  ├── docs/             # Technical specifications & Security manual
  └── server.ts         # Full-stack Node/Express/Vite live web engine (Port 3000)
```

---

## 3. Creator Attributions
- **Founder & Master Architect**: Manish Meena
- **System Name**: M.K AI
- **License**: Proprietary Sovereign Architecture (2026)
