import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  actionText?: string;
  onAction?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  isPositive = true,
  subtitle,
  icon: Icon,
  iconColor = 'text-indigo-400',
  actionText,
  onAction,
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-[#0C101A] p-5 transition-all duration-200 hover:border-white/[0.14] hover:bg-[#0E1321]">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium tracking-wide text-slate-400">{title}</span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.06] ${iconColor}`}>
          <Icon className="h-4.5 w-4.5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
          {value}
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          {change && (
            <span
              className={`inline-flex items-center gap-0.5 font-medium tabular-nums ${
                isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {change}
            </span>
          )}
          {subtitle && (
            <>
              {change && <span className="text-slate-600">·</span>}
              <span className="text-slate-400 truncate max-w-[170px]">{subtitle}</span>
            </>
          )}
        </div>

        {actionText && onAction && (
          <button
            onClick={onAction}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors whitespace-nowrap"
          >
            {actionText} →
          </button>
        )}
      </div>
    </div>
  );
};
