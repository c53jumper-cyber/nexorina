import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Copy,
  QrCode,
  ShieldCheck,
  Check,
  Coins,
  Lock,
} from 'lucide-react';
import { CryptoAsset } from '../types';
import { MetricCard } from '../components/common/MetricCard';
import { Modal } from '../components/common/Modal';

interface WalletPageProps {
  assets: CryptoAsset[];
  totalBalance: number;
  availableBalance: number;
  rewardsBalance: number;
}

export const WalletPage: React.FC<WalletPageProps> = ({
  assets,
  totalBalance,
  availableBalance,
  rewardsBalance,
}) => {
  const [modalType, setModalType] = useState<'deposit' | 'withdraw' | 'transfer' | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset>(assets[0]);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [amountInput, setAmountInput] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const pendingBalance = 1710.3;

  const handleCopyDepositAddress = () => {
    navigator.clipboard?.writeText('0x71C...84F092E8b417');
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  const handleExecuteModalAction = () => {
    setNotice(
      `Mock ${modalType?.toUpperCase()} requested for ${amountInput || '1.0'} ${
        selectedAsset.symbol
      }. Interface simulation logged.`
    );
    setTimeout(() => setNotice(null), 3500);
    setModalType(null);
    setAmountInput('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
            <Wallet className="h-3.5 w-3.5" />
            <span>NON-CUSTODIAL VAULT & ASSET MANAGEMENT</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            Multi-Asset Crypto Wallet
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Deposit, transfer, and monitor unified cross-chain liquidity across Bitcoin, Ethereum,
            and high-throughput networks.
          </p>
        </div>

        {/* Action Buttons as requested */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setModalType('deposit')}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all"
          >
            <ArrowDownLeft className="h-4 w-4" /> Deposit
          </button>
          <button
            onClick={() => setModalType('withdraw')}
            className="flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/[0.08] transition-all"
          >
            <ArrowUpRight className="h-4 w-4 text-slate-400" /> Withdraw
          </button>
          <button
            onClick={() => setModalType('transfer')}
            className="flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/[0.08] transition-all"
          >
            <ArrowLeftRight className="h-4 w-4 text-slate-400" /> Transfer
          </button>
        </div>
      </div>

      {notice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300">
          <Check className="h-4 w-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* 4 Core Wallet Balance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Balance"
          value={`$${totalBalance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          change="+3.42%"
          isPositive={true}
          subtitle="All assets combined"
          icon={Wallet}
          iconColor="text-indigo-400"
        />
        <MetricCard
          title="Available Balance"
          value={`$${availableBalance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          subtitle="Instant allocation"
          icon={Coins}
          iconColor="text-emerald-400"
        />
        <MetricCard
          title="Pending Balance"
          value={`$${pendingBalance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          subtitle="Mempool confirmations"
          icon={Lock}
          iconColor="text-amber-400"
        />
        <MetricCard
          title="Rewards Balance"
          value={`$${rewardsBalance.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          subtitle="Mining & Task payouts"
          icon={ShieldCheck}
          iconColor="text-purple-400"
        />
      </div>

      {/* Asset List Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D17] p-5 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.07]">
          <div>
            <h3 className="text-sm font-semibold text-white tracking-tight">Supported Asset Holdings</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live balances, real-time USD valuation, and network status
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">{assets.length} Active Cryptocurrencies</span>
        </div>

        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] text-slate-400">
                <th className="py-3 font-medium">Asset</th>
                <th className="py-3 font-medium">Network</th>
                <th className="py-3 font-medium text-right">Holding Balance</th>
                <th className="py-3 font-medium text-right">USD Valuation</th>
                <th className="py-3 font-medium text-right">24H Price</th>
                <th className="py-3 font-medium text-right">Status</th>
                <th className="py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {assets.map((asset) => (
                <tr key={asset.symbol} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 font-medium text-white flex items-center gap-2.5">
                    <span
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white font-mono"
                      style={{ backgroundColor: asset.iconColor }}
                    >
                      {asset.symbol.slice(0, 3)}
                    </span>
                    <div>
                      <div className="font-semibold text-white">{asset.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{asset.symbol}</div>
                    </div>
                  </td>
                  <td className="py-3.5 text-slate-300 font-mono">{asset.network}</td>
                  <td className="py-3.5 text-right font-mono tabular-nums text-white font-semibold">
                    {asset.balance} {asset.symbol}
                  </td>
                  <td className="py-3.5 text-right font-mono tabular-nums text-slate-200">
                    ${asset.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 text-right font-mono tabular-nums">
                    <span className={asset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                      ${asset.priceUsd.toLocaleString()} ({asset.change24h >= 0 ? `+${asset.change24h}%` : `${asset.change24h}%`})
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Active
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedAsset(asset);
                          setModalType('deposit');
                        }}
                        className="px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[11px] text-slate-300 hover:text-white transition-colors"
                      >
                        Deposit
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAsset(asset);
                          setModalType('withdraw');
                        }}
                        className="px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[11px] text-slate-300 hover:text-white transition-colors"
                      >
                        Withdraw
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modals: Deposit / Withdraw / Transfer */}
      <Modal
        isOpen={!!modalType}
        onClose={() => setModalType(null)}
        title={
          modalType === 'deposit'
            ? `Deposit ${selectedAsset.name} (${selectedAsset.symbol})`
            : modalType === 'withdraw'
            ? `Withdraw ${selectedAsset.name} (${selectedAsset.symbol})`
            : 'Internal Transfer'
        }
        subtitle="Frontend UI prototype · Simulated transaction interface"
      >
        <div className="space-y-4 text-xs">
          {/* Asset selector in modal */}
          <div>
            <label className="text-slate-400 text-xs block mb-1">Select Asset</label>
            <select
              value={selectedAsset.symbol}
              onChange={(e) => {
                const found = assets.find((a) => a.symbol === e.target.value);
                if (found) setSelectedAsset(found);
              }}
              className="w-full rounded-lg bg-white/[0.04] border border-white/[0.1] px-3 py-2 text-xs text-white focus:outline-none"
            >
              {assets.map((a) => (
                <option key={a.symbol} value={a.symbol} className="bg-[#0E1322]">
                  {a.name} ({a.symbol}) — Balance: {a.balance}
                </option>
              ))}
            </select>
          </div>

          {modalType === 'deposit' && (
            <div className="space-y-3">
              <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center">
                <div className="h-32 w-32 rounded-xl bg-white p-2 flex items-center justify-center text-slate-900 shadow-md">
                  <QrCode className="h-28 w-28 text-slate-900" />
                </div>
                <div className="mt-2 text-[11px] text-slate-400 font-mono">
                  Network: {selectedAsset.network}
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs block mb-1">Deposit Address</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-lg px-3 py-2 text-xs font-mono text-slate-200 select-all"
                  />
                  <button
                    onClick={handleCopyDepositAddress}
                    className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shrink-0"
                  >
                    {copiedAddr ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {modalType === 'withdraw' && (
            <div className="space-y-3">
              <div>
                <label className="text-slate-400 text-xs block mb-1">Destination Address</label>
                <input
                  type="text"
                  placeholder="Enter external recipient address"
                  className="w-full rounded-lg bg-white/[0.04] border border-white/[0.1] px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 text-xs block mb-1">Amount ({selectedAsset.symbol})</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    placeholder="0.00"
                    className="w-full rounded-lg bg-white/[0.04] border border-white/[0.1] px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none font-mono"
                  />
                  <button
                    onClick={() => setAmountInput(selectedAsset.balance.toString())}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    MAX
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                Estimated Network Fee: 0.0005 {selectedAsset.symbol} · Est. arrival in 2-5 min
              </div>
            </div>
          )}

          {modalType === 'transfer' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 text-xs block mb-1">From</label>
                  <div className="p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white">
                    Main Liquidity Vault
                  </div>
                </div>
                <div>
                  <label className="text-slate-400 text-xs block mb-1">To Sub-account</label>
                  <select className="w-full rounded-lg bg-white/[0.04] border border-white/[0.1] p-2 text-xs text-white">
                    <option className="bg-[#0E1322]">Trader Allocation</option>
                    <option className="bg-[#0E1322]">Mining Staking Pool</option>
                    <option className="bg-[#0E1322]">Campaign Reserve</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 text-xs block mb-1">Transfer Amount</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full rounded-lg bg-white/[0.04] border border-white/[0.1] px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.08]">
            <button
              onClick={() => setModalType(null)}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleExecuteModalAction}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/30 transition-all"
            >
              Simulate {modalType?.toUpperCase()}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
