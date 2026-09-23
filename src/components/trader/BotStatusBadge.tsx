import React from 'react';
import { Play, Pause, Square, CheckCircle } from 'lucide-react';

interface BotStatusBadgeProps {
  status: 'Active' | 'Paused' | 'Stopped' | 'Ready';
}

export const BotStatusBadge: React.FC<BotStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'Active':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-mono font-medium text-emerald-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span>Running Active</span>
        </span>
      );
    case 'Paused':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-mono font-medium text-amber-300">
          <Pause className="h-3 w-3" />
          <span>Paused</span>
        </span>
      );
    case 'Stopped':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-white/[0.03] px-2.5 py-1 text-xs font-mono font-medium text-slate-400">
          <Square className="h-3 w-3" />
          <span>Stopped</span>
        </span>
      );
    case 'Ready':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-mono font-medium text-cyan-300">
          <CheckCircle className="h-3 w-3" />
          <span>Ready to Deploy</span>
        </span>
      );
  }
};
