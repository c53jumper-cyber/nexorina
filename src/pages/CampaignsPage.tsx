import React, { useState } from 'react';
import {
  Megaphone,
  Users,
  Gift,
  Calendar,
  CheckCircle,
  Copy,
  ExternalLink,
  Lock,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { Campaign } from '../types';
import { Modal } from '../components/common/Modal';

interface CampaignsPageProps {
  campaigns: Campaign[];
}

export const CampaignsPage: React.FC<CampaignsPageProps> = ({ campaigns }) => {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Full' | 'Completed'>('All');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const filteredCampaigns =
    filter === 'All'
      ? campaigns
      : campaigns.filter((c) => c.status.toLowerCase() === filter.toLowerCase());

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(
      `https://nexorina.net/ref/alex_cyber?campaign=${selectedCampaign?.id}`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#180F28] via-[#0E1222] to-[#0A0D17] p-6 lg:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
              <Megaphone className="h-3.5 w-3.5" />
              <span>AFFILIATE PROTOCOL & PARTNER INCENTIVES</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-display">
              User Acquisition Campaigns
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Partner with verified Web3 protocols. Refer new ecosystem participants to fulfill
              allocated capacity caps and claim guaranteed reward pool allocations.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-white/[0.03] border border-white/[0.08] px-4 py-2.5 rounded-xl">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Capacity Automated Rotation: Enabled</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl">
          {(['All', 'Active', 'Full', 'Completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                filter === tab
                  ? 'bg-purple-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-400">
          Showing {filteredCampaigns.length} Campaigns
        </span>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCampaigns.map((camp) => {
          const percentFilled = Math.min(
            100,
            Math.round((camp.currentUsers / camp.targetUsers) * 100)
          );
          const isFull = camp.status === 'Full';
          const isCompleted = camp.status === 'Completed';

          return (
            <div
              key={camp.id}
              className="rounded-2xl border border-white/[0.08] bg-[#0A0E1A] p-6 hover:border-purple-500/40 hover:bg-[#0D1222] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Partner and Status */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider block">
                      Partner: {camp.partner}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">{camp.name}</h3>
                  </div>

                  <span
                    className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${
                      camp.status === 'Active'
                        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                        : camp.status === 'Full'
                        ? 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                        : 'border-slate-500/40 bg-slate-500/10 text-slate-400'
                    }`}
                  >
                    {camp.status}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-400 line-clamp-2">{camp.description}</p>

                {/* Capacity Progress Bar */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Capacity Filled</span>
                    <span className="text-white font-semibold">
                      {camp.currentUsers.toLocaleString()} / {camp.targetUsers.toLocaleString()} Users{' '}
                      <span className="text-purple-400">({percentFilled}%)</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isFull
                          ? 'bg-amber-400'
                          : isCompleted
                          ? 'bg-slate-400'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-400'
                      }`}
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-500 pt-0.5">
                    <span>Remaining Slots: {camp.remainingCapacity.toLocaleString()}</span>
                    <span>Category: {camp.category}</span>
                  </div>
                </div>

                {/* Reward Pool & Per User Metrics */}
                <div className="mt-5 grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs font-mono">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Total Reward Pool</span>
                    <span className="text-white font-bold text-sm">{camp.rewardPool}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Reward Per User</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      {camp.rewardPerUser}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Schedule & Action */}
              <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  <span>
                    {camp.startDate} → {camp.endDate}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedCampaign(camp)}
                  disabled={isCompleted}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    camp.status === 'Active'
                      ? 'bg-purple-600 text-white hover:bg-purple-500 shadow-sm shadow-purple-600/30'
                      : isFull
                      ? 'bg-amber-600/20 text-amber-300 border border-amber-500/30'
                      : 'bg-white/[0.05] text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {camp.status === 'Active' && (
                    <>
                      Join & Refer <ArrowRight className="h-3 w-3" />
                    </>
                  )}
                  {isFull && (
                    <>
                      <Lock className="h-3 w-3" /> Capacity Full
                    </>
                  )}
                  {isCompleted && 'Ended'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Campaign Participation / Referral Modal */}
      {selectedCampaign && (
        <Modal
          isOpen={!!selectedCampaign}
          onClose={() => setSelectedCampaign(null)}
          title={`Participate in ${selectedCampaign.name}`}
          subtitle={`Partner: ${selectedCampaign.partner} · Reward: ${selectedCampaign.rewardPerUser}`}
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-300 leading-relaxed">{selectedCampaign.description}</p>

            <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 space-y-2">
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Available Slots</span>
                <span className="text-white font-bold">
                  {selectedCampaign.remainingCapacity} of {selectedCampaign.targetUsers}
                </span>
              </div>
              <div className="flex justify-between font-mono">
                <span className="text-slate-400">Bounty Distribution</span>
                <span className="text-emerald-400 font-bold">
                  {selectedCampaign.rewardPerUser} upon qualification
                </span>
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-xs block mb-1.5">
                Your Exclusive Campaign Referral Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://nexorina.net/ref/alex_cyber?campaign=${selectedCampaign.id}`}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-lg px-3 py-2 text-xs font-mono text-slate-200 select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copiedLink ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex justify-end">
              <button
                onClick={() => setSelectedCampaign(null)}
                className="px-4 py-2 rounded-lg bg-white/[0.06] text-slate-300 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
