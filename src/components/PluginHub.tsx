import React, { useState, useEffect } from 'react';
import {
  Boxes,
  ShieldCheck,
  ShieldAlert,
  Power,
  Sliders,
  ExternalLink,
  Lock,
  Terminal,
  MessageSquare,
  Mail,
  Calendar,
  Globe,
  Code2,
  Cpu,
} from 'lucide-react';
import { PluginItem } from '../types';
import { api } from '../services/api';

export const PluginHub: React.FC = () => {
  const [plugins, setPlugins] = useState<PluginItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const fetchPlugins = async () => {
    setLoading(true);
    try {
      const data = await api.getPlugins();
      setPlugins(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlugins();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      const res = await api.togglePlugin(id);
      setPlugins((prev) => prev.map((p) => (p.id === id ? res.plugin : p)));
    } catch (err) {
      console.error(err);
    }
  };

  const getPluginIcon = (id: string) => {
    switch (id) {
      case 'system_automation':
        return Terminal;
      case 'kali_cyber_suite':
        return ShieldAlert;
      case 'web_search_grounding':
        return Globe;
      case 'whatsapp_bridge':
        return MessageSquare;
      case 'google_workspace_sync':
        return Mail;
      case 'code_assistant_pro':
        return Code2;
      default:
        return Boxes;
    }
  };

  const categories = ['All', 'System', 'Cybersecurity', 'Intelligence', 'Communication', 'Productivity', 'Development'];
  const filtered = activeCategory === 'All' ? plugins : plugins.filter((p) => p.category === activeCategory);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto p-4 md:p-8">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyan-900/40 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Boxes className="w-6 h-6 text-cyan-400" />
              <h1 className="text-xl md:text-2xl font-bold font-display text-slate-100 tracking-wider">
                SOVEREIGN PLUGIN MATRIX & PERMISSIONS
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Zero-unrestricted-access plugin architecture. Grant granular scopes with transparent security auditing.
            </p>
          </div>
        </div>

        {/* Security Policy Badge */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-cyan-500/30 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed font-mono">
            <span className="text-cyan-300 font-bold">SANDBOXED PERMISSION GOVERNANCE:</span> Each plugin operates under an isolated security contract. Plugins cannot access private filesystem or user credentials unless explicitly toggled on by you.
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Plugins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((plugin) => {
            const Icon = getPluginIcon(plugin.id);
            return (
              <div
                key={plugin.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  plugin.enabled
                    ? 'bg-slate-900/90 border-cyan-500/40 shadow-lg glow-cyan/10'
                    : 'bg-slate-900/40 border-slate-800/80 opacity-75'
                }`}
              >
                <div>
                  {/* Top Bar: Icon, Name, Toggle */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl border ${
                          plugin.enabled
                            ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-400'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-500'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-100 font-mono tracking-wide">
                          {plugin.name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono text-cyan-400/80">v{plugin.version}</span>
                          <span className="text-[10px] text-slate-500 font-mono">• {plugin.category}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggle(plugin.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        plugin.enabled ? 'bg-cyan-500' : 'bg-slate-800'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                          plugin.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {plugin.description}
                  </p>

                  {/* Permission Badges */}
                  <div className="mt-3">
                    <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-500" />
                      Required Security Scopes
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {plugin.permissions.map((perm, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 border border-slate-800 text-slate-400"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Status */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className={plugin.enabled ? 'text-emerald-400 flex items-center gap-1' : 'text-slate-500'}>
                    <span className={`inline-block w-2 h-2 rounded-full ${plugin.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                    {plugin.enabled ? 'ACTIVE & LOADED' : 'DISABLED'}
                  </span>
                  <span className="text-slate-500 text-[10px]">CREATOR: MANISH MEENA</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
