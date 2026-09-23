import React from 'react';

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`rounded-2xl border border-white/[0.06] bg-[#0B0F19] p-5 animate-pulse ${className}`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="h-3.5 w-24 rounded bg-white/[0.06]" />
      <div className="h-9 w-9 rounded-xl bg-white/[0.06]" />
    </div>
    <div className="h-7 w-36 rounded bg-white/[0.08] mb-4" />
    <div className="h-3 w-28 rounded bg-white/[0.04]" />
  </div>
);

export const SkeletonChart: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div
    className={`rounded-2xl border border-white/[0.06] bg-[#0B0F19] p-6 animate-pulse ${className}`}
  >
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="h-4 w-32 rounded bg-white/[0.08] mb-2" />
        <div className="h-7 w-28 rounded bg-white/[0.06]" />
      </div>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-7 w-10 rounded-lg bg-white/[0.05]" />
        ))}
      </div>
    </div>
    <div className="h-64 w-full rounded-xl bg-white/[0.03] flex items-end justify-between px-4 pb-4 gap-3">
      {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
        <div
          key={i}
          className="w-full rounded bg-white/[0.05]"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  </div>
);

export const SkeletonActivityRow: React.FC = () => (
  <div className="flex items-center justify-between py-3.5 border-b border-white/[0.04] animate-pulse">
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-xl bg-white/[0.06]" />
      <div>
        <div className="h-3.5 w-36 rounded bg-white/[0.08] mb-1.5" />
        <div className="h-2.5 w-48 rounded bg-white/[0.04]" />
      </div>
    </div>
    <div className="text-right">
      <div className="h-3.5 w-16 rounded bg-white/[0.08] mb-1.5 ml-auto" />
      <div className="h-2.5 w-12 rounded bg-white/[0.04] ml-auto" />
    </div>
  </div>
);

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 4 }) => (
  <div className="rounded-2xl border border-white/[0.06] bg-[#0B0F19] p-5 space-y-3 animate-pulse">
    <div className="h-4 w-40 rounded bg-white/[0.08] mb-4" />
    {Array.from({ length: rows }).map((_, idx) => (
      <SkeletonActivityRow key={idx} />
    ))}
  </div>
);
