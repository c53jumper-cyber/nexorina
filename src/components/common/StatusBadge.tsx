import React from 'react';

export type StatusType =
  | 'active'
  | 'hot'
  | 'new'
  | 'completed'
  | 'pending'
  | 'paused'
  | 'confirmed'
  | 'live'
  | 'upcoming';

export interface StatusBadgeProps {
  status: StatusType | string;
  dotOnly?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  dotOnly = false,
  className = '',
}) => {
  const normalized = status.toLowerCase();

  const getStatusConfig = () => {
    switch (normalized) {
      case 'active':
      case 'live':
      case 'confirmed':
        return {
          dotColor: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
          textColor: 'text-emerald-400',
          label: status,
        };
      case 'hot':
        return {
          dotColor: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]',
          textColor: 'text-amber-400',
          label: status,
        };
      case 'new':
        return {
          dotColor: 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]',
          textColor: 'text-cyan-400',
          label: status,
        };
      case 'completed':
        return {
          dotColor: 'bg-indigo-400 shadow-[0_0_8px_#818cf8]',
          textColor: 'text-indigo-300',
          label: status,
        };
      case 'pending':
      case 'upcoming':
        return {
          dotColor: 'bg-blue-400 shadow-[0_0_8px_#60a5fa]',
          textColor: 'text-blue-300',
          label: status,
        };
      case 'paused':
      case 'maintenance':
        return {
          dotColor: 'bg-rose-400 shadow-[0_0_8px_#fb7185]',
          textColor: 'text-rose-400',
          label: status,
        };
      default:
        return {
          dotColor: 'bg-slate-400',
          textColor: 'text-slate-300',
          label: status,
        };
    }
  };

  const config = getStatusConfig();

  if (dotOnly) {
    return (
      <span
        className={`inline-block h-2 w-2 rounded-full ${config.dotColor} ${className}`}
        title={config.label}
      />
    );
  }

  // Unboxed clean typography with glowing status dot (adheres strictly to no-pill rule)
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-medium ${config.textColor} ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dotColor}`} />
      <span>{config.label}</span>
    </span>
  );
};
