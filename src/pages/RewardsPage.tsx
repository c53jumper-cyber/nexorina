import React, { useState } from 'react';
import {
  Gift,
  Cpu,
  LineChart,
  Megaphone,
  Sparkles,
  TrendingUp,
  CheckCircle,
  Download,
} from 'lucide-react';
import { MetricCard } from '../components/common/MetricCard';

interface RewardsPageProps {
  miningRewards: number;
  tradingRewards: number;
  campaignRewards: number;
  onClaimSuccess?: () => void;
}

export const RewardsPage: React.FC<RewardsPageProps> = ({
  miningRewards,
  tradingRewards,
  campaignRewards,
}) => {
  const [filter, setFilter] = useState<'All' | 'Mining' | 'Trader' | 'Campaign' | 'Bonus'>('All');
  const [claimedNotice, setClaimedNotice] = useState<string | null>(null);

  const bonusRewards = 540.0;
  const totalRewards = miningRewards + tradingRewards + campaignRewards + bonusRewards;

  const rewardHistory = [
    {
      id: 'RWD-891',
      source: 'Mining',
      asset: 'ETH',
      amount: '0.042 ETH',
      usdValue: 142.8,
      status: 'Claimed',
      date: '2026-09-22 11:34',
    },
    {
      id: 'RWD-890',
      source: 'Trader',
      asset: 'BTC',
      amount: '0.0034 BTC',
      usdValue: 221.0,
      status: 'Claimed',
      date: '2026-09-21 14:05',
    },
    {
      id: 'RWD-889',
      source: 'Campaign',
      asset: 'USDT',
      amount: '45.00 USDT',
      usdValue: 45.0,
      status: 'Claimed',
      date: '2026-09-21 09:12',
    },
    {
      id: 'RWD-888',
      source: 'Bonus',
      asset: 'USDT',
      amount: '100.00 USDT',
      usdValue: 100.0,
      status: 'Claimed',
      date: '2026-09-20 18:00',
    },
    {
      id: 'RWD-887',
      source: 'Mining',
      asset: 'BTC',
      amount: '0.00098 BTC',
      usdValue: 63.7,
      status: 'Ready to Claim',
      date: '2026-09-20 11:30',
    },
    {
      id: 'RWD-886',
      source: 'Trader',
      asset: 'SOL',
      amount: '0.35 SOL',
      usdValue: 49.0,
      status: 'Claimed',
      date: '2026-09-19 16:40',
    },
  ];

  const filteredHistory =
    filter === 'All' ? rewardHistory : rewardHistory.filter((r) => r.source === filter);

  const handleClaimAll = () => {
    setClaimedNotice('All pending rewards claimed and transferred to Available Balance!');
    setTimeout(() => setClaimedNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <Gift className="h-3.5 w-3.5" />
            <span>DECENTRALIZED REWARD LEDGER & SETTLEMENT POOL</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            Ecosystem Rewards Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Audit your cumulative generated yield across mining nodes, quantitative trading, affiliate
            campaigns, and platform loyalty bonuses.
          </p>
        </div>

        <button
          onClick={handleClaimAll}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-semibold text-white hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/30 transition-all"
        >
          <Gift className="h-4 w-4" /> Claim All Accrued Yield
        </button>
      </div>

      {claimedNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300">
          <CheckCircle className="h-4 w-4" />
          <span>{claimedNotice}</span>
        </div>
      )}

      {/* 5 Core Reward Stat Cards requested */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Total Rewards"
          value={`$${totalRewards.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          change="Cumulative"
          isPositive={true}
          subtitle="All sources"
          icon={Gift}
          iconColor="text-indigo-400"
        />
        <MetricCard
          title="Mining Rewards"
          value={`$${miningRewards.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          change="Stratum V2"
          isPositive={true}
          subtitle="Fleet payout"
          icon={Cpu}
          iconColor="text-blue-400"
        />
        <MetricCard
          title="Trading Rewards"
          value={`$${tradingRewards.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          change="Quant tasks"
          isPositive={true}
          subtitle="Daily directives"
          icon={LineChart}
          iconColor="text-cyan-400"
        />
        <MetricCard
          title="Campaign Rewards"
          value={`$${campaignRewards.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          change="Affiliate pool"
          isPositive={true}
          subtitle="User referrals"
          icon={Megaphone}
          iconColor="text-purple-400"
        />
        <MetricCard
          title="Bonus Rewards"
          value={`$${bonusRewards.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          change="VIP obsidian"
          isPositive={true}
          subtitle="Loyalty incentives"
          icon={Sparkles}
          iconColor="text-pink-400"
        />
      </div>

      {/* Reward History Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D17] p-5 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.07]">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">Reward Distribution History</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified automated batch transactions credited to your address
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl self-start">
            {(['All', 'Mining', 'Trader', 'Campaign', 'Bonus'] as const).map((source) => (
              <button
                key={source}
                onClick={() => setFilter(source)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
                  filter === source ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {source}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-slate-400">
                <th className="py-3 font-medium">Batch ID</th>
                <th className="py-3 font-medium">Source Module</th>
                <th className="py-3 font-medium">Asset</th>
                <th className="py-3 font-medium text-right">Reward Amount</th>
                <th className="py-3 font-medium text-right">USD Value</th>
                <th className="py-3 font-medium text-right">Timestamp</th>
                <th className="py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredHistory.map((row) => (
                <tr key={row.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 font-mono text-slate-300 font-semibold">{row.id}</td>
                  <td className="py-3">
                    <span className="text-slate-200 font-medium">{row.source} Module</span>
                  </td>
                  <td className="py-3 font-mono text-slate-400">{row.asset}</td>
                  <td className="py-3 text-right font-mono text-white font-semibold tabular-nums">
                    {row.amount}
                  </td>
                  <td className="py-3 text-right font-mono text-emerald-400 tabular-nums">
                    +${row.usdValue.toFixed(2)}
                  </td>
                  <td className="py-3 text-right font-mono text-slate-500 tabular-nums">{row.date}</td>
                  <td className="py-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-mono ${
                        row.status === 'Claimed' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          row.status === 'Claimed' ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      />
                      {row.status}
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
