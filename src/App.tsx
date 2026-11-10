import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Brain,
  Terminal,
  Scan,
  Boxes,
  Layers,
  Settings,
  User,
  Plus,
  Trash2,
  Cpu,
  Wifi,
  WifiOff,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Volume2,
  Monitor,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { UserAccount, ConversationItem } from './types';
import { api, setAuthToken } from './services/api';
import { ChatConsole } from './components/ChatConsole';
import { MemoryVault } from './components/MemoryVault';
import { AutomationDeck } from './components/AutomationDeck';
import { VisionLab } from './components/VisionLab';
import { PluginHub } from './components/PluginHub';
import { MultiPlatformView } from './components/MultiPlatformView';
import { AccountModal } from './components/AccountModal';
import { SettingsModal } from './components/SettingsModal';
import { ArcReactor } from './components/ArcReactor';

export default function App() {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'memory' | 'automation' | 'vision' | 'plugins' | 'multiplatform'>('chat');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightHudOpen, setIsRightHudOpen] = useState(true);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [memoryCount, setMemoryCount] = useState<number>(3);

  // Initialize or fetch user
  useEffect(() => {
    const initApp = async () => {
      try {
        const res = await api.getMe();
        setUser(res.user);
      } catch (e) {
        // Fallback login with default sovereign creator profile
        try {
          const loginRes = await api.login('manish', 'mkai2026', 'windows');
          setUser(loginRes.user);
        } catch (err) {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };
    initApp();
  }, []);

  // Fetch conversations when user is ready
  const loadConversations = async () => {
    try {
      const list = await api.getConversations();
      setConversations(list);
    } catch (e) {
      console.error(e);
    }
  };

  const loadMemoriesCount = async () => {
    try {
      const data = await api.getMemories();
      setMemoryCount(data.memories.length);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) {
      loadConversations();
      loadMemoriesCount();
    }
  }, [user]);

  const handleCreateNewConversation = async () => {
    try {
      const newConv = await api.createConversation('New Protocol Session');
      setConversations((prev) => [newConv, ...prev]);
      setActiveConvId(newConv.id);
      setActiveTab('chat');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    // Optimistically remove from UI list immediately for instant response
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvId === id) {
      setActiveConvId(null);
    }
    try {
      await api.deleteConversation(id);
    } catch (err) {
      console.warn('Could not sync session deletion:', err);
    }
  };

  const handleAutomationAction = (actionType: string, target?: string) => {
    setActiveTab('automation');
  };

  if (loading || !user) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <ArcReactor status="thinking" size="lg" />
        <h1 className="text-xl font-bold font-display text-cyan-400 tracking-widest mt-6 animate-pulse">
          INITIALIZING M.K AI SOVEREIGN MATRIX
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Created by Manish Meena • Your Intelligence. Your Control.
        </p>
      </div>
    );
  }

  const activeConv = conversations.find((c) => c.id === activeConvId) || null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 cyber-grid">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ========================================================= */}
      {/* 1. LEFT SIDEBAR (CHATGPT ERGONOMICS + JARVIS CYBER HUD)   */}
      {/* ========================================================= */}
      <aside
        className={`fixed md:relative z-40 h-full w-72 bg-slate-950/95 border-r border-cyan-900/40 flex flex-col transition-transform duration-300 backdrop-blur-xl ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-20 lg:w-72'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 border-b border-cyan-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center glow-cyan">
                <span className="text-[11px] font-black text-cyan-300 font-display">MK</span>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            </div>

            <div className="hidden lg:block truncate">
              <div className="text-sm font-black tracking-widest text-white font-display flex items-center gap-1.5">
                M.K AI
                <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                  v1.0
                </span>
              </div>
              <div className="text-[10px] text-cyan-400/80 font-mono tracking-wider truncate">
                MANISH MEENA
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Session Button */}
        <div className="p-3 shrink-0">
          <button
            onClick={handleCreateNewConversation}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/50 hover:border-cyan-400 hover:bg-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/10 group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
            <span className="hidden lg:inline">+ NEW DIRECTIVE</span>
          </button>
        </div>

        {/* Core Subsystem Navigation */}
        <div className="px-3 py-1 space-y-1 shrink-0">
          <div className="hidden lg:block text-[10px] font-mono text-slate-500 px-2 py-1 tracking-widest uppercase">
            Subsystems
          </div>

          {[
            { id: 'chat', label: 'Chat Console', icon: MessageSquare, badge: null },
            { id: 'memory', label: 'Memory Vault', icon: Brain, badge: `${memoryCount}` },
            { id: 'automation', label: 'Automation Deck', icon: Terminal, badge: 'OS' },
            { id: 'vision', label: 'Vision & OCR Lab', icon: Scan, badge: 'AI' },
            { id: 'plugins', label: 'Plugin Matrix', icon: Boxes, badge: '6' },
            { id: 'multiplatform', label: 'Multi-Platform', icon: Layers, badge: '5 OS' },
          ].map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={`w-full p-2.5 rounded-xl text-xs font-mono flex items-center justify-between transition-all ${
                  active
                    ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 glow-cyan/10 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
                title={item.label}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span className="hidden lg:inline">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`hidden lg:inline text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      active ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Conversation Sessions List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 border-t border-slate-900 mt-2">
          <div className="hidden lg:flex items-center justify-between text-[10px] font-mono text-slate-500 px-2 py-1 tracking-widest uppercase">
            <span>Recent Sessions</span>
            <span>{conversations.length}</span>
          </div>

          {conversations.map((c) => {
            const isSelected = activeConvId === c.id && activeTab === 'chat';
            return (
              <div
                key={c.id}
                onClick={() => {
                  setActiveConvId(c.id);
                  setActiveTab('chat');
                  if (window.innerWidth < 768) setIsSidebarOpen(false);
                }}
                className={`group w-full p-2 rounded-xl text-xs font-mono flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-800/80 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/60 shrink-0" />
                  <span className="hidden lg:inline truncate text-[11px]">{c.title}</span>
                </div>

                <button
                  onClick={(e) => handleDeleteConversation(e, c.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-700/60 text-slate-400 hover:text-red-400 transition-opacity"
                  title="Delete Session"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Bottom User Account Pill */}
        <div className="p-3 border-t border-cyan-950/80 bg-slate-900/40 shrink-0 flex items-center justify-between">
          <button
            onClick={() => setIsAccountModalOpen(true)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800/60 text-left transition-colors truncate flex-1 mr-2"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-400 font-bold text-xs shrink-0 font-mono">
              {user.displayName.charAt(0)}
            </div>
            <div className="hidden lg:block truncate">
              <div className="text-xs font-bold text-slate-200 truncate">{user.displayName}</div>
              <div className="text-[10px] text-cyan-400 font-mono truncate">
                {user.devicePlatform.toUpperCase()} Node
              </div>
            </div>
          </button>

          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors shrink-0"
            title="Settings & AI Mode"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN CENTER WORKSPACE STAGE                            */}
      {/* ========================================================= */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Responsive Mobile Header */}
        <header className="md:hidden h-14 bg-slate-900/80 border-b border-cyan-900/40 px-4 flex items-center justify-between z-20">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-xs font-bold font-display text-cyan-400 tracking-wider">
            M.K AI — SOVEREIGN
          </div>
          <button
            onClick={() => setIsRightHudOpen(!isRightHudOpen)}
            className="p-1.5 rounded-lg text-cyan-400 hover:text-cyan-300"
          >
            <Cpu className="w-5 h-5" />
          </button>
        </header>

        {/* Tab Content Router */}
        <div className="flex-1 h-full overflow-hidden flex">
          <div className="flex-1 h-full overflow-hidden flex flex-col">
            {activeTab === 'chat' && (
              <ChatConsole
                user={user}
                activeConversation={activeConv}
                onRefreshConversations={loadConversations}
                onSelectConversation={(c) => setActiveConvId(c.id)}
                onRequestAutomation={handleAutomationAction}
              />
            )}
            {activeTab === 'memory' && <MemoryVault user={user} />}
            {activeTab === 'automation' && <AutomationDeck user={user} />}
            {activeTab === 'vision' && <VisionLab />}
            {activeTab === 'plugins' && <PluginHub />}
            {activeTab === 'multiplatform' && <MultiPlatformView />}
          </div>

          {/* ========================================================= */}
          {/* 3. RIGHT PANEL (JARVIS HUD TELEMETRY & AI ORCHESTRATOR)   */}
          {/* ========================================================= */}
          {isRightHudOpen && (
            <aside className="hidden xl:flex w-80 h-full bg-slate-950/80 border-l border-cyan-900/30 flex-col p-4 space-y-4 overflow-y-auto shrink-0 select-none backdrop-blur-md">
              {/* Arc Reactor Compact HUD */}
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-cyan-500/25 flex flex-col items-center text-center shadow-lg glow-cyan/5">
                <ArcReactor
                  status="idle"
                  mode={user.preferences.aiMode}
                  size="sm"
                />
                <div className="text-xs font-bold font-display text-slate-100 tracking-wider mt-3">
                  ARC NEURAL CORE
                </div>
                <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
                  Your Intelligence. Your Control.
                </div>
              </div>

              {/* AI Brain Telemetry */}
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI BRAIN ROUTER
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] uppercase ${
                      user.preferences.aiMode === 'offline'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : user.preferences.aiMode === 'online'
                        ? 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                        : 'bg-blue-950 text-blue-300 border border-blue-800'
                    }`}
                  >
                    {user.preferences.aiMode}
                  </span>
                </div>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Engine:</span>
                    <span className="text-cyan-300 uppercase font-semibold">
                      {user.preferences.primaryProvider === 'groq'
                        ? 'Groq LPU'
                        : user.preferences.primaryProvider === 'gemini'
                        ? 'Gemini 3.8'
                        : user.preferences.primaryProvider === 'ollama'
                        ? 'Ollama'
                        : 'Auto Sovereign'}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Groq Model:</span>
                    <span className="text-amber-300 truncate max-w-[140px]">{user.preferences.groqModel || 'llama-3.3-70b'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Gemini Model:</span>
                    <span className="text-slate-200">{user.preferences.geminiModel}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Language:</span>
                    <span className="text-cyan-300 uppercase">{user.preferences.language}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-300 transition-colors"
                >
                  Configure Orchestrator
                </button>
              </div>

              {/* Real-time Hardware & OS Telemetry */}
              <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    NODE METRICS
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {user.devicePlatform.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>Neural CPU Load</span>
                      <span className="text-cyan-400">24.6%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-1/4 h-full bg-cyan-400 rounded-full glow-cyan" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>RAM Utilization</span>
                      <span className="text-blue-400">3.8 GB / 16 GB</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-2/5 h-full bg-blue-500 rounded-full glow-blue" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>Battery Reservoir</span>
                      <span className="text-emerald-400">96% (Charging)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="w-[96%] h-full bg-emerald-400 rounded-full glow-emerald" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Zero Trust Sovereign Guardrail Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900/60 to-cyan-950/20 border border-cyan-500/20 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  SOVEREIGN DATA POLICY
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Private memory and conversations belong 100% to this installation. No cross-account merging or data telemetry without consent.
                </p>
                <div className="text-[10px] font-mono text-slate-500 pt-1">
                  ARCHITECT: MANISH MEENA
                </div>
              </div>
            </aside>
          )}
        </div>
      </main>

      {/* Global Modals */}
      <AccountModal
        currentUser={user}
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onUserChanged={(updated) => setUser(updated)}
      />

      <SettingsModal
        user={user}
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onUpdateUser={(updated) => setUser(updated)}
      />
    </div>
  );
}
