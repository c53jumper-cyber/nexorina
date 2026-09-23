import React from 'react';
import { Clock, ArrowUpRight, ArrowDownRight, Target, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { RiskBadge } from './RiskBadge';
import { AISignal } from '../../types/trader';

interface SignalCardProps {
  signal: AISignal;
  onViewSignal: (signal: AISignal) => void;
  onApplySignal?: (signal: AISignal) => void;
}

export const SignalCard: React.FC<SignalCardProps> = ({
  signal,
  onViewSignal,
  onApplySignal,
}) => {
  const isLong = signal.direction === 'LONG';

  return (
    <Card
      variant="default"
      padding="lg"
      hoverEffect={true}
      className="relative overflow-hidden border-white/[0.08] hover:border-indigo-500/30 transition-all duration-200"
    >
      {/* Direction Accent Glow Bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          isLong ? 'bg-emerald-500 shadow-[0_0_10px_#10B981]' : 'bg-rose-500 shadow-[0_0_10px_#F43F5E]'
        }`}
      />

      {/* Card Header: Pair, Direction Badge, Confidence */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base font-bold text-white font-display">
              {signal.pair}
            </span>
            <span className="text-slate-500 text-xs font-mono">[{signal.timeframe}]</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded-md ${
                isLong
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}
            >
              {isLong ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              <span>{signal.direction}</span>
            </span>
            <RiskBadge level={signal.riskLevel} size="sm" />
          </div>
        </div>

        {/* AI Confidence Meter */}
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-[11px] font-mono text-cyan-400">
            <Sparkles className="h-3 w-3" />
            <span>AI Confidence</span>
          </div>
          <div className="text-lg font-bold font-mono text-white">
            {signal.confidence}%
          </div>
          <span className="text-[10px] text-slate-500 font-mono block">
            {signal.timeAgo}
          </span>
        </div>
      </div>

      {/* Trading Targets Grid */}
      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-4 text-xs font-mono">
        <div>
          <span className="text-[10px] text-slate-400 block font-sans">Entry Zone</span>
          <span className="text-slate-200 font-medium block mt-0.5 text-[11px] truncate">
            {signal.entryZone}
          </span>
        </div>
        <div className="border-x border-white/[0.06] px-2">
          <span className="text-[10px] text-emerald-400 block font-sans font-medium">Target Price</span>
          <span className="text-emerald-400 font-bold block mt-0.5 text-[11px]">
            {signal.targetPrice}
          </span>
        </div>
        <div className="pl-1">
          <span className="text-[10px] text-rose-400 block font-sans font-medium">Stop Loss</span>
          <span className="text-rose-400 font-bold block mt-0.5 text-[11px]">
            {signal.stopLoss}
          </span>
        </div>
      </div>

      {/* Rationale Snippet */}
      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
        {signal.rationale}
      </p>

      {/* Footer & Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-1.5 text-[11px] font-mono">
          <span
            className={`h-2 w-2 rounded-full ${
              signal.status === 'Active'
                ? 'bg-emerald-400 shadow-[0_0_6px_#34D399]'
                : signal.status === 'Target 1 Reached'
                ? 'bg-cyan-400'
                : 'bg-slate-500'
            }`}
          />
          <span className="text-slate-300">{signal.status}</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onViewSignal(signal)}
          >
            View Signal
          </Button>
          {onApplySignal && (
            <Button
              variant="primary"
              size="xs"
              onClick={() => onApplySignal(signal)}
            >
              Simulate Setup
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
