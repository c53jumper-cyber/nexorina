import React, { useState, useRef } from 'react';
import {
  Wallet,
  Cpu,
  LineChart,
  Megaphone,
  Share2,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  Zap,
  Activity,
  CheckCircle2,
  ExternalLink,
  Shield,
  Coins,
  Sliders,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { SkeletonCard, SkeletonChart, SkeletonTable } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { QuickActionsModal } from '../components/common/QuickActionsModal';
import { AccountVerificationCard } from '../components/access/AccountVerificationCard';
import { AssessmentModal } from '../components/access/AssessmentModal';
import { DEFAULT_USER_ACCESS_SESSION } from '../shared/constants/accessLevels';
import { UserAccessState, AccessLevelId } from '../shared/types/access';
import { UserStats, ActivityItem, UserNavSection, Campaign } from '../types';
import {
  DASHBOARD_METRICS,
  ACTIVE_MODULES_DATA,
  EARNINGS_OVERVIEW_DATA,
  SOCIAL_GROWTH_PREVIEW_ITEMS,
  CAMPAIGNS_LIST,
  SUPPORTED_ASSETS,
} from '../data/mockData';

interface DashboardPageProps {
  stats: UserStats;
  activities: ActivityItem[];
  onNavigate: (section: UserNavSection) => void;
}

type PerformanceTab = 'overview' | 'earnings' | 'trading' | 'mining' | 'campaigns' | 'social';

export const DashboardPage: React.FC<DashboardPageProps> = ({
  stats,
  activities,
  onNavigate,
}) => {
  // Performance Tab state (Overview, Earnings, Trading, Mining, Campaigns, Social)
  const [activeTab, setActiveTab] = useState<PerformanceTab>('overview');

  // Chart timeframe state: 7D, 30D, 90D, 1Y
  const [chartTimeframe, setChartTimeframe] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');
  const [activeHoverPoint, setActiveHoverPoint] = useState<number | null>(null);

  // Collapsible Sections State
  const [isModulesExpanded, setIsModulesExpanded] = useState(true);
  const [isCampaignsExpanded, setIsCampaignsExpanded] = useState(true);

  // Quick Actions modal
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);

  // User Layered Access & Verification State (Client-Side Consumer of Future Auth Engine)
  const [accessState, setAccessState] = useState<UserAccessState>(DEFAULT_USER_ACCESS_SESSION.accessState);
  const [accessLevel, setAccessLevel] = useState<AccessLevelId>(DEFAULT_USER_ACCESS_SESSION.accessLevel);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);

  // UI state simulation toggle (allows testing skeleton, error, empty states)
  const [viewState, setViewState] = useState<'live' | 'skeleton' | 'empty' | 'error'>('live');

  // Carousel ref for Recommended Campaigns
  const campaignsCarouselRef = useRef<HTMLDivElement>(null);
  const modulesCarouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Chart data calculations
  const activeChart = EARNINGS_OVERVIEW_DATA[chartTimeframe];
  const chartPoints = activeChart.points;

  // Selected value extractor based on active tab
  const getTabValue = (p: typeof chartPoints[0]) => {
    switch (activeTab) {
      case 'trading':
        return p.trading;
      case 'mining':
        return p.mining;
      case 'campaigns':
        return p.campaigns;
      case 'social':
        return p.social;
      case 'overview':
      case 'earnings':
      default:
        return p.value;
    }
  };

  const currentTabValues = chartPoints.map(getTabValue);
  const maxVal = Math.max(...currentTabValues);
  const minVal = Math.min(...currentTabValues) * 0.75;

  // Recent Activities (capped strictly at max 5 items for a compact dashboard)
  const recentActivities = activities.slice(0, 5);

  // Assets for compact Market Preview (BTC, ETH, SOL, USDT, DOGE)
  const marketPreviewAssets = SUPPORTED_ASSETS.filter((a) =>
    ['BTC', 'ETH', 'SOL', 'USDT', 'DOGE'].includes(a.symbol)
  );

  // Recommended Campaigns list for horizontal carousel
  const recommendedCampaigns: Campaign[] = CAMPAIGNS_LIST.slice(0, 5);

  // Format today's date
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  // UI Simulation States
  if (viewState === 'error') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
          <span className="text-xs text-slate-400">UI State Simulator:</span>
          <Button size="xs" variant="primary" onClick={() => setViewState('live')}>
            Switch back to Live View
          </Button>
        </div>
        <ErrorState onRetry={() => setViewState('live')} />
      </div>
    );
  }

  if (viewState === 'skeleton') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
          <span className="text-xs text-slate-400">UI State Simulator: Showing Skeleton Loading State</span>
          <Button size="xs" variant="primary" onClick={() => setViewState('live')}>
            Switch back to Live View
          </Button>
        </div>
        <div className="h-28 rounded-2xl bg-white/[0.04] animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SkeletonChart />
          </div>
          <div>
            <SkeletonTable rows={4} />
          </div>
        </div>
      </div>
    );
  }

  if (viewState === 'empty') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white/[0.02] p-3 rounded-xl border border-white/[0.06]">
          <span className="text-xs text-slate-400">UI State Simulator: Showing Empty State</span>
          <Button size="xs" variant="primary" onClick={() => setViewState('live')}>
            Switch back to Live View
          </Button>
        </div>
        <EmptyState
          title="No Active Protocol Operations"
          description="Your Nexorina ecosystem has not initiated miners, trade directives, or social growth campaigns yet."
          actionText="Open Quick Actions"
          onAction={() => setIsQuickActionsOpen(true)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      <QuickActionsModal
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
        onNavigate={onNavigate}
      />

      {/* Top Protocol Status & Test State Bar (Compact) */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[11px] font-mono">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          <span className="text-slate-200 font-semibold">NEXORINA CONTROL CENTER</span>
          <span className="text-slate-600">·</span>
          <span>{todayFormatted}</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500">
          <span>View:</span>
          {(['live', 'skeleton', 'empty', 'error'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewState(mode)}
              className={`px-2 py-0.5 rounded capitalize transition-colors ${
                viewState === mode
                  ? 'bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/40'
                  : 'hover:text-slate-300'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Account Verification & Access Status Card (Compact) */}
      <AccountVerificationCard
        accessState={accessState}
        accessLevel={accessLevel}
        onOpenAssessment={() => setIsAssessmentModalOpen(true)}
        onStateChangeForDemo={(state, level) => {
          setAccessState(state);
          setAccessLevel(level);
        }}
      />

      {/* Assessment and Verification Walkthrough Modal */}
      <AssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => setIsAssessmentModalOpen(false)}
        currentState={accessState}
        currentLevel={accessLevel}
        onAssessmentCompleted={(newState, newLevel) => {
          setAccessState(newState);
          setAccessLevel(newLevel);
        }}
      />

      {/* =========================================================================
          ZONE 1: TOP AREA (Important & Immediate Information - Above the Fold)
          Total Balance (Left) + Today's Consolidated Performance (Right)
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Total Balance Card (5 Cols) */}
        <div className="lg:col-span-5 relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-[#101732] via-[#0B0F1E] to-[#070A14] p-5 shadow-xl shadow-indigo-500/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Wallet className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                  Total Balance
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-emerald-400">
                <TrendingUp className="h-3 w-3" />
                +3.42%
              </span>
            </div>

            <div className="mb-4">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight text-white">
                ${DASHBOARD_METRICS.totalBalance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                ≈ 0.1984 BTC · Consolidated Vaults
              </span>
            </div>

            {/* Compact Breakdown */}
            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono mb-4">
              <div>
                <span className="text-[10px] text-slate-400 block font-sans">Available</span>
                <span className="text-slate-200 font-bold block mt-0.5 truncate text-[11px]">
                  ${DASHBOARD_METRICS.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </span>
              </div>
              <div className="border-x border-white/[0.06] px-2">
                <span className="text-[10px] text-slate-400 block font-sans">Pending</span>
                <span className="text-amber-300 font-bold block mt-0.5 truncate text-[11px]">
                  ${DASHBOARD_METRICS.pendingBalance.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </span>
              </div>
              <div className="pl-1">
                <span className="text-[10px] text-slate-400 block font-sans">Rewards</span>
                <span className="text-emerald-400 font-bold block mt-0.5 truncate text-[11px]">
                  ${DASHBOARD_METRICS.rewardsBalance.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-1 border-t border-white/[0.06]">
            <Button
              variant="primary"
              size="xs"
              icon={ArrowDownLeft}
              onClick={() => onNavigate('wallet')}
              className="flex-1"
            >
              Deposit
            </Button>
            <Button
              variant="secondary"
              size="xs"
              icon={ArrowUpRight}
              onClick={() => onNavigate('wallet')}
              className="flex-1"
            >
              Withdraw
            </Button>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => onNavigate('wallet')}
            >
              Vault →
            </Button>
          </div>
        </div>

        {/* Today's Consolidated Performance Card (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-white/[0.08] bg-[#0B0F19] p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                    Today's Consolidated Performance
                  </h2>
                  <span className="text-[10px] text-slate-500 font-mono">
                    24-hour settlement across active operations
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400">
                  +$184.50
                </div>
                <span className="text-[10px] text-emerald-500/90 font-mono">+2.23% net yield</span>
              </div>
            </div>

            {/* 4 Compact Stat Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-2">
              <div
                onClick={() => onNavigate('mining')}
                className="cursor-pointer p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                  <span className="flex items-center gap-1">
                    <Cpu className="h-3 w-3 text-indigo-400" />
                    <span>Mining</span>
                  </span>
                  <span className="text-emerald-400">+12.4%</span>
                </div>
                <div className="text-sm font-bold font-mono text-white">$1,245.80</div>
                <span className="text-[10px] text-slate-500 font-mono">420 TH/s hashrate</span>
              </div>

              <div
                onClick={() => onNavigate('trader')}
                className="cursor-pointer p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-emerald-500/30 hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                  <span className="flex items-center gap-1">
                    <LineChart className="h-3 w-3 text-emerald-400" />
                    <span>Trader</span>
                  </span>
                  <span className="text-emerald-400">+8.2%</span>
                </div>
                <div className="text-sm font-bold font-mono text-white">$824.30</div>
                <span className="text-[10px] text-slate-500 font-mono">4/5 tasks settled</span>
              </div>

              <div
                onClick={() => onNavigate('campaigns')}
                className="cursor-pointer p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-amber-500/30 hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                  <span className="flex items-center gap-1">
                    <Megaphone className="h-3 w-3 text-amber-400" />
                    <span>Campaigns</span>
                  </span>
                  <span className="text-emerald-400">+15.7%</span>
                </div>
                <div className="text-sm font-bold font-mono text-white">$1,120.50</div>
                <span className="text-[10px] text-slate-500 font-mono">3 active nodes</span>
              </div>

              <div
                onClick={() => onNavigate('social-growth')}
                className="cursor-pointer p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-cyan-500/30 hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                  <span className="flex items-center gap-1">
                    <Share2 className="h-3 w-3 text-cyan-400" />
                    <span>Social</span>
                  </span>
                  <span className="text-emerald-400">+10.3%</span>
                </div>
                <div className="text-sm font-bold font-mono text-white">$650.20</div>
                <span className="text-[10px] text-slate-500 font-mono">12.4k audience</span>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Overall Account Health: <strong className="text-emerald-400 font-normal">Optimal (98.4%)</strong></span>
            <button
              onClick={() => setActiveTab('overview')}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Analyze Metrics →
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 10: QUICK ACTIONS ROW (Compact Row)
         ========================================================================= */}
      <div className="p-2.5 rounded-2xl border border-white/[0.08] bg-[#0A0D17]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider pl-2 font-semibold">
            Quick Actions:
          </span>

          <div className="flex flex-wrap items-center gap-2 flex-1 justify-end">
            <button
              onClick={() => onNavigate('mining')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-colors"
            >
              <Cpu className="h-3.5 w-3.5" />
              <span>Mining</span>
            </button>

            <button
              onClick={() => onNavigate('trader')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 hover:text-white transition-colors"
            >
              <LineChart className="h-3.5 w-3.5" />
              <span>Trader</span>
            </button>

            <button
              onClick={() => onNavigate('campaigns')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs font-medium text-amber-300 hover:bg-amber-500/20 hover:text-white transition-colors"
            >
              <Megaphone className="h-3.5 w-3.5" />
              <span>Campaigns</span>
            </button>

            <button
              onClick={() => onNavigate('social-growth')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20 hover:text-white transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Social Growth</span>
            </button>

            <button
              onClick={() => onNavigate('wallet')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-xs font-medium text-purple-300 hover:bg-purple-500/20 hover:text-white transition-colors"
            >
              <Wallet className="h-3.5 w-3.5" />
              <span>Wallet</span>
            </button>

            <Button
              variant="primary"
              size="xs"
              icon={Sparkles}
              onClick={() => setIsQuickActionsOpen(true)}
            >
              All Actions
            </Button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ZONE 3: ACTIVE MODULES (Horizontal Carousel / Collapsible Section)
         ========================================================================= */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F19] p-4 space-y-3">
        {/* Collapsible Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-indigo-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Active Modules (4)
            </h2>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              All Systems Operational
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsModulesExpanded(!isModulesExpanded)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
            >
              <span>{isModulesExpanded ? 'Collapse' : 'Expand'}</span>
              {isModulesExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Collapsed State: 1-line summary strip */}
        {!isModulesExpanded && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono py-1 px-2 bg-white/[0.02] rounded-xl border border-white/[0.04]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              <span className="text-slate-300">Mining:</span>
              <span className="text-white font-bold">{ACTIVE_MODULES_DATA.mining.hashrate}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Trader:</span>
              <span className="text-emerald-400 font-bold">{ACTIVE_MODULES_DATA.trader.todayResult}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="text-slate-300">Campaigns:</span>
              <span className="text-white font-bold">{ACTIVE_MODULES_DATA.campaigns.activeCampaigns} Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              <span className="text-slate-300">Social:</span>
              <span className="text-white font-bold">{ACTIVE_MODULES_DATA.socialGrowth.followersGenerated}</span>
            </div>
          </div>
        )}

        {/* Expanded State: Horizontal Carousel / Grid */}
        {isModulesExpanded && (
          <div
            ref={modulesCarouselRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 overflow-x-auto pb-1 scrollbar-none"
          >
            {/* 1. Mining Module Card */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 hover:border-indigo-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400">
                      <Cpu className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Mining</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {ACTIVE_MODULES_DATA.mining.miner}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={ACTIVE_MODULES_DATA.mining.status} />
                </div>

                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-slate-400 text-[11px]">Hashrate</span>
                  <span className="text-indigo-300 font-bold">{ACTIVE_MODULES_DATA.mining.hashrate}</span>
                </div>

                <ProgressBar
                  value={ACTIVE_MODULES_DATA.mining.progress}
                  label="Daily Cycle"
                  showPercent={true}
                  size="sm"
                  color="indigo"
                />
              </div>

              <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400">
                  {ACTIVE_MODULES_DATA.mining.rewardToday}
                </span>
                <button
                  onClick={() => onNavigate('mining')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-0.5"
                >
                  <span>Open</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* 2. Trader Module Card */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 hover:border-emerald-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                      <LineChart className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Trader</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {ACTIVE_MODULES_DATA.trader.activePair}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={ACTIVE_MODULES_DATA.trader.status} />
                </div>

                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-slate-400 text-[11px]">Today's P&L</span>
                  <span className="text-emerald-400 font-bold">{ACTIVE_MODULES_DATA.trader.todayResult}</span>
                </div>

                <ProgressBar
                  value={ACTIVE_MODULES_DATA.trader.progress}
                  label="Tasks"
                  showPercent={true}
                  size="sm"
                  color="emerald"
                />
              </div>

              <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">
                  {ACTIVE_MODULES_DATA.trader.tasks} Directives
                </span>
                <button
                  onClick={() => onNavigate('trader')}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-0.5"
                >
                  <span>Open</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* 3. Campaigns Module Card */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 hover:border-amber-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
                      <Megaphone className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Campaigns</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {ACTIVE_MODULES_DATA.campaigns.activeCampaigns} Active Nodes
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={ACTIVE_MODULES_DATA.campaigns.status} />
                </div>

                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-slate-400 text-[11px]">Claimed</span>
                  <span className="text-amber-400 font-bold">{ACTIVE_MODULES_DATA.campaigns.currentRewards}</span>
                </div>

                <ProgressBar
                  value={ACTIVE_MODULES_DATA.campaigns.progress}
                  label="Pool Allocation"
                  showPercent={true}
                  size="sm"
                  color="amber"
                />
              </div>

              <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">
                  {ACTIVE_MODULES_DATA.campaigns.completed} Completed
                </span>
                <button
                  onClick={() => onNavigate('campaigns')}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-0.5"
                >
                  <span>Open</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* 4. Social Growth Module Card */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 hover:border-cyan-500/30 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400">
                      <Share2 className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Social Growth</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {ACTIVE_MODULES_DATA.socialGrowth.activeCampaigns} Active
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={ACTIVE_MODULES_DATA.socialGrowth.status} />
                </div>

                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-slate-400 text-[11px]">Followers</span>
                  <span className="text-cyan-400 font-bold">{ACTIVE_MODULES_DATA.socialGrowth.followersGenerated}</span>
                </div>

                <ProgressBar
                  value={ACTIVE_MODULES_DATA.socialGrowth.campaignProgress}
                  label="Expansion"
                  showPercent={true}
                  size="sm"
                  color="cyan"
                />
              </div>

              <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">
                  {ACTIVE_MODULES_DATA.socialGrowth.engagementRate} Eng.
                </span>
                <button
                  onClick={() => onNavigate('social-growth')}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-0.5"
                >
                  <span>Open</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          ZONE 2: PERFORMANCE AREA (Interactive Chart with Dashboard Tabs)
         ========================================================================= */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F19] p-5 shadow-xl space-y-4">
        {/* Tabs Bar & Timeframe Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          {/* Dashboard Tabs: Overview, Earnings, Trading, Mining, Campaigns, Social */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {(
              [
                { id: 'overview', label: 'Overview' },
                { id: 'earnings', label: 'Earnings' },
                { id: 'trading', label: 'Trading' },
                { id: 'mining', label: 'Mining' },
                { id: 'campaigns', label: 'Campaigns' },
                { id: 'social', label: 'Social' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all whitespace-nowrap ${
                  activeTab === t.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Timeframe selector: 7D, 30D, 90D, 1Y */}
          <div className="flex items-center rounded-xl border border-white/[0.08] bg-white/[0.02] p-1 text-xs self-start sm:self-auto">
            {(['7D', '30D', '90D', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setChartTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors ${
                  chartTimeframe === tf
                    ? 'bg-indigo-600/40 text-indigo-200 font-bold border border-indigo-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Specific Content Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          {/* Main Chart Graphic (8 Cols) */}
          <div className="lg:col-span-8">
            <div className="flex items-baseline justify-between mb-2">
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
                  {activeTab.toUpperCase()} METRIC PROFILE
                </span>
                <div className="text-2xl font-bold font-mono text-white">
                  {activeTab === 'overview' || activeTab === 'earnings'
                    ? activeChart.totalEarnings
                    : activeTab === 'trading'
                    ? '$1,680.00'
                    : activeTab === 'mining'
                    ? '$1,245.80'
                    : activeTab === 'campaigns'
                    ? '$580.00'
                    : '$335.00'}
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                {activeChart.growthRate} this period
              </span>
            </div>

            {/* SVG Chart Graphic */}
            <div className="relative h-52 w-full">
              <svg viewBox="0 0 500 180" preserveAspectRatio="none" className="h-full w-full overflow-visible">
                <defs>
                  <linearGradient id="dashboardAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="dashboardLineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#818CF8" />
                    <stop offset="50%" stopColor="#6366F1" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
                {[30, 75, 120, 165].map((y, idx) => (
                  <line
                    key={idx}
                    x1="0"
                    y1={y}
                    x2="500"
                    y2={y}
                    stroke="rgba(255,255,255,0.05)"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Area & Line */}
                {(() => {
                  const step = 500 / (chartPoints.length - 1);
                  const coords = chartPoints.map((p, i) => {
                    const val = getTabValue(p);
                    const x = i * step;
                    const y = 160 - ((val - minVal) / (maxVal - minVal || 1)) * 130;
                    return { x, y, val, label: p.label };
                  });

                  const linePath = coords.reduce((acc, curr, idx, arr) => {
                    if (idx === 0) return `M ${curr.x} ${curr.y}`;
                    const prev = arr[idx - 1];
                    const cx1 = prev.x + (curr.x - prev.x) / 2;
                    const cy1 = prev.y;
                    const cx2 = prev.x + (curr.x - prev.x) / 2;
                    const cy2 = curr.y;
                    return `${acc} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${curr.x} ${curr.y}`;
                  }, '');

                  const areaPath = `${linePath} L 500 175 L 0 175 Z`;

                  return (
                    <>
                      <path d={areaPath} fill="url(#dashboardAreaGrad)" />
                      <path d={linePath} fill="none" stroke="url(#dashboardLineGrad)" strokeWidth="2.5" />

                      {coords.map((c, i) => (
                        <circle
                          key={i}
                          cx={c.x}
                          cy={c.y}
                          r={activeHoverPoint === i ? 6 : 3.5}
                          fill={activeHoverPoint === i ? '#06B6D4' : '#6366F1'}
                          stroke="#FFFFFF"
                          strokeWidth="2"
                          className="cursor-pointer transition-all"
                          onMouseEnter={() => setActiveHoverPoint(i)}
                          onMouseLeave={() => setActiveHoverPoint(null)}
                        />
                      ))}
                    </>
                  );
                })()}
              </svg>

              {/* Hover tooltip */}
              {activeHoverPoint !== null && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 rounded-xl border border-indigo-500/40 bg-[#070A14]/90 px-3 py-1 text-xs text-white backdrop-blur shadow-lg font-mono pointer-events-none">
                  <span>{chartPoints[activeHoverPoint].label}: </span>
                  <span className="font-bold text-cyan-300">
                    ${getTabValue(chartPoints[activeHoverPoint]).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between pt-2 border-t border-white/[0.06] text-[11px] font-mono text-slate-500">
              {chartPoints.map((p, idx) => (
                <span key={idx}>{p.label}</span>
              ))}
            </div>
          </div>

          {/* Tab Contextual Insights (4 Cols) */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Selected Channel</span>
              <span className="text-indigo-300 font-bold capitalize">{activeTab}</span>
            </div>

            {activeTab === 'overview' && (
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Total Yield:</span>
                  <span className="text-emerald-400 font-semibold">{activeChart.totalEarnings}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Primary Channel:</span>
                  <span className="text-white font-semibold">Trader (45%)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Daily Average:</span>
                  <span className="text-cyan-300 font-semibold">$128.10 / day</span>
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Total Bounties:</span>
                  <span className="text-emerald-400 font-semibold">+14.2% MoM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Settled Batches:</span>
                  <span className="text-white font-semibold">32 Cycles</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Next Payout:</span>
                  <span className="text-amber-300 font-semibold">00:00 UTC</span>
                </div>
              </div>
            )}

            {activeTab === 'trading' && (
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Win Rate:</span>
                  <span className="text-emerald-400 font-semibold">73.4%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Active Bots:</span>
                  <span className="text-white font-semibold">Balanced AI (Running)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Signals Mode:</span>
                  <span className="text-cyan-300 font-semibold">4 High Confidence</span>
                </div>
              </div>
            )}

            {activeTab === 'mining' && (
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Current Hashrate:</span>
                  <span className="text-indigo-400 font-semibold">420 TH/s</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Pool Efficiency:</span>
                  <span className="text-emerald-400 font-semibold">98.6%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Estimated 24h:</span>
                  <span className="text-white font-semibold">0.00045 BTC</span>
                </div>
              </div>
            )}

            {activeTab === 'campaigns' && (
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Active Bounties:</span>
                  <span className="text-amber-400 font-semibold">3 Campaigns</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Total Completed:</span>
                  <span className="text-white font-semibold">12 Campaigns</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Rewards in Escrow:</span>
                  <span className="text-emerald-400 font-semibold">$124.50</span>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Total Audience:</span>
                  <span className="text-cyan-400 font-semibold">12,450 Followers</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/[0.04]">
                  <span className="text-slate-400">Active Tasks:</span>
                  <span className="text-white font-semibold">2 Campaigns</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Engagement Rate:</span>
                  <span className="text-emerald-400 font-semibold">+4.8%</span>
                </div>
              </div>
            )}

            <Button
              variant="outline"
              size="xs"
              fullWidth={true}
              onClick={() => {
                if (activeTab === 'overview' || activeTab === 'earnings') onNavigate('rewards');
                else onNavigate(activeTab as UserNavSection);
              }}
              className="mt-2"
            >
              Open Complete {activeTab.toUpperCase()} Module →
            </Button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3-COLUMN COMPACT CONTROL CENTER GRID
          Col 1: Recent Activity (Max 5 items)
          Col 2: Market Preview (Compact 5 assets)
          Col 3: Social Growth Engine (Preview Card)
         ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Column 1: Recent Activity (5 Cols on lg, max 5 items) */}
        <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#0B0F19] p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-indigo-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-display">
                  Recent Activity (5)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Live feed</span>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {recentActivities.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2 hover:bg-white/[0.02] px-1 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08]">
                      {item.type === 'mining' && <Cpu className="h-3.5 w-3.5 text-indigo-400" />}
                      {item.type === 'trading' && <LineChart className="h-3.5 w-3.5 text-emerald-400" />}
                      {item.type === 'campaign' && <Megaphone className="h-3.5 w-3.5 text-amber-400" />}
                      {item.type === 'wallet' && <Wallet className="h-3.5 w-3.5 text-blue-400" />}
                      {item.type === 'casino' && <Coins className="h-3.5 w-3.5 text-purple-400" />}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white leading-tight truncate max-w-[170px] sm:max-w-[210px]">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-400 leading-snug truncate max-w-[170px] sm:max-w-[210px]">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-bold font-mono text-emerald-400">
                      {item.amount}
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono block">
                      {item.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-white/[0.06] text-right">
            <button
              onClick={() => onNavigate('transactions')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium font-mono inline-flex items-center gap-1"
            >
              <span>View All Activity</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Column 2: Market Preview (4 Cols on lg, 5 assets) */}
        <div className="lg:col-span-4 rounded-2xl border border-white/[0.08] bg-[#0B0F19] p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <LineChart className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-display">
                  Market Preview (5)
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Live Prices</span>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {marketPreviewAssets.map((asset) => (
                <div
                  key={asset.symbol}
                  className="flex items-center justify-between py-1.5 hover:bg-white/[0.02] px-1 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded font-mono text-[10px] font-bold text-white"
                      style={{ backgroundColor: `${asset.iconColor}25`, border: `1px solid ${asset.iconColor}50` }}
                    >
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1">
                        <span>{asset.symbol}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        ${asset.priceUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-12 overflow-visible hidden sm:block" viewBox="0 0 50 20">
                      <path
                        d={
                          asset.change24h >= 0
                            ? 'M 0 16 Q 12 8, 25 12 T 50 4'
                            : 'M 0 4 Q 12 12, 25 8 T 50 16'
                        }
                        fill="none"
                        stroke={asset.change24h >= 0 ? '#34D399' : '#F43F5E'}
                        strokeWidth="1.5"
                      />
                    </svg>
                    <span
                      className={`font-mono text-xs font-semibold text-right ${
                        asset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {asset.change24h >= 0 ? `+${asset.change24h}%` : `${asset.change24h}%`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-white/[0.06] text-right">
            <button
              onClick={() => onNavigate('wallet')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium font-mono inline-flex items-center gap-1"
            >
              <span>View Market</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Column 3: Social Growth Engine (Preview Card) (3 Cols on lg) */}
        <div className="lg:col-span-3 rounded-2xl border border-white/[0.08] bg-[#0B0F19] p-4 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-cyan-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white font-display">
                  Social Engine
                </h3>
              </div>
              <StatusBadge status="Active" />
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-3">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Generated Audience</span>
              <div className="text-2xl font-extrabold font-mono text-white mt-0.5">
                12,450
              </div>
              <span className="text-[10px] text-cyan-400 font-mono">
                2 Active Campaigns · 68% Progress
              </span>
            </div>

            {/* Channels badges */}
            <div className="space-y-1.5 mb-3 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Active Targets:</span>
                <span className="text-slate-200">Instagram, TikTok, YT</span>
              </div>
              <ProgressBar
                value={68}
                label="Campaign Expansion"
                showPercent={true}
                size="sm"
                color="cyan"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-white/[0.06]">
            <Button
              variant="outline"
              size="xs"
              fullWidth={true}
              onClick={() => onNavigate('social-growth')}
              className="border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
            >
              View Social Growth →
            </Button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ZONE 5: RECOMMENDED CAMPAIGNS (Horizontal Carousel / Compact)
         ========================================================================= */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F19] p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-amber-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-display">
              Recommended Campaigns (Carousel)
            </h3>
            <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
              Verified Web3 bounties
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Carousel navigation controls */}
            <button
              onClick={() => scrollCarousel(campaignsCarouselRef, 'left')}
              className="p-1 rounded-lg border border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/[0.06]"
              title="Previous Campaigns"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollCarousel(campaignsCarouselRef, 'right')}
              className="p-1 rounded-lg border border-white/[0.08] bg-white/[0.02] text-slate-400 hover:text-white hover:bg-white/[0.06]"
              title="Next Campaigns"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <button
              onClick={() => onNavigate('campaigns')}
              className="text-xs text-amber-400 hover:text-amber-300 font-mono font-medium ml-1"
            >
              Explore All →
            </button>
          </div>
        </div>

        {/* Horizontal Track Carousel with Snap */}
        <div
          ref={campaignsCarouselRef}
          className="flex items-stretch gap-3.5 overflow-x-auto pb-2 pt-1 scroll-smooth snap-x scrollbar-none"
        >
          {recommendedCampaigns.map((camp) => (
            <div
              key={camp.id}
              className="w-72 sm:w-80 shrink-0 snap-start rounded-xl border border-white/[0.08] bg-white/[0.02] p-3.5 hover:border-amber-500/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-[10px] font-mono text-amber-400 block uppercase">
                      {camp.partner}
                    </span>
                    <h4 className="text-xs font-bold text-white font-display mt-0.5 truncate max-w-[190px]">
                      {camp.name}
                    </h4>
                  </div>
                  <StatusBadge status={camp.status} />
                </div>

                <p className="text-[11px] text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                  {camp.description}
                </p>

                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] space-y-1.5 mb-3">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Reward</span>
                    <span className="text-emerald-400 font-bold">{camp.rewardPerUser}</span>
                  </div>
                  <ProgressBar
                    value={(camp.currentUsers / camp.targetUsers) * 100}
                    label="Capacity"
                    showPercent={true}
                    size="sm"
                    color="amber"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">
                  {camp.remainingCapacity} slots left
                </span>
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => onNavigate('campaigns')}
                >
                  Join
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
