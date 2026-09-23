import React, { useState } from 'react';
import { Sparkles, DollarSign, Percent, ShieldCheck, X, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';
import { AITradingRecommendation } from '../../types/trader';

interface ProfitModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: AITradingRecommendation | null;
}

export const ProfitModelModal: React.FC<ProfitModelModalProps> = ({
  isOpen,
  onClose,
  recommendation,
}) => {
  if (!isOpen || !recommendation) return null;

  const [tradeAmount, setTradeAmount] = useState<number>(recommendation.suggestedAmount || 500);

  // Simulated calculation
  const potentialGrossProfit = tradeAmount * (recommendation.expectedProfitPercent / 100);
  const platformFee = potentialGrossProfit * (recommendation.platformFeePercent / 100);
  const userNetProfit = potentialGrossProfit - platformFee;
  const netReturnPercent = (userNetProfit / tradeAmount) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-2xl border border-indigo-500/30 bg-[#0C101F] p-6 shadow-2xl shadow-indigo-900/20 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Nexorina Profit & Performance Sharing Model
              </h2>
              <span className="text-xs font-mono text-cyan-400">
                Setup: {recommendation.pair} ({recommendation.direction})
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
          {/* Strategy info */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Strategy</span>
              <span className="text-xs font-semibold text-white">{recommendation.strategyName}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-mono">Model Confidence</span>
              <span className="text-xs font-bold font-mono text-cyan-400">{recommendation.modelConfidence}%</span>
            </div>
          </div>

          {/* User Amount input */}
          <div>
            <label className="text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
              <span>Simulated Trade Amount</span>
              <span className="text-[11px] font-mono text-indigo-400">
                Expected Gross: +{recommendation.expectedProfitPercent}%
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">$</span>
              <input
                type="number"
                min={50}
                max={25000}
                step={50}
                value={tradeAmount}
                onChange={(e) => setTradeAmount(Math.max(10, Number(e.target.value)))}
                className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] pl-7 pr-3 py-2 text-white font-mono text-xs focus:border-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3 font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <span>User Trading Principal</span>
              <span className="text-white">${tradeAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Estimated Scenario Gross Profit (+{recommendation.expectedProfitPercent}%)</span>
              <span className="text-emerald-400">+${potentialGrossProfit.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1">
                <span>Nexorina Protocol Share</span>
                <span className="text-[10px] text-indigo-400 font-normal">
                  ({recommendation.platformFeePercent}% on net gain only)
                </span>
              </span>
              <span className="text-rose-400">-${platformFee.toFixed(2)}</span>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase font-sans">
                Estimated Net User P&L
              </span>
              <div className="text-right">
                <span className="text-base font-bold text-emerald-400 block">
                  +${userNetProfit.toFixed(2)}
                </span>
                <span className="text-[10px] text-emerald-500">
                  +{netReturnPercent.toFixed(2)}% net on capital
                </span>
              </div>
            </div>
          </div>

          {/* Fee Model Description */}
          <div className="text-[11px] text-slate-400 leading-relaxed bg-indigo-500/[0.03] border border-indigo-500/20 p-3 rounded-xl">
            <div className="flex items-center gap-1.5 text-indigo-300 font-semibold mb-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>High-Watermark Alignment</span>
            </div>
            Nexorina only claims a protocol fee when the simulated or executed trade closes in
            verifiable profit. If a trade breaks even or closes in loss, zero platform fee is
            levied.
          </div>

          <div className="text-[10px] text-slate-500 font-mono text-center">
            * All figures are simulated projections based on current order-book depth. Profit is not
            guaranteed.
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close Preview
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
            }}
          >
            Apply Parameters
          </Button>
        </div>
      </div>
    </div>
  );
};
