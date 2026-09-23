import React from 'react';
import { Shield, ShieldAlert, AlertTriangle, Activity, Sliders, CheckCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { RiskBadge } from './RiskBadge';
import { RiskManagementStats } from '../../types/trader';

interface RiskCardProps {
  stats: RiskManagementStats;
  onAdjustParameters?: () => void;
}

export const RiskCard: React.FC<RiskCardProps> = ({ stats, onAdjustParameters }) => {
  return (
    <Card variant="default" padding="lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-display">
              Portfolio Risk & Exposure Guard
            </h2>
            <p className="text-xs text-slate-400">
              Real-time volatility monitoring, margin utilization, and circuit breakers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <RiskBadge level={stats.riskLevel} />
          {onAdjustParameters && (
            <button
              onClick={onAdjustParameters}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1"
            >
              Adjust Limits →
            </button>
          )}
        </div>
      </div>

      {/* Grid of Risk Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <span className="text-[10px] text-slate-400 block font-sans">Risk Index Score</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-mono text-amber-400">
              {stats.currentRiskScore}
            </span>
            <span className="text-[11px] font-mono text-slate-500">/ 100</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">Within safe zone</span>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <span className="text-[10px] text-slate-400 block font-sans">Margin Utilization</span>
          <div className="text-xl font-bold font-mono text-white mt-1">
            {stats.marginUtilizationPercent}%
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
            Max suggested: 60%
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <span className="text-[10px] text-slate-400 block font-sans">Current Drawdown</span>
          <div className="text-xl font-bold font-mono text-rose-400 mt-1">
            {stats.currentDrawdownPercent}%
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
            Limit: {stats.maxDrawdownLimitPercent}%
          </span>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <span className="text-[10px] text-slate-400 block font-sans">Daily Exposure</span>
          <div className="text-xl font-bold font-mono text-white mt-1">
            ${stats.dailyRiskExposureUsd.toFixed(2)}
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
            {stats.activePositionsCount} active positions
          </span>
        </div>
      </div>

      {/* Visual Drawdown & Exposure Progress Bars */}
      <div className="space-y-4 bg-white/[0.01] p-4 rounded-xl border border-white/[0.04]">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Drawdown Circuit Breaker Headroom</span>
            <span className="text-slate-400 font-mono">
              {stats.currentDrawdownPercent}% / {stats.maxDrawdownLimitPercent}% Trigger
            </span>
          </div>
          <ProgressBar
            value={(stats.currentDrawdownPercent / stats.maxDrawdownLimitPercent) * 100}
            color="amber"
            size="sm"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-300 font-medium">Margin Exposure Load</span>
            <span className="text-slate-400 font-mono">
              ${stats.totalMarketExposureUsd.toLocaleString()} / $8,450.00 Total
            </span>
          </div>
          <ProgressBar
            value={stats.marginUtilizationPercent}
            color="indigo"
            size="sm"
          />
        </div>
      </div>
    </Card>
  );
};
