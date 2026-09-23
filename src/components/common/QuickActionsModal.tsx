import React from 'react';
import {
  X,
  Cpu,
  LineChart,
  Megaphone,
  Share2,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
} from 'lucide-react';
import { UserNavSection } from '../../types';

interface QuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (section: UserNavSection) => void;
}

export const QuickActionsModal: React.FC<QuickActionsModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const actions = [
    {
      id: 'mining',
      title: 'Start Mining',
      desc: 'Deploy hashrate clusters & track daily rewards',
      icon: Cpu,
      color: 'text-indigo-400 bg-indigo-500/15 border-indigo-500/30',
      section: 'mining' as UserNavSection,
    },
    {
      id: 'trader',
      title: 'Open Trader',
      desc: 'Execute algorithmic arbitrage & automated tasks',
      icon: LineChart,
      color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
      section: 'trader' as UserNavSection,
    },
    {
      id: 'campaigns',
      title: 'Join Campaign',
      desc: 'Participate in verified partner quests & bounties',
      icon: Megaphone,
      color: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
      section: 'campaigns' as UserNavSection,
    },
    {
      id: 'social-growth',
      title: 'Social Growth',
      desc: 'Boost community traction across TikTok, IG, YT & TG',
      icon: Share2,
      color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
      section: 'social-growth' as UserNavSection,
    },
    {
      id: 'wallet-deposit',
      title: 'Deposit Funds',
      desc: 'Deposit USDT, BTC, ETH or SOL via multi-chain gateway',
      icon: ArrowDownLeft,
      color: 'text-purple-400 bg-purple-500/15 border-purple-500/30',
      section: 'wallet' as UserNavSection,
    },
    {
      id: 'wallet-view',
      title: 'View Wallet',
      desc: 'Access assets ledger, transaction history & security',
      icon: Wallet,
      color: 'text-blue-400 bg-blue-500/15 border-blue-500/30',
      section: 'wallet' as UserNavSection,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.12] bg-[#0B0F19] p-6 shadow-2xl shadow-indigo-500/10 z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
              <p className="text-[11px] text-slate-400">Instant shortcuts to core protocol modules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.06] hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => {
                  onNavigate(act.section);
                  onClose();
                }}
                className="group flex flex-col text-left p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${act.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <div className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {act.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {act.desc}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 pt-3 border-t border-white/[0.06] flex justify-end">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
