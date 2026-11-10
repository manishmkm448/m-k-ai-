# M.K AI — Sovereign Security & Privacy Architecture
**Creator:** Manish Meena  
**Tagline:** Your Intelligence. Your Control.

---

## 1. Zero Trust Account Isolation
Every device installation (Windows, Kali, Android, iOS, Web) establishes a sovereign cryptographic boundary:
- **No Cross-Account Memory Leaks**: User memory queries are enforced at SQL/storage layer using explicit `WHERE user_id = :authenticated_user_id`.
- **PBKDF2 Password Hashing**: Passwords are salted with 16-byte cryptographically secure random bytes and hashed using PBKDF2 with SHA-512 over 1000 iterations.
- **Token Invalidation**: Sessions carry distinct client platform signatures and 30-day expiries with instant revocation on logout.

## 2. Air-Gapped Offline AI Guarantee
- When the user selects **Offline Mode**, network dispatch to cloud APIs (Gemini) is blocked at the router layer.
- All offline prompts are directed strictly to the local Ollama daemon or on-device fallback.
- The UI presents an explicit glowing **OFFLINE** security badge so the user always has 100% transparency.

## 3. Computer Automation Guardrails
- **Confirmation Modals**: Destructive operations (file overwrite, process kill, raw terminal shell commands) demand explicit user interaction.
- **Emergency Stop**: Global kill switch halts all automation loops immediately.
- **Audit Logs**: All executed directives are logged with timestamps and execution hashes.

## 4. API Key Protection
- Gemini API keys are maintained server-side in environment configurations.
- Keys are never embedded into frontend bundles or sent to the client browser.
