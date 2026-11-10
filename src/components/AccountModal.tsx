import React, { useState } from 'react';
import {
  User,
  KeyRound,
  Shield,
  Smartphone,
  Monitor,
  Terminal,
  Apple,
  Globe,
  Download,
  Upload,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { UserAccount, DevicePlatform } from '../types';
import { api } from '../services/api';

interface AccountModalProps {
  currentUser: UserAccount;
  isOpen: boolean;
  onClose: () => void;
  onUserChanged: (user: UserAccount) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onUserChanged,
}) => {
  const [mode, setMode] = useState<'profile' | 'switch_device' | 'login' | 'register'>('profile');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [platform, setPlatform] = useState<DevicePlatform>('windows');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.register({
        username,
        email,
        password,
        displayName,
        devicePlatform: platform,
      });
      onUserChanged(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.login(username, password, platform);
      onUserChanged(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDeviceSwitch = async (targetPlatform: DevicePlatform) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.switchDeviceAccount(targetPlatform);
      onUserChanged(res.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Device account switch failed');
    } finally {
      setLoading(false);
    }
  };

  const handleExportBackup = async () => {
    try {
      await api.exportAccountData();
    } catch (err: any) {
      setError(err.message || 'Export failed');
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const json = JSON.parse(reader.result as string);
        await api.importAccountData(json);
        setImportNotice('Backup successfully imported into this account vault!');
        setTimeout(() => setImportNotice(null), 3000);
      } catch (err: any) {
        setError('Invalid backup JSON format');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleDeleteAccount = async () => {
    if (!confirm('CRITICAL CONFIRMATION: Permanently delete this account and all associated private memory?')) return;
    try {
      await api.deleteAccount();
      // Switch back to creator profile or register
      window.location.reload();
    } catch (err: any) {
      setError(err.message || 'Failed to delete account');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl glow-cyan flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            <span className="text-base font-bold font-display text-slate-100 tracking-wide">
              {mode === 'profile'
                ? 'ACCOUNT & DEVICE IDENTITY'
                : mode === 'switch_device'
                ? 'SWITCH SEPARATE DEVICE ACCOUNT'
                : mode === 'login'
                ? 'SIGN IN TO M.K AI NODE'
                : 'REGISTER NEW SOVEREIGN NODE'}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-800/80 text-xs text-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {importNotice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-800/80 text-xs text-emerald-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{importNotice}</span>
          </div>
        )}

        {/* Profile Mode */}
        {mode === 'profile' && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500 flex items-center justify-center text-cyan-400 font-bold font-display text-lg">
                {currentUser.displayName.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold text-slate-100">{currentUser.displayName}</div>
                <div className="text-xs text-cyan-400 font-mono">@{currentUser.username} • {currentUser.email}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Platform: {currentUser.devicePlatform.toUpperCase()} ({currentUser.deviceName})
                </div>
              </div>
            </div>

            {/* Device Switcher Demo */}
            <div>
              <div className="text-xs font-mono text-slate-400 mb-2 font-semibold">
                SEPARATE DEVICE ACCOUNTS (STRICTLY ISOLATED):
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'windows', name: 'Windows 11 Account', icon: Monitor },
                  { id: 'kali', name: 'Kali Linux Account', icon: Terminal },
                  { id: 'android', name: 'Android Account', icon: Smartphone },
                  { id: 'ios', name: 'iPhone / iPad Account', icon: Apple },
                ].map((d) => {
                  const Icon = d.icon;
                  const isActive = currentUser.devicePlatform === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => handleQuickDeviceSwitch(d.id as any)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        isActive
                          ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-mono">{d.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Export & Import */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="text-xs font-mono text-slate-400">DATA SOVEREIGNTY:</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportBackup}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  Export Account JSON
                </button>

                <label className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Import Backup JSON
                  <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
                </label>
              </div>
            </div>

            {/* Actions: Sign out, delete */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <button
                onClick={() => setMode('login')}
                className="text-cyan-400 hover:underline"
              >
                Switch / Sign In
              </button>
              <button
                onClick={() => setMode('register')}
                className="text-cyan-400 hover:underline"
              >
                Register New User
              </button>
              <button
                onClick={handleDeleteAccount}
                className="text-red-400 hover:underline flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Node
              </button>
            </div>
          </div>
        )}

        {/* Login Mode */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Username or Email</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="manish or your username"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Target Device Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono"
              >
                <option value="windows">Windows 11 Node</option>
                <option value="kali">Kali Linux Node</option>
                <option value="android">Android Phone/Tablet</option>
                <option value="ios">iPhone / iPad</option>
                <option value="web">Web Browser</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-md shadow-cyan-500/20"
            >
              {loading ? 'Authenticating...' : 'Sign In To Account'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('profile')}
                className="text-xs text-slate-400 hover:text-slate-200 font-mono"
              >
                ← Back to Active Node
              </button>
            </div>
          </form>
        )}

        {/* Register Mode */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Manish Meena"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="manish"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Device Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono"
              >
                <option value="windows">Windows 11</option>
                <option value="kali">Kali Linux</option>
                <option value="android">Android Phone/Tablet</option>
                <option value="ios">iPhone / iPad</option>
                <option value="web">Web Browser</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono transition-all shadow-md shadow-cyan-500/20 mt-2"
            >
              {loading ? 'Creating...' : 'Register Isolated Account'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('profile')}
                className="text-xs text-slate-400 hover:text-slate-200 font-mono"
              >
                ← Back to Active Node
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
