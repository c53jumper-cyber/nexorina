import React, { useState } from 'react';
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  Play,
  Pause,
  Square,
  Gift,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Shield,
  ShieldAlert,
  Activity,
  Layers,
  Cpu,
  Sparkles,
  Sliders,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';

// Modular Trader Components
import { RiskBadge } from '../components/trader/RiskBadge';
import { ProfitLossBadge } from '../components/trader/ProfitLossBadge';
import { BotStatusBadge } from '../components/trader/BotStatusBadge';
import { TradingCard } from '../components/trader/TradingCard';
import { SignalCard } from '../components/trader/SignalCard';
import { BotCard } from '../components/trader/BotCard';
import { PerformanceCard } from '../components/trader/PerformanceCard';
import { PositionCard } from '../components/trader/PositionCard';
import { AssetCard } from '../components/trader/AssetCard';
import { TaskCard } from '../components/trader/TaskCard';
import { TradeTable } from '../components/trader/TradeTable';
import { TradingChart } from '../components/trader/TradingChart';
import { RiskCard } from '../components/trader/RiskCard';
import { RiskNoticeModal } from '../components/trader/RiskNoticeModal';
import { BotConfigModal } from '../components/trader/BotConfigModal';
import { ProfitModelModal } from '../components/trader/ProfitModelModal';
import { SignalModal } from '../components/trader/SignalModal';

// Mock Data & Types
import {
  TRADER_BALANCES,
  TODAY_PERFORMANCE,
  DAILY_TASKS_DATA,
  AI_SIGNALS_DATA,
  AI_TRADING_RECOMMENDATIONS,
  AI_BOTS_MARKETPLACE,
  BOT_TRADE_ACTIVITY_DATA,
  ACTIVE_POSITIONS_DATA,
  PORTFOLIO_ASSETS_DATA,
  TRADE_HISTORY_DATA,
  AI_ACTIVITY_TIMELINE_DATA,
  RISK_MANAGEMENT_DATA,
  EnhancedTraderTask,
} from '../data/mockTraderData';
import {
  TraderNavTab,
  AISignal,
  AITradingRecommendation,
  AIBot,
  BotConfiguration,
  TraderPosition,
} from '../types/trader';

interface TraderPageProps {
  tasks?: any[];
  tradingBalance?: number;
}

export const TraderPage: React.FC<TraderPageProps> = () => {
  // Navigation Sub-tab
  const [activeTab, setActiveTab] = useState<TraderNavTab>('overview');

  // Interactive State
  const [balances, setBalances] = useState(TRADER_BALANCES);
  const [todayPerf, setTodayPerf] = useState(TODAY_PERFORMANCE);
  const [dailyTasks, setDailyTasks] = useState<EnhancedTraderTask[]>(DAILY_TASKS_DATA);
  const [signals, setSignals] = useState<AISignal[]>(AI_SIGNALS_DATA);
  const [bots, setBots] = useState<AIBot[]>(AI_BOTS_MARKETPLACE);
  const [positions, setPositions] = useState<TraderPosition[]>(ACTIVE_POSITIONS_DATA);
  const [historyTrades, setHistoryTrades] = useState(TRADE_HISTORY_DATA);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals State
  const [selectedSignal, setSelectedSignal] = useState<AISignal | null>(null);
  const [isSignalModalOpen, setIsSignalModalOpen] = useState(false);

  const [selectedRecommendation, setSelectedRecommendation] = useState<AITradingRecommendation | null>(null);
  const [isProfitModelOpen, setIsProfitModelOpen] = useState(false);

  const [configuringBot, setConfiguringBot] = useState<AIBot | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  const [riskNoticeBot, setRiskNoticeBot] = useState<AIBot | null>(null);
  const [isRiskNoticeOpen, setIsRiskNoticeOpen] = useState(false);
  const [pendingDeployConfig, setPendingDeployConfig] = useState<{ botId: string; config: BotConfiguration } | null>(null);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Task Actions
  const handleTaskAction = (taskId: string) => {
    setDailyTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          if (t.status === 'Ready to Claim') {
            setBalances((b) => ({
              ...b,
              total: b.total + t.expectedRewardUsd,
              available: b.available + t.expectedRewardUsd,
            }));
            setTodayPerf((p) => ({
              ...p,
              profitUsd: p.profitUsd + t.expectedRewardUsd,
              pnlUsd: p.pnlUsd + t.expectedRewardUsd,
              completedTasks: Math.min(p.totalTasks, p.completedTasks + 1),
            }));
            showToast(`Claimed ${t.expectedReward}! Added to available trading balance.`);
            return { ...t, status: 'Completed', progress: 100, timeRemaining: 'Settled' };
          } else if (t.status === 'Available') {
            showToast(`Started ${t.taskName}. Task is now actively tracking orderbook routes.`);
            return { ...t, status: 'In Progress', progress: 20, timeRemaining: '1h 30m remaining' };
          } else if (t.status === 'In Progress') {
            showToast(`Accelerated ${t.taskName}. Gas priority increased.`);
            return { ...t, progress: Math.min(100, t.progress + 35) };
          }
        }
        return t;
      })
    );
  };

  // Signal Actions
  const handleViewSignal = (signal: AISignal) => {
    setSelectedSignal(signal);
    setIsSignalModalOpen(true);
  };

  const handleSimulateSignal = (signal: AISignal) => {
    showToast(`Simulated ${signal.direction} position on ${signal.pair} at ${signal.entryZone}`);
    setActiveTab('overview');
  };

  // Bot Marketplace & Config flow
  const handleOpenBotConfig = (bot: AIBot) => {
    setConfiguringBot(bot);
    setIsConfigModalOpen(true);
  };

  const handleSaveAndDeployBot = (botId: string, config: BotConfiguration) => {
    setIsConfigModalOpen(false);
    const targetBot = bots.find((b) => b.id === botId);
    if (!targetBot) return;

    // Trigger mandatory risk disclosure modal
    setRiskNoticeBot(targetBot);
    setPendingDeployConfig({ botId, config });
    setIsRiskNoticeOpen(true);
  };

  const handleConfirmRiskAndDeploy = () => {
    if (!pendingDeployConfig) return;
    const { botId, config } = pendingDeployConfig;

    setBots((prev) =>
      prev.map((b) => {
        if (b.id === botId) {
          return {
            ...b,
            status: 'Active',
            activeConfig: config,
            liveStats: b.liveStats || {
              investment: config.investmentAmount,
              currentValue: config.investmentAmount,
              unrealizedPnl: 0,
              unrealizedPnlPercent: 0,
              realizedPnl: 0,
              realizedPnlPercent: 0,
              winRate: 80,
              totalTrades: 1,
              profitableTrades: 1,
              profitFactor: 2.8,
              maxDrawdown: 1.2,
              uptimeHours: 1,
            },
          };
        }
        return b;
      })
    );

    showToast(`Bot ${riskNoticeBot?.name} successfully deployed with $${config.investmentAmount} simulated capital!`);
    setPendingDeployConfig(null);
    setRiskNoticeBot(null);
  };

  // Bot Status Toggle (Active <-> Paused <-> Stopped)
  const handleToggleBotStatus = (botId: string, nextStatus: 'Active' | 'Paused' | 'Stopped') => {
    setBots((prev) =>
      prev.map((b) => {
        if (b.id === botId) {
          return { ...b, status: nextStatus };
        }
        return b;
      })
    );
    showToast(`Bot status updated to ${nextStatus}.`);
  };

  // Position Actions
  const handleClosePosition = (positionId: string) => {
    const target = positions.find((p) => p.id === positionId);
    if (!target) return;

    setPositions((prev) => prev.filter((p) => p.id !== positionId));
    setBalances((b) => ({
      ...b,
      available: b.available + target.marginUsd + target.pnlUsd,
      locked: Math.max(0, b.locked - target.marginUsd),
    }));

    showToast(
      `Closed ${target.side} ${target.pair} position with ${
        target.pnlUsd >= 0 ? '+' : ''
      }$${target.pnlUsd.toFixed(2)} realized P&L.`
    );
  };

  const activeBotInstance = bots.find((b) => b.status === 'Active') || bots[1];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 rounded-2xl border border-indigo-500/40 bg-[#0C1024]/95 px-4 py-3 text-xs text-white shadow-2xl shadow-indigo-500/20 backdrop-blur-md animate-in slide-in-from-top-4 duration-200">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="font-mono">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner & Safety Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
              Nexorina Algorithmic Execution Engine
            </span>
            <span className="text-slate-600">·</span>
            <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-mono text-indigo-300">
              Simulation Mode Active
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-display tracking-tight">
            Trader & AI Bot Engine
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Multi-strategy automated quantitative platform. Configure algorithmic bots, execute AI
            signals, capture daily liquidity spreads, and monitor real-time portfolio risk.
          </p>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            icon={Sliders}
            onClick={() => setActiveTab('bots')}
          >
            Deploy Bot
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Sparkles}
            onClick={() => setActiveTab('signals')}
          >
            AI Signals ({signals.filter((s) => s.status === 'Active').length})
          </Button>
        </div>
      </div>

      {/* Section 15: Clear Differentiation in UI between AI Bot vs AI Signals vs AI Trading */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white/[0.015] border border-white/[0.06]">
        <div
          onClick={() => setActiveTab('signals')}
          className={`cursor-pointer p-3 rounded-xl transition-all border ${
            activeTab === 'signals'
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-transparent hover:bg-white/[0.02]'
          }`}
        >
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-semibold mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>1. AI Signals</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Real-time algorithmic trigger alerts with predefined entry zones, multiple take-profit
            targets, and tight stop-loss invalidations.
          </p>
        </div>

        <div
          onClick={() => setActiveTab('ai-trading')}
          className={`cursor-pointer p-3 rounded-xl transition-all border ${
            activeTab === 'ai-trading'
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-transparent hover:bg-white/[0.02]'
          }`}
        >
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold mb-1">
            <Layers className="h-3.5 w-3.5" />
            <span>2. AI Trading</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Multi-stage macroeconomic scenarios, institutional absorption models, and performance
            fee sharing with high-watermark protection.
          </p>
        </div>

        <div
          onClick={() => setActiveTab('bots')}
          className={`cursor-pointer p-3 rounded-xl transition-all border ${
            activeTab === 'bots'
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-transparent hover:bg-white/[0.02]'
          }`}
        >
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold mb-1">
            <Cpu className="h-3.5 w-3.5" />
            <span>3. AI Trading Bot</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            Autonomous execution bots running 24/7 grid, momentum, and cross-market arbitrage with
            customizable drawdown circuit breakers.
          </p>
        </div>
      </div>

      {/* Internal Navigation Sub-tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-white/[0.08] pb-2 scrollbar-none">
        {(
          [
            { id: 'overview', label: 'Overview' },
            { id: 'tasks', label: 'Daily Tasks' },
            { id: 'signals', label: 'AI Signals' },
            { id: 'ai-trading', label: 'AI Trading' },
            { id: 'bots', label: 'AI Trading Bot' },
            { id: 'portfolio', label: 'Portfolio' },
            { id: 'history', label: 'History' },
            { id: 'risk', label: 'Risk Guard' },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.id === 'tasks' && (
              <span className="h-4 w-4 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono flex items-center justify-center">
                {dailyTasks.filter((t) => t.status === 'Ready to Claim').length || dailyTasks.length}
              </span>
            )}
            {tab.id === 'signals' && (
              <span className="h-4 w-4 rounded-full bg-indigo-500/30 text-indigo-300 text-[10px] font-mono flex items-center justify-center">
                {signals.filter((s) => s.status === 'Active').length}
              </span>
            )}
            {tab.id === 'bots' && (
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* =========================================================
          TAB 1: TRADER OVERVIEW
         ========================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top Row: Trading Balance Card & Today's Performance Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Balance Overview (5 Cols) */}
            <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#0B0F19] p-5 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/20">
                      <Coins className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
                        Trading Balance
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block">
                        Multi-asset collateral pool
                      </span>
                    </div>
                  </div>

                  <span className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-mono text-emerald-400 font-medium">
                    +2.23% Today
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-3xl font-extrabold font-mono text-white">
                    ${balances.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    Total Account Equity (USD Equivalent)
                  </span>
                </div>

                {/* Available vs Locked Breakdown */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Available Margin</span>
                    <span className="text-white font-bold block mt-0.5 text-sm">
                      ${balances.available.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-emerald-400">Ready for bots & orders</span>
                  </div>

                  <div className="border-l border-white/[0.06] pl-3">
                    <span className="text-[10px] text-slate-400 block font-sans">Locked / In Use</span>
                    <span className="text-amber-400 font-bold block mt-0.5 text-sm">
                      ${balances.locked.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-500">Active bot orders & margin</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Footer */}
              <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2 mt-4">
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => setActiveTab('portfolio')}
                >
                  View Assets
                </Button>
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => {
                    setBalances((b) => ({
                      ...b,
                      total: b.total + 500,
                      available: b.available + 500,
                    }));
                    showToast('Allocated +$500.00 simulated demo liquidity.');
                  }}
                >
                  + Add Demo Margin
                </Button>
              </div>
            </div>

            {/* Today's Performance Card (7 Cols) */}
            <div className="lg:col-span-7">
              <PerformanceCard performance={todayPerf} />
            </div>
          </div>

          {/* Active Positions Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-indigo-400" />
                <h2 className="text-base font-bold text-white font-display">
                  Live Simulated Positions ({positions.length})
                </h2>
              </div>
              <button
                onClick={() => setActiveTab('risk')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium font-mono"
              >
                Risk Analysis →
              </button>
            </div>

            {positions.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-white/[0.06] bg-white/[0.01]">
                <p className="text-sm text-slate-400">No active positions open.</p>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-3"
                  onClick={() => setActiveTab('signals')}
                >
                  Explore AI Signals
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {positions.map((pos) => (
                  <PositionCard
                    key={pos.id}
                    position={pos}
                    onClosePosition={handleClosePosition}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Dual Column: Top AI Signals Preview + Active Bot Status Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Top Signals */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white font-display">
                    High Confidence AI Signals
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('signals')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-mono"
                >
                  View All ({signals.length}) →
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {signals.slice(0, 2).map((sig) => (
                  <SignalCard
                    key={sig.id}
                    signal={sig}
                    onViewSignal={handleViewSignal}
                    onApplySignal={handleSimulateSignal}
                  />
                ))}
              </div>
            </div>

            {/* Active Bot Preview & Chart */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white font-display">
                    Active Bot Engine: {activeBotInstance.name}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('bots')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-mono"
                >
                  Bot Dashboard →
                </button>
              </div>

              <TradingChart title="Bot Execution Value & Simulation Curve" />
            </div>
          </div>

          {/* Recent Trades Snippet */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-display">
                Recent Algorithmic Executions
              </h3>
              <button
                onClick={() => setActiveTab('history')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-mono"
              >
                Full Trade Log →
              </button>
            </div>
            <TradeTable trades={historyTrades.slice(0, 4)} compact={true} />
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 2: DAILY TRADING TASKS
         ========================================================= */}
      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-indigo-500/[0.04] border border-indigo-500/20">
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Daily Algorithmic Spread & Liquidity Tasks
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete automated routing cycles to capture arbitrage spreads and earn protocol rewards.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Total Bounties Available:</span>
              <span className="text-emerald-400 font-bold">
                $
                {dailyTasks
                  .reduce((acc, curr) => acc + curr.expectedRewardUsd, 0)
                  .toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dailyTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onAction={handleTaskAction}
              />
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 3: AI SIGNALS
         ========================================================= */}
      {activeTab === 'signals' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-cyan-500/[0.04] border border-cyan-500/20">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <h2 className="text-base font-bold text-white font-display">
                  Nexorina AI Predictive Signals
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-indicator triggers derived from order-flow imbalances, volatility clusters, and on-chain liquidity depth.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Model Accuracy Rate:</span>
              <span className="text-white font-bold">78.4% (Simulated)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {signals.map((sig) => (
              <SignalCard
                key={sig.id}
                signal={sig}
                onViewSignal={handleViewSignal}
                onApplySignal={handleSimulateSignal}
              />
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 4: AI TRADING & SCENARIOS
         ========================================================= */}
      {activeTab === 'ai-trading' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900/20 via-purple-900/10 to-transparent border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-1.5">
              <Layers className="h-4 w-4 text-indigo-400" />
              <h2 className="text-base font-bold text-white font-display">
                Nexorina AI-Powered Trading Suggestions & Scenarios
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              Algorithmic proposals structured with multi-stage execution paths. Nexorina uses a
              high-watermark performance model: our platform only claims a 15% share on verified net
              gains, ensuring zero platform fees on drawdowns.
            </p>
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {AI_TRADING_RECOMMENDATIONS.map((rec) => {
              const isLong = rec.direction === 'LONG';

              return (
                <Card
                  key={rec.id}
                  variant="default"
                  padding="lg"
                  hoverEffect={true}
                  className="relative flex flex-col justify-between border-white/[0.08] hover:border-indigo-500/30"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block">
                          {rec.marketRegime}
                        </span>
                        <h3 className="text-base font-bold text-white font-display mt-0.5">
                          {rec.title}
                        </h3>
                      </div>
                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          isLong
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {rec.direction}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-mono font-semibold text-slate-200">
                        {rec.pair}
                      </span>
                      <RiskBadge level={rec.risk} size="sm" />
                      <span className="text-[11px] font-mono text-cyan-400 ml-auto">
                        {rec.modelConfidence}% Confidence
                      </span>
                    </div>

                    {/* Parameters Box */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-3 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Entry</span>
                        <span className="text-white font-semibold mt-0.5 block">{rec.entry}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-emerald-400 block font-sans">Target</span>
                        <span className="text-emerald-400 font-semibold mt-0.5 block">{rec.target}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-rose-400 block font-sans">Stop</span>
                        <span className="text-rose-400 font-semibold mt-0.5 block">{rec.stopLoss}</span>
                      </div>
                    </div>

                    {/* Scenario Description */}
                    <div className="p-3 rounded-xl bg-white/[0.015] border border-white/[0.04] mb-4 text-xs text-slate-300 leading-relaxed">
                      <span className="text-[10px] text-indigo-400 font-mono uppercase block mb-1">
                        Expected Scenario
                      </span>
                      {rec.expectedScenario}
                    </div>
                  </div>

                  {/* Performance Sharing Footer */}
                  <div className="pt-3 border-t border-white/[0.06] space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Projected Gain:</span>
                      <span className="text-emerald-400 font-bold">
                        +{rec.expectedProfitPercent}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <Button
                        variant="secondary"
                        size="xs"
                        icon={DollarSign}
                        onClick={() => {
                          setSelectedRecommendation(rec);
                          setIsProfitModelOpen(true);
                        }}
                        className="w-full"
                      >
                        Profit Model UI
                      </Button>
                      <Button
                        variant="primary"
                        size="xs"
                        onClick={() => {
                          showToast(`Simulated scenario for ${rec.pair} activated.`);
                          setActiveTab('overview');
                        }}
                        className="w-full"
                      >
                        Execute
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 5: AI TRADING BOT (INDEPENDENT SECTION)
         ========================================================= */}
      {activeTab === 'bots' && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/20 via-indigo-950/20 to-transparent border border-emerald-500/20">
            <div>
              <div className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-bold text-white font-display">
                  AI Trading Bot Marketplace & Engine
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Autonomous algorithmic strategies configured to execute without manual intervention.
                Select an algorithm, adjust drawdown triggers, and review live simulation activity.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-mono text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Profit is not guaranteed</span>
              </span>
            </div>
          </div>

          {/* Active Bot Live Dashboard (Section 11) */}
          {activeBotInstance.liveStats && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F19] p-5 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white font-display">
                        {activeBotInstance.name} — Live Dashboard
                      </h3>
                      <BotStatusBadge status={activeBotInstance.status} />
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      Pair: {activeBotInstance.activeConfig?.tradingPair || activeBotInstance.tradingPair} ·
                      Uptime: {activeBotInstance.liveStats.uptimeHours} Hours
                    </span>
                  </div>
                </div>

                {/* Section 14: Bot Controls (Start, Pause, Stop, Edit) */}
                <div className="flex items-center gap-2">
                  {activeBotInstance.status === 'Active' ? (
                    <Button
                      variant="outline"
                      size="xs"
                      icon={Pause}
                      onClick={() => handleToggleBotStatus(activeBotInstance.id, 'Paused')}
                      className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
                    >
                      Pause Bot
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="xs"
                      icon={Play}
                      onClick={() => handleToggleBotStatus(activeBotInstance.id, 'Active')}
                    >
                      Resume Bot
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="xs"
                    icon={Square}
                    onClick={() => handleToggleBotStatus(activeBotInstance.id, 'Stopped')}
                    className="border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
                  >
                    Stop Bot
                  </Button>

                  <Button
                    variant="secondary"
                    size="xs"
                    icon={Sliders}
                    onClick={() => handleOpenBotConfig(activeBotInstance)}
                  >
                    Edit Settings
                  </Button>
                </div>
              </div>

              {/* Bot Performance Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] text-slate-400 block font-sans">Investment</span>
                  <span className="text-white font-bold block mt-1">
                    ${activeBotInstance.liveStats.investment.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] text-slate-400 block font-sans">Current Value</span>
                  <span className="text-white font-bold block mt-1">
                    ${activeBotInstance.liveStats.currentValue.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] text-slate-400 block font-sans">Unrealized P&L</span>
                  <span className="text-emerald-400 font-bold block mt-1">
                    +${activeBotInstance.liveStats.unrealizedPnl.toFixed(2)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] text-slate-400 block font-sans">Realized P&L</span>
                  <span className="text-emerald-400 font-bold block mt-1">
                    +${activeBotInstance.liveStats.realizedPnl.toFixed(2)}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] text-slate-400 block font-sans">Win Rate</span>
                  <span className="text-white font-bold block mt-1">
                    {activeBotInstance.liveStats.winRate}%
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] text-slate-400 block font-sans">Trades Executed</span>
                  <span className="text-cyan-400 font-bold block mt-1">
                    {activeBotInstance.liveStats.totalTrades}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] text-slate-400 block font-sans">Profit Factor</span>
                  <span className="text-white font-bold block mt-1">
                    {activeBotInstance.liveStats.profitFactor}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] text-slate-400 block font-sans">Max Drawdown</span>
                  <span className="text-amber-400 font-bold block mt-1">
                    {activeBotInstance.liveStats.maxDrawdown}%
                  </span>
                </div>
              </div>

              {/* Bot Performance Chart (Section 12) */}
              <TradingChart title={`${activeBotInstance.name} Simulated P&L Curve`} />

              {/* Bot Activity Table (Section 13) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                    Recent Bot Execution Activity
                  </h4>
                  <span className="text-[11px] font-mono text-slate-500">Live order routing</span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-white/[0.06] bg-white/[0.01]">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[10px] uppercase text-slate-400">
                      <tr>
                        <th className="px-3 py-2">Time</th>
                        <th className="px-3 py-2">Pair</th>
                        <th className="px-3 py-2">Side</th>
                        <th className="px-3 py-2">Entry</th>
                        <th className="px-3 py-2">Exit</th>
                        <th className="px-3 py-2">Amount</th>
                        <th className="px-3 py-2 text-right">P&L</th>
                        <th className="px-3 py-2 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {BOT_TRADE_ACTIVITY_DATA.map((tr) => (
                        <tr key={tr.id} className="hover:bg-white/[0.02]">
                          <td className="px-3 py-2 text-slate-400">{tr.time}</td>
                          <td className="px-3 py-2 text-white font-semibold">{tr.pair}</td>
                          <td className="px-3 py-2">
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                tr.side === 'BUY'
                                  ? 'bg-emerald-500/10 text-emerald-400'
                                  : 'bg-rose-500/10 text-rose-400'
                              }`}
                            >
                              {tr.side}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-slate-300">
                            ${tr.entryPrice.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-slate-300">
                            {tr.exitPrice ? `$${tr.exitPrice.toLocaleString()}` : '—'}
                          </td>
                          <td className="px-3 py-2 text-slate-300">${tr.amountUsd.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right">
                            <span
                              className={tr.pnlUsd >= 0 ? 'text-emerald-400' : 'text-rose-400'}
                            >
                              {tr.pnlUsd >= 0 ? '+' : ''}${tr.pnlUsd.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-right text-slate-400">{tr.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Section 8: Bot Marketplace (Conservative, Balanced, Aggressive, Arbitrage) */}
          <div className="space-y-4 pt-2">
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Bot Marketplace & Quantitative Strategies
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Browse pre-built algorithmic configurations tailored to different risk profiles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {bots.map((b) => (
                <BotCard
                  key={b.id}
                  bot={b}
                  onConfigure={handleOpenBotConfig}
                  onViewDetails={handleOpenBotConfig}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 6: PORTFOLIO & ASSETS
         ========================================================= */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          {/* Portfolio Metric Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0B0F19]">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Portfolio Net Value
              </span>
              <div className="text-2xl font-bold font-mono text-white">
                ${balances.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] font-mono text-emerald-400 mt-1 block">
                +$324.47 total unrealized & realized gain
              </span>
            </div>

            <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0B0F19]">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                Available vs In Trading
              </span>
              <div className="text-2xl font-bold font-mono text-cyan-400">
                ${balances.available.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
              <span className="text-[11px] font-mono text-slate-400 mt-1 block">
                ${balances.locked.toLocaleString('en-US', { minimumFractionDigits: 2 })} locked in
                active bot orders
              </span>
            </div>

            <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0B0F19]">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-1">
                24H Asset Performance
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                +2.84%
              </div>
              <span className="text-[11px] font-mono text-slate-400 mt-1 block">
                Top contributor: SOL (+5.72%)
              </span>
            </div>
          </div>

          {/* Asset Allocation Breakdown Bar */}
          <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0B0F19] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">Asset Allocation Breakdown</span>
              <span className="text-slate-400 font-mono">5 Primary Currencies</span>
            </div>

            <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/[0.05]">
              {PORTFOLIO_ASSETS_DATA.map((a) => (
                <div
                  key={a.symbol}
                  style={{
                    width: `${a.allocationPercent}%`,
                    backgroundColor: a.color,
                  }}
                  title={`${a.name}: ${a.allocationPercent}%`}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] font-mono">
              {PORTFOLIO_ASSETS_DATA.map((a) => (
                <div key={a.symbol} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: a.color }}
                  />
                  <span className="text-slate-300">{a.symbol}</span>
                  <span className="text-slate-500 font-bold">{a.allocationPercent}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Asset Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PORTFOLIO_ASSETS_DATA.map((asset) => (
              <AssetCard
                key={asset.symbol}
                asset={asset}
                onTradeAsset={(sym) => {
                  showToast(`Selected ${sym} for trade simulation.`);
                  setActiveTab('signals');
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 7: HISTORY & TIMELINE
         ========================================================= */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Trade History Table (8 Cols) */}
            <div className="lg:col-span-8 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white font-display">
                  Execution & Settlement History
                </h2>
                <span className="text-xs font-mono text-slate-400">
                  {historyTrades.length} recorded orders
                </span>
              </div>
              <TradeTable trades={historyTrades} />
            </div>

            {/* AI Activity Timeline (4 Cols) */}
            <div className="lg:col-span-4 space-y-3">
              <h2 className="text-base font-bold text-white font-display">
                AI Activity Stream
              </h2>

              <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F19] p-4 space-y-4">
                {AI_ACTIVITY_TIMELINE_DATA.map((item, idx) => (
                  <div key={item.id} className="relative flex gap-3 text-xs">
                    {/* Line connector */}
                    {idx !== AI_ACTIVITY_TIMELINE_DATA.length - 1 && (
                      <span className="absolute left-3 top-6 bottom-0 w-px bg-white/[0.08]" />
                    )}

                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-mono z-10">
                      {item.type === 'SIGNAL_GENERATED' ? 'SIG' : item.type === 'BOT_TRADE' ? 'BOT' : 'TSK'}
                    </div>

                    <div className="space-y-1 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200">{item.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {item.description}
                      </p>
                      {item.metadata?.pnl && (
                        <span className="inline-block text-[10px] font-mono font-bold text-emerald-400">
                          {item.metadata.pnl}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TAB 8: RISK MANAGEMENT & GUARD
         ========================================================= */}
      {activeTab === 'risk' && (
        <div className="space-y-6">
          <RiskCard
            stats={RISK_MANAGEMENT_DATA}
            onAdjustParameters={() => {
              showToast('Risk thresholds set to strict preservation profile.');
            }}
          />

          {/* Active Positions In Risk Context */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white font-display">
              Open Market Exposure & Margin Health
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {positions.map((pos) => (
                <PositionCard
                  key={pos.id}
                  position={pos}
                  onClosePosition={handleClosePosition}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          INTERACTIVE MODALS
         ========================================================= */}
      {/* 1. Signal Detail Modal */}
      <SignalModal
        isOpen={isSignalModalOpen}
        onClose={() => setIsSignalModalOpen(false)}
        signal={selectedSignal}
        onSimulate={handleSimulateSignal}
      />

      {/* 2. AI Trading Profit Model UI Modal */}
      <ProfitModelModal
        isOpen={isProfitModelOpen}
        onClose={() => setIsProfitModelOpen(false)}
        recommendation={selectedRecommendation}
      />

      {/* 3. Bot Configuration Modal */}
      <BotConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        bot={configuringBot}
        onSaveAndDeploy={handleSaveAndDeployBot}
      />

      {/* 4. Risk Disclosure Notice Modal */}
      <RiskNoticeModal
        isOpen={isRiskNoticeOpen}
        onClose={() => setIsRiskNoticeOpen(false)}
        onConfirm={handleConfirmRiskAndDeploy}
        botName={riskNoticeBot?.name || 'AI Trading Bot'}
      />
    </div>
  );
};
