import React from 'react';

interface ArcReactorProps {
  status?: 'idle' | 'listening' | 'thinking' | 'speaking' | 'offline';
  isAudioActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  mode?: 'online' | 'offline' | 'auto';
}

export const ArcReactor: React.FC<ArcReactorProps> = ({
  status = 'idle',
  isAudioActive = false,
  size = 'md',
  mode = 'auto',
}) => {
  const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
  };

  const getThemeColor = () => {
    if (status === 'offline' || mode === 'offline') {
      return {
        primary: '#10b981', // Emerald for offline sovereign
        secondary: '#059669',
        glow: 'rgba(16, 185, 129, 0.4)',
        border: 'border-emerald-500/40',
        text: 'text-emerald-400',
      };
    }
    if (status === 'listening') {
      return {
        primary: '#ef4444', // Red for active mic
        secondary: '#dc2626',
        glow: 'rgba(239, 68, 68, 0.5)',
        border: 'border-red-500/50',
        text: 'text-red-400',
      };
    }
    if (status === 'thinking') {
      return {
        primary: '#3b82f6', // Blue for neural compute
        secondary: '#2563eb',
        glow: 'rgba(59, 130, 246, 0.5)',
        border: 'border-blue-500/50',
        text: 'text-blue-400',
      };
    }
    return {
      primary: '#06b6d4', // Cyan default Jarvis
      secondary: '#0891b2',
      glow: 'rgba(6, 182, 212, 0.45)',
      border: 'border-cyan-500/40',
      text: 'text-cyan-400',
    };
  };

  const theme = getThemeColor();

  return (
    <div className={`relative flex items-center justify-center ${sizeMap[size]} select-none group`}>
      {/* Outer Glow Halo */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-700 blur-xl opacity-60"
        style={{
          background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
          transform: status === 'speaking' || isAudioActive ? 'scale(1.15)' : 'scale(1)',
        }}
      />

      {/* Outer Segmented Rotating Ring */}
      <div
        className="absolute inset-0 rounded-full border border-dashed border-cyan-500/30 animate-spin-slow"
        style={{
          borderColor: `${theme.primary}40`,
          animationDuration: status === 'thinking' ? '6s' : '24s',
        }}
      />

      {/* Middle Counter-Rotating Gear Ring */}
      <div
        className="absolute inset-3 rounded-full border border-dotted border-blue-400/40 animate-spin-reverse-slow"
        style={{
          borderColor: `${theme.secondary}60`,
          animationDuration: status === 'thinking' ? '4s' : '18s',
        }}
      />

      {/* Geometric HUD Ticks */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke={theme.primary}
          strokeWidth="0.8"
          strokeDasharray="4 8"
          opacity="0.6"
        />
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke={theme.secondary}
          strokeWidth="1.2"
          strokeDasharray="12 4 2 4"
          opacity="0.8"
        />
        {/* Core Crosshairs */}
        <line x1="10" y1="50" x2="24" y2="50" stroke={theme.primary} strokeWidth="0.8" opacity="0.5" />
        <line x1="76" y1="50" x2="90" y2="50" stroke={theme.primary} strokeWidth="0.8" opacity="0.5" />
        <line x1="50" y1="10" x2="50" y2="24" stroke={theme.primary} strokeWidth="0.8" opacity="0.5" />
        <line x1="50" y1="76" x2="50" y2="90" stroke={theme.primary} strokeWidth="0.8" opacity="0.5" />
      </svg>

      {/* Inner Pulsing Arc Core */}
      <div
        className={`relative z-10 w-20 h-20 rounded-full flex flex-col items-center justify-center bg-slate-950/90 border-2 ${theme.border} shadow-inner transition-transform duration-300`}
        style={{
          boxShadow: `0 0 30px ${theme.glow}, inset 0 0 15px ${theme.glow}`,
          transform: status === 'speaking' || isAudioActive ? 'scale(1.08)' : 'scale(1)',
        }}
      >
        <div className="text-[11px] font-black tracking-widest text-white/90 font-display">
          M.K AI
        </div>
        <div className={`text-[8px] tracking-wider uppercase font-mono font-semibold ${theme.text}`}>
          {status}
        </div>

        {/* Audio Reactivity Bars */}
        <div className="flex items-center gap-0.5 mt-1.5 h-3">
          {[1, 2, 3, 4, 5].map((i) => {
            const height =
              status === 'speaking' || isAudioActive
                ? `${Math.max(4, (i * 3 + Math.random() * 8)) * 1.2}px`
                : status === 'listening'
                ? `${4 + (i % 3) * 3}px`
                : '3px';
            return (
              <div
                key={i}
                className="w-1 rounded-full transition-all duration-100"
                style={{
                  height,
                  backgroundColor: theme.primary,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
