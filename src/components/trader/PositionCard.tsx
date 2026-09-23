import React from 'react';
import { ArrowUpRight, ArrowDownRight, ShieldAlert, X } from 'lucide-react';
import { Button } from '../common/Button';
import { TraderPosition } from '../../types/trader';

interface PositionCardProps {
  position: TraderPosition;
  onClosePosition: (positionId: string) => void;
}

export const PositionCard: React.FC<PositionCardProps> = ({
  position,
  onClosePosition,
}) => {
  const isLong = position.side === 'LONG';
  const isProfit = position.pnlUsd >= 0;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F19] p-4 hover:border-white/[0.15] transition-all">
      {/* Position Header: Asset, Side, Leverage, Live PnL */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white font-display">
            {position.pair}
          </span>
          <span
            className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${
              isLong
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
            }`}
          >
            {position.side} {position.leverage}x
          </span>
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
            {position.timeOpened}
          </span>
        </div>

        <div className="text-right">
          <div
            className={`text-sm font-bold font-mono ${
              isProfit ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isProfit ? '+' : ''}${position.pnlUsd.toFixed(2)} ({isProfit ? '+' : ''}
            {position.pnlPercent.toFixed(2)}%)
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Unrealized P&L</span>
        </div>
      </div>

      {/* Numerical Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs font-mono mb-3">
        <div>
          <span className="text-[10px] text-slate-400 block font-sans">Position Size</span>
          <span className="text-slate-200 font-semibold block mt-0.5">
            ${position.sizeUsd.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-sans">Margin</span>
          <span className="text-slate-200 font-semibold block mt-0.5">
            ${position.marginUsd.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-sans">Entry Price</span>
          <span className="text-slate-200 font-semibold block mt-0.5">
            ${position.entryPrice.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-sans">Mark / Liq. Price</span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-slate-200 font-semibold">
              ${position.markPrice.toLocaleString()}
            </span>
            <span className="text-[10px] text-rose-400/90 font-mono">
              (${position.liquidationPrice.toLocaleString()})
            </span>
          </div>
        </div>
      </div>

      {/* Action: Close Position */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] font-mono text-slate-500">
          Simulated Margin Position
        </span>
        <Button
          variant="outline"
          size="xs"
          onClick={() => onClosePosition(position.id)}
          className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
        >
          Market Close
        </Button>
      </div>
    </div>
  );
};
