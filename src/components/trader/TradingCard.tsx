import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '../common/Card';

interface TradingCardProps {
  title: string;
  subtitle?: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon?: LucideIcon;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const TradingCard: React.FC<TradingCardProps> = ({
  title,
  subtitle,
  value,
  change,
  isPositive = true,
  icon: Icon,
  badge,
  children,
  className = '',
}) => {
  return (
    <Card variant="default" padding="md" className={`relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {Icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono block">
              {title}
            </span>
            {subtitle && (
              <span className="text-[10px] text-slate-500 font-mono">{subtitle}</span>
            )}
          </div>
        </div>

        {badge}
      </div>

      <div className="flex items-baseline justify-between mb-1">
        <div className="text-2xl font-bold font-mono text-white">{value}</div>
        {change && (
          <span
            className={`text-xs font-mono font-medium ${
              isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {change}
          </span>
        )}
      </div>

      {children}
    </Card>
  );
};
