import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Filter, Search } from 'lucide-react';
import { TradeHistoryItem } from '../../types/trader';

interface TradeTableProps {
  trades: TradeHistoryItem[];
  compact?: boolean;
}

export const TradeTable: React.FC<TradeTableProps> = ({ trades, compact = false }) => {
  const [filterSide, setFilterSide] = useState<'ALL' | 'BUY' | 'SELL' | 'LONG' | 'SHORT'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrades = trades.filter((t) => {
    if (filterSide !== 'ALL' && t.side !== filterSide) return false;
    if (
      searchQuery &&
      !t.pair.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.id.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-3">
      {!compact && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search trade ID or pair..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-9 pr-3 text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1 overflow-x-auto text-[11px] font-mono">
            {(['ALL', 'LONG', 'SHORT', 'BUY', 'SELL'] as const).map((side) => (
              <button
                key={side}
                onClick={() => setFilterSide(side)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  filterSide === side
                    ? 'bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {side}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0B0F19]">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/[0.06] bg-white/[0.01] text-[10px] font-mono uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3">Trade ID</th>
              <th className="px-4 py-3">Pair / Side</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Entry / Exit</th>
              <th className="px-4 py-3 text-right">P&L</th>
              <th className="px-4 py-3 text-right">Fee</th>
              {!compact && <th className="px-4 py-3">Type</th>}
              <th className="px-4 py-3 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] font-mono text-xs">
            {filteredTrades.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-500 font-sans">
                  No trade records found.
                </td>
              </tr>
            ) : (
              filteredTrades.map((t) => {
                const isLong = t.side === 'LONG' || t.side === 'BUY';
                const isProfit = t.pnlUsd >= 0;

                return (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-indigo-400 font-medium">
                      {t.id}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-semibold">{t.pair}</span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isLong
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-rose-500/10 text-rose-400'
                          }`}
                        >
                          {t.side}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <div>${t.amountUsd.toFixed(2)}</div>
                      <div className="text-[10px] text-slate-500">
                        {t.amount} {t.asset}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <div>${t.entryPrice.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500">
                        → ${t.exitPrice.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-semibold ${
                          isProfit ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {isProfit ? '+' : ''}${t.pnlUsd.toFixed(2)} ({isProfit ? '+' : ''}
                        {t.pnlPercent.toFixed(2)}%)
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-slate-400">
                      ${t.feeUsd.toFixed(2)}
                    </td>
                    {!compact && (
                      <td className="px-4 py-3 text-[11px] text-slate-400 font-sans">
                        {t.executionType}
                      </td>
                    )}
                    <td className="px-4 py-3 text-right text-slate-500 text-[11px]">
                      {t.date}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
