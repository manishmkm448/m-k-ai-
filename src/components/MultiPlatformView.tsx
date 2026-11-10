import React, { useState } from 'react';
import {
  Layers,
  Terminal,
  Smartphone,
  Apple,
  Globe,
  FileCode,
  Download,
  Copy,
  Check,
  CheckCircle,
  ExternalLink,
  Cpu,
  Monitor,
} from 'lucide-react';

export const MultiPlatformView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'windows' | 'linux' | 'android' | 'ios' | 'code'>('matrix');
  const [copiedScript, setCopiedScript] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedScript(id);
    setTimeout(() => setCopiedScript(null), 2000);
  };

  const platforms = [
    {
      id: 'windows',
      name: 'Windows 11 / 10',
      icon: Monitor,
      status: 'Ready (x64 / ARM64)',
      accent: 'cyan',
      command: 'powershell -ExecutionPolicy Bypass -File scripts/setup_windows.ps1',
      description: 'Native desktop assistant with PowerShell system bridge, clipboard manager, audio subsystem hooks, and tray runner.',
    },
    {
      id: 'linux',
      name: 'Kali Linux / Debian',
      icon: Terminal,
      status: 'Ready (deb package)',
      accent: 'emerald',
      command: 'chmod +x scripts/setup_linux.sh && ./scripts/setup_linux.sh',
      description: 'Penetration testing & cybersecurity automation with nmap, packet inspection, terminal hotkeys, and local Ollama.',
    },
    {
      id: 'android',
      name: 'Android Phone & Tablet',
      icon: Smartphone,
      status: 'Ready (APK / AAB)',
      accent: 'blue',
      command: 'flutter build apk --release --split-per-abi',
      description: 'Mobile sovereign assistant with push-to-talk voice, background offline memory vault, and camera vision.',
    },
    {
      id: 'ios',
      name: 'iPhone & iPad (iOS)',
      icon: Apple,
      status: 'Ready (Flutter Runner)',
      accent: 'amber',
      command: 'flutter build ipa --no-codesign',
      description: 'Sleek iOS client with Apple Speech synthesis, isolated Keychain vault, and iPadOS split-screen HUD.',
    },
    {
      id: 'web',
      name: 'Web Browser / PWA',
      icon: Globe,
      status: 'Active (Port 3000)',
      accent: 'cyan',
      command: 'npm run dev',
      description: 'High-performance responsive progressive web app combining Jarvis HUD and ChatGPT ergonomics.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto p-4 md:p-8">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="border-b border-cyan-900/40 pb-6">
          <div className="flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold font-display text-slate-100 tracking-wider">
              MULTI-PLATFORM ECOSYSTEM & ARCHITECTURE
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            M.K AI multi-device distribution targets: Windows 11, Kali Linux, Android APK/AAB, iOS, and Web.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {[
            { id: 'matrix', label: 'Platform Matrix' },
            { id: 'windows', label: 'Windows 11 Setup' },
            { id: 'linux', label: 'Kali Linux Setup' },
            { id: 'android', label: 'Android APK / AAB' },
            { id: 'ios', label: 'iOS Build Guide' },
            { id: 'code', label: 'Modular Project Tree' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Platform Matrix */}
        {activeTab === 'matrix' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platforms.map((p) => {
                const Icon = p.icon;
                return (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-100 font-mono">{p.name}</div>
                            <div className="text-[10px] text-emerald-400 font-mono">{p.status}</div>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mt-2">{p.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800/80">
                      <div className="text-[10px] text-slate-500 font-mono mb-1">Execution / Build Directive:</div>
                      <div className="flex items-center justify-between p-2 rounded bg-black/60 border border-slate-800 text-[11px] font-mono text-cyan-300">
                        <code className="truncate max-w-[280px]">{p.command}</code>
                        <button
                          onClick={() => copyCode(p.command, p.id)}
                          className="text-slate-400 hover:text-cyan-300 p-1"
                        >
                          {copiedScript === p.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Windows 11 */}
        {activeTab === 'windows' && (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-cyan-400">WINDOWS 11 / 10 AUTOMATED SETUP GUIDE</span>
              <button
                onClick={() =>
                  copyCode(
                    `# Step 1: Clone or navigate to MK-AI directory\ncd MK-AI\\scripts\n# Step 2: Run automated installer\npowershell -ExecutionPolicy Bypass -File setup_windows.ps1`,
                    'win_code'
                  )
                }
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
              >
                {copiedScript === 'win_code' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                Copy Commands
              </button>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">
              The automated script <code>MK-AI/scripts/setup_windows.ps1</code> verifies Python 3.10+, installs virtual environments, sets up FastAPI dependencies, tests Ollama offline capabilities, and creates a desktop shortcut.
            </p>
            <div className="p-4 rounded-xl bg-black/90 border border-slate-800 text-cyan-300 text-xs leading-relaxed">
              # Execute in PowerShell (Admin or User):<br />
              Set-Location MK-AI\scripts<br />
              powershell -ExecutionPolicy Bypass -File setup_windows.ps1<br />
              <br />
              # Or run Flutter Desktop App:<br />
              cd ..\frontend<br />
              flutter run -d windows
            </div>
          </div>
        )}

        {/* Tab 3: Kali Linux */}
        {activeTab === 'linux' && (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-emerald-500/30 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-emerald-400">KALI LINUX & DEBIAN DEPLOYMENT</span>
              <button
                onClick={() =>
                  copyCode(
                    `chmod +x MK-AI/scripts/setup_linux.sh\n./MK-AI/scripts/setup_linux.sh`,
                    'linux_code'
                  )
                }
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
              >
                {copiedScript === 'linux_code' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                Copy Commands
              </button>
            </div>
            <p className="text-slate-300 leading-relaxed font-sans">
              Configured specifically for Kali Linux security suites. Integrates nmap port scans, network auditing, safe terminal sandboxing, and creates a <code>.desktop</code> application launcher.
            </p>
            <div className="p-4 rounded-xl bg-black/90 border border-slate-800 text-emerald-300 text-xs leading-relaxed">
              $ chmod +x MK-AI/scripts/setup_linux.sh<br />
              $ ./MK-AI/scripts/setup_linux.sh<br />
              <br />
              # To run Flutter Linux desktop client:<br />
              $ cd MK-AI/frontend<br />
              $ flutter run -d linux
            </div>
          </div>
        )}

        {/* Tab 4: Android */}
        {activeTab === 'android' && (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-blue-500/30 space-y-4 font-mono text-xs">
            <span className="text-sm font-bold text-blue-400">ANDROID APK & AAB PACKAGING</span>
            <p className="text-slate-300 leading-relaxed font-sans">
              M.K AI Flutter codebase in <code>MK-AI/frontend</code> produces standalone APKs and Google Play App Bundles (AAB) with support for on-device mic speech recognition and offline memory caching.
            </p>
            <div className="p-4 rounded-xl bg-black/90 border border-slate-800 text-blue-300 text-xs leading-relaxed">
              # Generate Release Universal APK:<br />
              cd MK-AI/frontend<br />
              flutter build apk --release<br />
              <br />
              # Output APK Location:<br />
              build/app/outputs/flutter-apk/app-release.apk<br />
              <br />
              # Generate Google Play AAB:<br />
              flutter build appbundle --release
            </div>
          </div>
        )}

        {/* Tab 5: iOS */}
        {activeTab === 'ios' && (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-4 font-mono text-xs">
            <span className="text-sm font-bold text-amber-400">iOS & IPADOS BUILD INSTRUCTIONS</span>
            <p className="text-slate-300 leading-relaxed font-sans">
              Compiled using Xcode and Flutter tooling. Supports iPad split view, Apple Speech recognition, and secure biometric authentication.
            </p>
            <div className="p-4 rounded-xl bg-black/90 border border-slate-800 text-amber-300 text-xs leading-relaxed">
              # Build Xcode Archive without codesign:<br />
              cd MK-AI/frontend<br />
              flutter build ipa --no-codesign<br />
              <br />
              # Open in Xcode for Apple Developer Signing:<br />
              open ios/Runner.xcworkspace
            </div>
          </div>
        )}

        {/* Tab 6: Modular Code Tree */}
        {activeTab === 'code' && (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 font-mono text-xs">
            <span className="text-sm font-bold text-cyan-400">MODULAR PROJECT REPOSITORY MATRIX</span>
            <div className="p-4 rounded-xl bg-black/90 border border-slate-800 text-slate-300 leading-relaxed">
              <pre>{`MK-AI/
  ├── backend/               # Python FastAPI Sovereign Core
  │    ├── main.py           # REST Gateway & WebSocket Handlers
  │    ├── config.py         # App & Model Settings
  │    ├── requirements.txt  # Dependencies (FastAPI, GenAI, SQLAlchemy)
  │    ├── database/         # PostgreSQL & SQLite User Isolation
  │    ├── ai/               # Gemini 3.8 & Ollama Adapters
  │    ├── memory/           # Persistent Private Memory Engine
  │    ├── security/         # PBKDF2 Hashing & Token Service
  │    └── plugins/          # Sandboxed Plugin Framework
  │
  ├── frontend/              # Flutter Universal Client
  │    └── lib/
  │         └── main.dart    # Windows, Linux, Android, iOS Entry Point
  │
  ├── scripts/
  │    ├── setup_windows.ps1 # Windows 11 Automated Installer
  │    └── setup_linux.sh    # Kali Linux & Debian Installer
  │
  ├── docs/
  │    ├── README.md         # Architecture & Project Specifications
  │    └── SECURITY.md       # Zero Trust Isolation & Privacy Manual
  │
  └── server.ts              # Full-Stack Live Node/Express/Vite Web Applet`}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
