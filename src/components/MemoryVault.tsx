import React, { useState, useEffect } from 'react';
import {
  Brain,
  Search,
  Plus,
  Trash2,
  Edit2,
  Download,
  Upload,
  ShieldAlert,
  ShieldCheck,
  Check,
  RefreshCw,
  FolderGit2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { MemoryItem, UserAccount } from '../types';
import { api } from '../services/api';

interface MemoryVaultProps {
  user: UserAccount;
}

export const MemoryVault: React.FC<MemoryVaultProps> = ({ user }) => {
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MemoryItem | null>(null);

  // Form states
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [newCategory, setNewCategory] = useState<'fact' | 'preference' | 'instruction' | 'project'>('fact');

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const data = await api.getMemories(searchQuery);
      setMemories(data.memories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, [searchQuery]);

  const handleSaveMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKey.trim() || !newValue.trim()) return;

    try {
      if (editingItem) {
        await api.updateMemory(editingItem.id, {
          key: newKey,
          value: newValue,
          category: newCategory,
        });
      } else {
        await api.addMemory({
          key: newKey,
          value: newValue,
          category: newCategory,
          confidence: 1.0,
        });
      }
      setIsAddModalOpen(false);
      setEditingItem(null);
      setNewKey('');
      setNewValue('');
      fetchMemories();
    } catch (err: any) {
      alert(err.message || 'Failed to save memory');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to erase this memory record permanently?')) return;
    try {
      await api.deleteMemory(id);
      fetchMemories();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('PURGE WARNING: Erase ALL private memory records for this account? This cannot be undone.')) return;
    try {
      await api.clearMemories();
      fetchMemories();
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (item: MemoryItem) => {
    setEditingItem(item);
    setNewKey(item.key);
    setNewValue(item.value);
    setNewCategory(item.category as any);
    setIsAddModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto p-4 md:p-8">
      <div className="max-w-5xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyan-900/40 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-cyan-400" />
              <h1 className="text-xl md:text-2xl font-bold font-display text-slate-100 tracking-wider">
                SOVEREIGN PRIVATE MEMORY VAULT
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              Encrypted private knowledge graph tied exclusively to account <span className="text-cyan-300">@{user.username}</span> on <span className="text-cyan-300">{user.devicePlatform.toUpperCase()}</span>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingItem(null);
                setNewKey('');
                setNewValue('');
                setIsAddModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4" />
              Store Fact / Instruction
            </button>
            <button
              onClick={handleClearAll}
              className="px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-300 text-xs flex items-center gap-1.5 transition-all"
              title="Purge all memories"
            >
              <Trash2 className="w-4 h-4" />
              Purge Vault
            </button>
          </div>
        </div>

        {/* Security & Isolation Notice Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-blue-950/40 border border-cyan-500/30 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed font-mono">
            <span className="text-cyan-300 font-bold">ZERO CROSS-ACCOUNT CONTAMINATION:</span> Memories stored here are never merged or synchronized across unrelated device accounts. M.K AI uses this context to personalize conversations, remember your projects, and honor your custom operational preferences.
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-xl p-2 px-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search memory keys, facts, instructions, or values..."
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Clear
            </button>
          )}
          <button
            onClick={fetchMemories}
            className="p-1 rounded text-slate-400 hover:text-cyan-400"
            title="Refresh Vault"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Memory Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {memories.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-slate-800 border border-slate-700 text-cyan-300">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Confidence: {(item.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="text-sm font-bold text-slate-200 font-mono tracking-wide">
                  {item.key}
                </div>
                <div className="text-xs text-slate-300 mt-1.5 leading-relaxed bg-slate-950/60 p-2.5 rounded border border-slate-800/60 whitespace-pre-wrap">
                  {item.value}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/60 text-[10px] text-slate-500 font-mono">
                <span>Source: {item.source}</span>
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300"
                    title="Edit Record"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {memories.length === 0 && !loading && (
            <div className="col-span-full py-16 text-center text-slate-500 font-mono text-sm border border-dashed border-slate-800 rounded-2xl">
              <Brain className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-50" />
              No memories found matching your search. Store facts or talk with M.K AI to auto-populate the vault.
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl glow-cyan">
            <h3 className="text-base font-bold font-display text-slate-100 tracking-wide mb-4">
              {editingItem ? 'UPDATE MEMORY RECORD' : 'STORE NEW MEMORY RECORD'}
            </h3>
            <form onSubmit={handleSaveMemory} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono"
                >
                  <option value="fact">Fact (Knowledge)</option>
                  <option value="preference">Preference (Personal Habit)</option>
                  <option value="instruction">Instruction (Behavior Rule)</option>
                  <option value="project">Project Context</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Key / Identifier</label>
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  placeholder="e.g. favorite_ide, primary_framework"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Memory Content / Detail</label>
                <textarea
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  rows={4}
                  placeholder="e.g. Manish prefers writing clean Flutter and FastAPI code with strict type-safety."
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs"
                >
                  {editingItem ? 'Update Record' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
