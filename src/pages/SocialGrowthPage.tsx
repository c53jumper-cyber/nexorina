import React, { useState } from 'react';
import {
  Share2,
  TrendingUp,
  Users,
  Award,
  Sparkles,
  ExternalLink,
  Plus,
  CheckCircle2,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { SOCIAL_GROWTH_PREVIEW_ITEMS } from '../data/mockData';

export const SocialGrowthPage: React.FC = () => {
  const [platformFilter, setPlatformFilter] = useState<'All' | 'Instagram' | 'TikTok' | 'YouTube' | 'Telegram'>('All');
  const [campaigns, setCampaigns] = useState(SOCIAL_GROWTH_PREVIEW_ITEMS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const filteredCampaigns = campaigns.filter(
    (c) => platformFilter === 'All' || c.platform === platformFilter
  );

  const totalFollowersGenerated = campaigns.reduce((acc, c) => acc + c.currentFollowers, 0);
  const totalRewardsUsd = campaigns.reduce((acc, c) => acc + c.rewardUsd, 0);

  const handleJoinCampaign = (campaignName: string) => {
    setNotification(`Successfully connected to ${campaignName}. Tracking verification webhook.`);
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-20 right-4 z-50 rounded-xl border border-indigo-500/30 bg-[#0B0F19] p-4 text-xs text-indigo-200 shadow-2xl shadow-indigo-500/20 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#0D1322] via-[#090D18] to-[#070A11] p-6 lg:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              SOCIAL VIRAL ENGINE · DISTRIBUTED AUDIENCE PROTOCOL
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-display">
              Social Growth Engine
            </h1>
            <p className="mt-1 text-sm text-slate-400 max-w-xl">
              Scale your audience, complete community outreach directives across TikTok, Instagram,
              YouTube, and Telegram, and harvest protocol reward allocations.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setShowCreateModal(true)}
            >
              Launch Campaign
            </Button>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="accent" padding="md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Total Followers Generated</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {totalFollowersGenerated.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] font-mono text-cyan-400 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>+1,840 this week</span>
          </div>
        </Card>

        <Card variant="accent" padding="md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Active Growth Waves</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Share2 className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {campaigns.filter((c) => c.status === 'Active' || c.status === 'Hot').length}
          </div>
          <div className="mt-2 text-[11px] text-slate-400">Running across 4 platforms</div>
        </Card>

        <Card variant="accent" padding="md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Rewards Harvested</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            ${totalRewardsUsd.toFixed(2)}
          </div>
          <div className="mt-2 text-[11px] font-mono text-emerald-400 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>+18.4% monthly boost</span>
          </div>
        </Card>

        <Card variant="accent" padding="md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Average Engagement Rate</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            4.8%
          </div>
          <div className="mt-2 text-[11px] text-slate-400 font-mono">Organic verification score</div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {(['All', 'Instagram', 'TikTok', 'YouTube', 'Telegram'] as const).map((plat) => (
            <button
              key={plat}
              onClick={() => setPlatformFilter(plat)}
              className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-colors ${
                platformFilter === plat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {plat}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500 font-mono hidden sm:block">
          Showing {filteredCampaigns.length} campaigns
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCampaigns.map((c) => (
          <Card key={c.id} variant="default" padding="lg" hoverEffect={true}>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: c.accentColor }}
                  />
                  <span className="text-xs font-semibold text-slate-300 uppercase font-mono tracking-wider">
                    {c.platform}
                  </span>
                  <span className="text-slate-600">·</span>
                  <StatusBadge status={c.status} />
                </div>
                <h3 className="text-base font-bold text-white font-display">
                  {c.campaignName}
                </h3>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-mono">
                  Reward
                </span>
                <span className="text-base font-bold font-mono text-emerald-400">
                  {c.reward}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              {c.description}
            </p>

            {/* Target & Progress */}
            <div className="space-y-2 mb-4 bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Target Audience</span>
                <span className="font-mono text-slate-200 font-medium">{c.target}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Delivered</span>
                <span className="font-mono text-cyan-400 font-semibold">
                  {c.currentFollowers.toLocaleString()} followers
                </span>
              </div>
              <ProgressBar
                value={c.currentProgress}
                showPercent={true}
                size="sm"
                color="cyan"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <span className="text-[11px] font-mono text-slate-500">
                Category: {c.category}
              </span>
              <Button
                variant="primary"
                size="sm"
                icon={ArrowUpRight}
                iconPosition="right"
                onClick={() => handleJoinCampaign(c.campaignName)}
              >
                Participate
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Campaign Creation Preview Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-white/[0.12] bg-[#0B0F19] p-6 shadow-2xl z-10">
            <h3 className="text-base font-bold text-white mb-2">Deploy Social Growth Directive</h3>
            <p className="text-xs text-slate-400 mb-4">
              Create a viral amplification campaign for your Web3 channel. Reward parameters and node verification will be auto-calculated.
            </p>

            <div className="space-y-3 mb-6 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Target Platform</label>
                <select className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] p-2.5 text-slate-200">
                  <option>TikTok Viral Wave</option>
                  <option>Instagram Creator Expansion</option>
                  <option>YouTube Long-form & Shorts</option>
                  <option>Telegram Channel Boost</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Target Followers / Engagements</label>
                <input
                  type="number"
                  defaultValue={5000}
                  className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] p-2.5 text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Reward Pool Allocation ($)</label>
                <input
                  type="number"
                  defaultValue={100}
                  className="w-full rounded-xl border border-white/[0.1] bg-white/[0.03] p-2.5 text-slate-200 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setShowCreateModal(false);
                  setNotification('Campaign deployed to simulation queue.');
                }}
              >
                Submit Campaign
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
