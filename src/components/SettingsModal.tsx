import React, { useState } from 'react';
import {
  Settings,
  X,
  Volume2,
  Sparkles,
  Wifi,
  WifiOff,
  Cpu,
  Layers,
  Palette,
  Check,
  Zap,
  KeyRound,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { UserAccount, AIMode, LanguagePreference, AIProvider } from '../types';
import { api } from '../services/api';

interface SettingsModalProps {
  user: UserAccount;
  isOpen: boolean;
  onClose: () => void;
  onUpdateUser: (updatedUser: UserAccount) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  user,
  isOpen,
  onClose,
  onUpdateUser,
}) => {
  const [language, setLanguage] = useState<LanguagePreference>(user.preferences.language || 'hinglish');
  const [aiMode, setAiMode] = useState<AIMode>(user.preferences.aiMode || 'auto');
  const [primaryProvider, setPrimaryProvider] = useState<AIProvider>(user.preferences.primaryProvider || 'auto');
  const [geminiModel, setGeminiModel] = useState(user.preferences.geminiModel || 'gemini-3.8-flash');
  const [groqModel, setGroqModel] = useState(user.preferences.groqModel || 'llama-3.3-70b-versatile');
  const [ollamaEndpoint, setOllamaEndpoint] = useState(user.preferences.ollamaEndpoint || 'http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState(user.preferences.ollamaModel || 'llama3:8b');
  const [speechSpeed, setSpeechSpeed] = useState(user.preferences.speechSpeed || 1.0);
  const [speechPitch, setSpeechPitch] = useState(user.preferences.speechPitch || 1.0);
  const [wakeWordEnabled, setWakeWordEnabled] = useState(user.preferences.wakeWordEnabled ?? true);
  const [customInstructions, setCustomInstructions] = useState(user.customInstructions || '');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateProfile({
        customInstructions,
        preferences: {
          ...user.preferences,
          language,
          aiMode,
          primaryProvider,
          geminiModel,
          groqModel,
          ollamaEndpoint,
          ollamaModel,
          speechSpeed,
          speechPitch,
          wakeWordEnabled,
        },
      });
      onUpdateUser(res.user);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl glow-cyan flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <span className="text-base font-bold font-display text-slate-100 tracking-wide">
              SYSTEM CONFIGURATION & AI ORCHESTRATOR
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* API Key Management Notice Banner */}
        <div className="mb-4 p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/60 via-slate-950/80 to-blue-950/60 border border-cyan-500/30 flex items-start gap-3">
          <KeyRound className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed font-mono">
            <div className="font-bold text-cyan-300 mb-0.5 flex items-center gap-1.5">
              <span>API KEY & CLOUD PROVIDER CONFIGURATION</span>
            </div>
            <p className="text-[11px] text-slate-400">
              • <strong>Gemini API:</strong> Attached automatically via AI Studio's <strong>Settings &gt; Secrets</strong> panel. No manual entry needed.
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              • <strong>Groq API:</strong> Add <code className="text-cyan-300 bg-slate-900 px-1 py-0.2 rounded">GROQ_API_KEY</code> in the <strong>Settings &gt; Secrets</strong> panel to power live Groq ultra-fast LPUs.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* AI Primary Provider Selector */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2 font-semibold">
              PRIMARY AI INFERENCE ENGINE:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'gemini', label: 'Google Gemini', sub: '3.8 Flash', icon: Sparkles },
                { id: 'groq', label: 'Groq Cloud', sub: 'Ultra-Fast LPU', icon: Zap },
                { id: 'ollama', label: 'Local Ollama', sub: 'Air-Gapped', icon: WifiOff },
                { id: 'auto', label: 'Auto Route', sub: 'Sovereign', icon: Cpu },
              ].map((p) => {
                const Icon = p.icon;
                const active = primaryProvider === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPrimaryProvider(p.id as any)}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center justify-center gap-0.5 transition-all ${
                      active
                        ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold shadow-md shadow-cyan-500/20'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-0.5" />
                    <span className="text-[11px] font-mono font-semibold">{p.label}</span>
                    <span className="text-[9px] text-slate-500 font-mono">{p.sub}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Groq Model Picker (shown when Groq is selected or in Auto mode) */}
          {(primaryProvider === 'groq' || primaryProvider === 'auto') && (
            <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  Groq LPU Model
                </label>
                <span className="text-[10px] text-emerald-400 font-mono">Ultra-Fast LPUs</span>
              </div>
              <select
                value={groqModel}
                onChange={(e) => setGroqModel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              >
                <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Recommended Flagship)</option>
                <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (Lightning 1000+ tok/s)</option>
                <option value="deepseek-r1-distill-llama-70b">deepseek-r1-distill-llama-70b (Reasoning Specialist)</option>
                <option value="mixtral-8x7b-32768">mixtral-8x7b-32768 (32K High Context)</option>
              </select>
            </div>
          )}

          {/* Online Gemini Model */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">
              Google Gemini Model
            </label>
            <select
              value={geminiModel}
              onChange={(e) => setGeminiModel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended Sovereign)</option>
              <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Ultra Fast)</option>
            </select>
          </div>

          {/* Offline Ollama Endpoint */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Ollama Endpoint
              </label>
              <input
                type="text"
                value={ollamaEndpoint}
                onChange={(e) => setOllamaEndpoint(e.target.value)}
                placeholder="http://localhost:11434"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Offline Model
              </label>
              <input
                type="text"
                value={ollamaModel}
                onChange={(e) => setOllamaModel(e.target.value)}
                placeholder="llama3:8b or mistral"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono"
              />
            </div>
          </div>

          {/* Language Preference */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">
              Default Communication Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono"
            >
              <option value="hinglish">Hinglish (Natural Hindi + English Blend)</option>
              <option value="hi">Hindi (हिंदी शुद्ध / Devanagari)</option>
              <option value="en">English (Global Precision)</option>
            </select>
          </div>

          {/* Voice Engine Controls */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-semibold">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" />
                VOICE SYNTHESIS & WAKE WORD
              </span>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wakeWordEnabled}
                  onChange={(e) => setWakeWordEnabled(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0"
                />
                <span className="text-[11px] text-slate-300">Wake Word: "M.K AI"</span>
              </label>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>Speech Speed</span>
                <span>{speechSpeed}x</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.6"
                step="0.1"
                value={speechSpeed}
                onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>

          {/* Custom Instructions */}
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">
              Custom AI Persona Directives
            </label>
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              rows={3}
              placeholder="Provide system directives to govern M.K AI's responses..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 resize-none font-mono focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-md shadow-cyan-500/20"
            >
              {saving ? 'Synchronizing...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
