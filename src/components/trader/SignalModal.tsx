import React from 'react';
import { Target, Shield, Clock, Sparkles, ArrowUpRight, ArrowDownRight, X, Layers, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';
import { RiskBadge } from './RiskBadge';
import { AISignal } from '../../types/trader';

interface SignalModalProps {
  isOpen: boolean;
  onClose: () => void;
  signal: AISignal | null;
  onSimulate?: (signal: AISignal) => void;
}

export const SignalModal: React.FC<SignalModalProps> = ({
  isOpen,
  onClose,
  signal,
  onSimulate,
}) => {
  if (!isOpen || !signal) return null;

  const isLong = signal.direction === 'LONG';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.12] bg-[#0C101D] p-6 shadow-2xl shadow-indigo-500/10 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold font-mono text-sm border ${
                isLong
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
              }`}
            >
              {isLong ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-display">
                  {signal.pair}
                </h2>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    isLong
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-rose-500/15 text-rose-400'
                  }`}
                >
                  {signal.direction}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Timeframe: {signal.timeframe} · Generated {signal.timeAgo}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-white/[0.05]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 text-xs">
          {/* Signal Confidence & Risk */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">
                Model Confidence
              </span>
              <div className="flex items-center gap-1.5 mt-1">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span className="text-lg font-bold font-mono text-white">
                  {signal.confidence}%
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">
                Risk Classification
              </span>
              <div className="mt-1">
                <RiskBadge level={signal.riskLevel} />
              </div>
            </div>
          </div>

          {/* Zones */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-sans">Entry Execution Zone</span>
              <span className="text-white font-bold">{signal.entryZone}</span>
            </div>
            <div className="flex items-center justify-between border-t border-white/[0.04] pt-2">
              <span className="text-emerald-400 font-sans">Take Profit Target 1</span>
              <span className="text-emerald-400 font-bold">{signal.targetPrice}</span>
            </div>
            {signal.targetPriceSecondary && (
              <div className="flex items-center justify-between border-t border-white/[0.04] pt-2">
                <span className="text-emerald-400 font-sans">Take Profit Target 2</span>
                <span className="text-emerald-400 font-bold">
                  {signal.targetPriceSecondary}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-white/[0.04] pt-2">
              <span className="text-rose-400 font-sans">Invalidation / Stop Loss</span>
              <span className="text-rose-400 font-bold">{signal.stopLoss}</span>
            </div>
          </div>

          {/* Algorithmic Rationale */}
          <div className="p-3.5 rounded-xl bg-indigo-500/[0.03] border border-indigo-500/20 space-y-1.5">
            <div className="flex items-center gap-1.5 text-indigo-300 font-semibold text-xs">
              <Layers className="h-3.5 w-3.5" />
              <span>Algorithmic Hypothesis & Taker Flow</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed">
              {signal.rationale}
            </p>
          </div>

          {/* Simulation disclaimer */}
          <p className="text-[11px] text-slate-500 font-mono text-center">
            * Nexorina signals are quantitative algorithmic models. Past performance does not guarantee
            future results.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Dismiss
          </Button>
          {onSimulate && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                onSimulate(signal);
                onClose();
              }}
            >
              Simulate Order Execution
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
