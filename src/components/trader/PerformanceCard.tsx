import React from 'react';
import { TrendingUp, TrendingDown, Target, CheckCircle2, Award, Zap } from 'lucide-react';
import { TodayPerformance } from '../../types/trader';

interface PerformanceCardProps {
  performance: TodayPerformance;
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({ performance }) => {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F19] p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
              Today's Performance
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">
              Daily settlement cycle (24h)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 font-mono text-xs text-emerald-400">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>+{performance.pnlPercent}%</span>
        </div>
      </div>

      {/* Main Metric: Net Today's P&L */}
      <div className="mb-5">
        <div className="text-3xl font-extrabold font-mono text-emerald-400">
          +${performance.pnlUsd.toFixed(2)}
        </div>
        <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
          Net profit across active tasks & bot runs
        </span>
      </div>

      {/* Sub metrics: Gross Profit, Loss, Win Rate, Tasks */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs font-mono">
        <div>
          <span className="text-[10px] text-slate-400 block font-sans">Gross Profit</span>
          <span className="text-emerald-400 font-bold block mt-0.5">
            +${performance.profitUsd.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-sans">Drawdown / Loss</span>
          <span className="text-rose-400 font-bold block mt-0.5">
            -${performance.lossUsd.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-sans">Win Rate</span>
          <span className="text-white font-bold block mt-0.5">
            {performance.winRate}%
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-sans">Daily Tasks</span>
          <span className="text-cyan-400 font-bold block mt-0.5">
            {performance.completedTasks} / {performance.totalTasks} Done
          </span>
        </div>
      </div>
    </div>
  );
};
