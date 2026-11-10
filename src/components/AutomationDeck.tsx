import React, { useState } from 'react';
import {
  Terminal,
  ShieldAlert,
  Play,
  RotateCcw,
  Search,
  FolderOpen,
  Volume2,
  Battery,
  Cpu,
  Monitor,
  Clipboard,
  Shield,
  FileCode,
  Radio,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { UserAccount } from '../types';
import { api } from '../services/api';

interface AutomationDeckProps {
  user: UserAccount;
}

export const AutomationDeck: React.FC<AutomationDeckProps> = ({ user }) => {
  const [outputLogs, setOutputLogs] = useState<string[]>([
    `[AUTOMATION SUBSYSTEM] Initialized on node: ${user.deviceName} (${user.devicePlatform.toUpperCase()})`,
    `[GUARDRAIL POLICY] Security Mode: Confirmed Dispatch. Unconfirmed destructive calls will be quarantined.`,
  ]);
  const [activeCommand, setActiveCommand] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationPending, setConfirmationPending] = useState<any>(null);

  const addLog = (text: string) => {
    setOutputLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`]);
  };

  const executeAction = async (actionType: string, target?: string, confirmed: boolean = false) => {
    setLoading(true);
    addLog(`Dispatching: ${actionType} ${target ? `("${target}")` : ''}...`);

    try {
      const res = await api.executeAutomation(actionType, target, confirmed);
      if (res.requiresConfirmation) {
        setConfirmationPending(res);
        addLog(`⚠️ ACTION BLOCKED: Confirmation required for sensitive directive "${actionType}"`);
      } else {
        addLog(`✓ ${res.result}`);
        setConfirmationPending(null);
      }
    } catch (err: any) {
      addLog(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = () => {
    if (!confirmationPending) return;
    executeAction(confirmationPending.actionType, confirmationPending.target, true);
  };

  const handleEmergencyStop = async () => {
    addLog('🚨 EMERGENCY BRAKE ENGAGED! Stopping all running automation routines.');
    await api.executeAutomation('emergency_stop', undefined, true);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto p-4 md:p-8">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyan-900/40 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Terminal className="w-6 h-6 text-cyan-400" />
              <h1 className="text-xl md:text-2xl font-bold font-display text-slate-100 tracking-wider">
                COMPUTER AUTOMATION & OS BRIDGE
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Automated system execution matrix for <span className="text-cyan-300">{user.devicePlatform.toUpperCase()}</span>.
            </p>
          </div>

          {/* Emergency Stop Button */}
          <button
            onClick={handleEmergencyStop}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs tracking-wider flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all active:scale-95 border border-red-400"
          >
            <ShieldAlert className="w-4 h-4 animate-pulse" />
            EMERGENCY BRAKE
          </button>
        </div>

        {/* Confirmation Modal if triggered */}
        {confirmationPending && (
          <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-500/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg glow-amber">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-bold text-amber-300 font-mono">
                  SENSITIVE PRIVILEGED OPERATION DETECTED
                </div>
                <div className="text-xs text-slate-200 mt-0.5">
                  Action: <code className="bg-amber-900/60 px-1 py-0.5 rounded text-amber-200">{confirmationPending.actionType}</code>. Do you approve execution on this node?
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setConfirmationPending(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-mono"
              >
                Abort
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold font-mono"
              >
                Confirm & Run
              </button>
            </div>
          </div>
        )}

        {/* Quick Action Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            {
              title: 'System Diagnostic',
              desc: 'Telemetry, CPU & RAM metrics',
              icon: Cpu,
              action: () => executeAction('system_audit'),
            },
            {
              title: 'Kali Port Scan',
              desc: 'Local audit on loopback',
              icon: Radio,
              action: () => executeAction('cyber_scan', '127.0.0.1'),
            },
            {
              title: 'Find Project Files',
              desc: 'Search *.py and *.dart',
              icon: Search,
              action: () => executeAction('file_search', '*.py, *.dart'),
            },
            {
              title: 'Read Clipboard',
              desc: 'Inspect secure buffer',
              icon: Clipboard,
              action: () => executeAction('clipboard_read'),
            },
            {
              title: 'Launch Terminal',
              desc: 'Open OS console window',
              icon: Terminal,
              action: () => executeAction('launch_app', user.devicePlatform === 'kali' ? 'qterminal' : 'wt.exe'),
            },
            {
              title: 'Volume 80%',
              desc: 'Adjust audio output',
              icon: Volume2,
              action: () => executeAction('volume_control', '80%'),
            },
            {
              title: 'Inspect Battery',
              desc: 'Battery health & cycle',
              icon: Battery,
              action: () => executeAction('system_audit', 'battery'),
            },
            {
              title: 'Kill Inbound Probe',
              desc: 'Sensitive action requiring prompt',
              icon: ShieldAlert,
              action: () => executeAction('kill_process', 'unauthorized_daemon'),
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <button
                key={i}
                onClick={card.action}
                disabled={loading}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/80 transition-all text-left group flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 text-cyan-400 group-hover:text-cyan-300" />
                  <span className="text-[10px] text-slate-500 font-mono">READY</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-white font-mono">
                    {card.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 font-sans">
                    {card.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Terminal Output Console */}
        <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-2xl flex flex-col">
          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="text-xs font-mono text-slate-400 ml-2">mk-ai-subsystem-terminal — bash</span>
            </div>
            <button
              onClick={() => setOutputLogs([])}
              className="text-xs text-slate-500 hover:text-slate-300 font-mono"
            >
              Clear Log
            </button>
          </div>

          <div className="p-4 font-mono text-xs text-cyan-300/90 bg-black/80 h-64 overflow-y-auto space-y-1 selection:bg-cyan-500/30">
            {outputLogs.map((log, i) => (
              <div key={i} className="leading-relaxed">
                {log}
              </div>
            ))}
            {loading && <div className="text-yellow-400 animate-pulse">Running process directive...</div>}
          </div>

          {/* Custom Command Input */}
          <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2">
            <span className="text-cyan-400 font-mono text-xs pl-2">mk-ai@automation:~$</span>
            <input
              type="text"
              value={activeCommand}
              onChange={(e) => setActiveCommand(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && activeCommand.trim()) {
                  executeAction('launch_app', activeCommand.trim());
                  setActiveCommand('');
                }
              }}
              placeholder="Type manual automation directive (e.g. system_audit, launch_app code, cyber_scan)..."
              className="flex-1 bg-transparent text-xs text-slate-100 font-mono focus:outline-none"
            />
            <button
              onClick={() => {
                if (activeCommand.trim()) {
                  executeAction('launch_app', activeCommand.trim());
                  setActiveCommand('');
                }
              }}
              className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
