import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ProfitLossBadgeProps {
  amount?: number | string;
  percent?: number;
  showIcon?: boolean;
  prefix?: string;
  className?: string;
}

export const ProfitLossBadge: React.FC<ProfitLossBadgeProps> = ({
  amount,
  percent,
  showIcon = true,
  prefix = '$',
  className = '',
}) => {
  const isPositive =
    typeof percent === 'number'
      ? percent >= 0
      : typeof amount === 'number'
      ? amount >= 0
      : !String(amount).startsWith('-');

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono font-semibold ${
        isPositive ? 'text-emerald-400' : 'text-rose-400'
      } ${className}`}
    >
      {showIcon &&
        (isPositive ? (
          <ArrowUpRight className="h-3.5 w-3.5" />
        ) : (
          <ArrowDownRight className="h-3.5 w-3.5" />
        ))}
      <span>
        {isPositive ? '+' : ''}
        {amount !== undefined
          ? typeof amount === 'number'
            ? `${prefix}${Math.abs(amount).toFixed(2)}`
            : amount
          : ''}
        {percent !== undefined ? ` (${isPositive ? '+' : ''}${percent.toFixed(2)}%)` : ''}
      </span>
    </span>
  );
};
