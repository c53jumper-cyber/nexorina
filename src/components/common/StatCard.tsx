import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor?: 'indigo' | 'emerald' | 'cyan' | 'amber' | 'purple';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  subtitle = 'vs previous 30d',
  icon: Icon,
  accentColor = 'indigo',
  onClick,
}) => {
  const accentGlow = {
    indigo: 'from-indigo-500/10 via-transparent to-transparent border-indigo-500/20 group-hover:border-indigo-500/40',
    emerald: 'from-emerald-500/10 via-transparent to-transparent border-emerald-500/20 group-hover:border-emerald-500/40',
    cyan: 'from-cyan-500/10 via-transparent to-transparent border-cyan-500/20 group-hover:border-cyan-500/40',
    amber: 'from-amber-500/10 via-transparent to-transparent border-amber-500/20 group-hover:border-amber-500/40',
    purple: 'from-purple-500/10 via-transparent to-transparent border-purple-500/20 group-hover:border-purple-500/40',
  };

  const iconBg = {
    indigo: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    purple: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
  };

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-b ${accentGlow[accentColor]} bg-[#0B0F19] p-5 border transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-medium text-slate-400 block tracking-wide">
            {title}
          </span>
          <div className="text-2xl font-bold font-mono tracking-tight text-white">
            {value}
          </div>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg[accentColor]} transition-transform duration-300 group-hover:scale-110`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/[0.06] text-xs">
        <div className="flex items-center gap-1.5 font-mono font-medium">
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-rose-400" />
          )}
          <span className={isPositive ? 'text-emerald-400' : 'text-rose-400'}>
            {change}
          </span>
        </div>

        <span className="text-[11px] text-slate-500 font-sans">{subtitle}</span>
      </div>
    </div>
  );
};
