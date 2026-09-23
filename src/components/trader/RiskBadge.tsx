import React from 'react';

interface RiskBadgeProps {
  level: 'Low' | 'Medium' | 'High' | 'Conservative' | 'Moderate' | 'Aggressive' | 'High Risk';
  size?: 'sm' | 'md';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md' }) => {
  const isLow = level === 'Low' || level === 'Conservative';
  const isMed = level === 'Medium' || level === 'Moderate';
  const isHigh = level === 'High' || level === 'Aggressive' || level === 'High Risk';

  let colorClasses = 'border-amber-500/30 bg-amber-500/10 text-amber-300';
  let dotColor = 'bg-amber-400';

  if (isLow) {
    colorClasses = 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
    dotColor = 'bg-emerald-400';
  } else if (isHigh) {
    colorClasses = 'border-rose-500/30 bg-rose-500/10 text-rose-300';
    dotColor = 'bg-rose-400';
  }

  const textSize = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border font-mono font-medium ${textSize} ${colorClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      <span>{level} Risk</span>
    </span>
  );
};
