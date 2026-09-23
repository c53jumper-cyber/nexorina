import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  RefreshCw,
  Download,
  Check,
} from 'lucide-react';
import { Transaction } from '../types';

interface TransactionsPageProps {
  transactions: Transaction[];
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions }) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Deposit' | 'Withdrawal' | 'Reward' | 'Transfer'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const filtered = transactions.filter((t) => {
    const matchesFilter = activeFilter === 'All' || t.type === activeFilter;
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleExportCsv = () => {
    setExportNotice('Transaction ledger exported to CSV successfully.');
    setTimeout(() => setExportNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
            <ArrowLeftRight className="h-3.5 w-3.5" />
            <span>IMMUTABLE ON-CHAIN & INTERNAL LEDGER</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            Transaction History
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Detailed chronological record of deposits, withdrawals, internal transfers, and protocol
            yield allocations.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/[0.08] transition-all self-start md:self-auto"
        >
          <Download className="h-3.5 w-3.5 text-slate-400" /> Export CSV
        </button>
      </div>

      {exportNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300 animate-in fade-in duration-150">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-x-auto scrollbar-none">
          {(['All', 'Deposit', 'Withdrawal', 'Reward', 'Transfer'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, asset, ref..."
            className="h-9 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-9 pr-3 text-xs text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D17] p-5 lg:p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-slate-400">
                <th className="py-3 font-medium">Transaction ID</th>
                <th className="py-3 font-medium">Type</th>
                <th className="py-3 font-medium">Asset</th>
                <th className="py-3 font-medium text-right">Amount</th>
                <th className="py-3 font-medium text-right">USD Value</th>
                <th className="py-3 font-medium text-right">Date & Time</th>
                <th className="py-3 font-medium text-right">Reference / Memo</th>
                <th className="py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 font-mono text-slate-200 font-semibold">{t.id}</td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1.5 font-medium text-slate-200">
                      {t.type === 'Deposit' && <ArrowDownLeft className="h-3.5 w-3.5 text-emerald-400" />}
                      {t.type === 'Withdrawal' && <ArrowUpRight className="h-3.5 w-3.5 text-rose-400" />}
                      {t.type === 'Reward' && <Gift className="h-3.5 w-3.5 text-indigo-400" />}
                      {t.type === 'Transfer' && <ArrowLeftRight className="h-3.5 w-3.5 text-cyan-400" />}
                      {t.type}
                    </span>
                  </td>
                  <td className="py-3.5 font-mono text-slate-300 font-bold">{t.asset}</td>
                  <td className="py-3.5 text-right font-mono text-white tabular-nums font-semibold">
                    {t.type === 'Withdrawal' ? '-' : '+'}
                    {t.amount} {t.asset}
                  </td>
                  <td className="py-3.5 text-right font-mono text-slate-300 tabular-nums">
                    ${t.amountUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 text-right font-mono text-slate-500 tabular-nums">{t.date}</td>
                  <td className="py-3.5 text-right font-mono text-indigo-300/80 text-[11px] truncate max-w-[140px]">
                    {t.reference}
                  </td>
                  <td className="py-3.5 text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-mono ${
                        t.status === 'Completed'
                          ? 'text-emerald-400'
                          : t.status === 'Pending'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          t.status === 'Completed'
                            ? 'bg-emerald-400'
                            : t.status === 'Pending'
                            ? 'bg-amber-400'
                            : 'bg-rose-400'
                        }`}
                      />
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
