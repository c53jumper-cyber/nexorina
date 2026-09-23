import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../common/Card';
import { TraderPortfolioAsset } from '../../types/trader';

interface AssetCardProps {
  asset: TraderPortfolioAsset;
  onTradeAsset?: (symbol: string) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset, onTradeAsset }) => {
  const isPositive24h = asset.change24h >= 0;
  const isPositivePnl = asset.pnlUsd >= 0;

  return (
    <Card variant="default" padding="md" hoverEffect={true}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl font-mono text-xs font-bold text-white shadow-inner"
            style={{ backgroundColor: `${asset.color}25`, border: `1px solid ${asset.color}50` }}
          >
            {asset.symbol.slice(0, 3)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white font-display">{asset.name}</span>
              <span className="text-[11px] font-mono text-slate-500">{asset.symbol}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              {asset.amount} {asset.symbol}
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-sm font-bold font-mono text-white">
            ${asset.valueUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div
            className={`flex items-center justify-end gap-0.5 text-[11px] font-mono ${
              isPositive24h ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPositive24h ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>
              {isPositive24h ? '+' : ''}
              {asset.change24h}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] text-[11px] font-mono mb-2">
        <div>
          <span className="text-[10px] text-slate-400 block font-sans">Avg Entry</span>
          <span className="text-slate-300 font-semibold block mt-0.5">
            ${asset.averageEntryUsd.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-sans">Current Price</span>
          <span className="text-slate-200 font-semibold block mt-0.5">
            ${asset.currentPriceUsd.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 block font-sans">Total P&L</span>
          <span
            className={`font-semibold block mt-0.5 ${
              isPositivePnl ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {isPositivePnl ? '+' : ''}${asset.pnlUsd.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-1">
        <span>Portfolio Share: {asset.allocationPercent}%</span>
        {onTradeAsset && (
          <button
            onClick={() => onTradeAsset(asset.symbol)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Trade {asset.symbol} →
          </button>
        )}
      </div>
    </Card>
  );
};
