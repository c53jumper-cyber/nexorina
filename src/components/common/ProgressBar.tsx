import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showPercent?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'indigo' | 'emerald' | 'cyan' | 'amber' | 'rose' | 'gradient';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showPercent = false,
  size = 'md',
  color = 'indigo',
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorClasses = {
    indigo: 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]',
    emerald: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
    cyan: 'bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.5)]',
    amber: 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
    rose: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]',
    gradient: 'bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 shadow-[0_0_10px_rgba(99,102,241,0.4)]',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          {label && <span className="text-slate-400 text-[11px]">{label}</span>}
          {showPercent && (
            <span className="font-mono text-[11px] font-semibold text-slate-300">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full rounded-full bg-white/[0.06] overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
