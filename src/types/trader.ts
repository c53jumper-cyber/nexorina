export type TraderNavTab =
  | 'overview'
  | 'tasks'
  | 'signals'
  | 'ai-trading'
  | 'bots'
  | 'portfolio'
  | 'history'
  | 'risk';

export interface TraderBalance {
  total: number;
  available: number;
  locked: number;
  currency: string;
}

export interface TodayPerformance {
  pnlUsd: number;
  pnlPercent: number;
  profitUsd: number;
  lossUsd: number;
  winRate: number;
  completedTasks: number;
  totalTasks: number;
}

export interface AISignal {
  id: string;
  asset: string;
  pair: string;
  direction: 'LONG' | 'SHORT';
  entryZone: string;
  targetPrice: string;
  targetPriceSecondary?: string;
  stopLoss: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  confidence: number; // e.g. 82%
  timeAgo: string;
  status: 'Active' | 'Target 1 Reached' | 'Target 2 Reached' | 'Closed' | 'Pending';
  timeframe: string;
  rationale: string;
}

export interface AITradingRecommendation {
  id: string;
  title: string;
  asset: string;
  pair: string;
  direction: 'LONG' | 'SHORT';
  entry: string;
  target: string;
  stopLoss: string;
  risk: 'Low' | 'Medium' | 'High';
  suggestedAmount: number;
  expectedScenario: string;
  expectedProfitPercent: number;
  platformFeePercent: number;
  modelConfidence: number;
  strategyName: string;
  marketRegime: string;
}

export interface AIBot {
  id: string;
  name: string;
  tagline: string;
  strategy: 'Conservative' | 'Balanced' | 'Aggressive' | 'Arbitrage' | 'Grid';
  riskLevel: 'Low' | 'Medium' | 'High';
  tradingPair: string;
  supportedPairs: string[];
  historicalPerformance: {
    monthlyPnl: string;
    winRate: number;
    profitFactor: number;
    maxDrawdown: string;
    totalSimulatedTrades: number;
  };
  status: 'Active' | 'Paused' | 'Stopped' | 'Ready';
  description: string;
  features: string[];
  minInvestment: number;
  activeConfig?: BotConfiguration;
  liveStats?: BotLiveStats;
}

export interface BotConfiguration {
  tradingPair: string;
  investmentAmount: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  maxDrawdownPercent: number;
  dailyTradingLimit: number;
  takeProfitConditionPercent: number;
  stopLossConditionPercent: number;
  durationDays: number;
}

export interface BotLiveStats {
  investment: number;
  currentValue: number;
  unrealizedPnl: number;
  unrealizedPnlPercent: number;
  realizedPnl: number;
  realizedPnlPercent: number;
  winRate: number;
  totalTrades: number;
  profitableTrades: number;
  profitFactor: number;
  maxDrawdown: number;
  uptimeHours: number;
}

export interface BotTradeActivity {
  id: string;
  botId: string;
  time: string;
  asset: string;
  pair: string;
  side: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  amountUsd: number;
  pnlUsd: number;
  pnlPercent: number;
  status: 'Completed' | 'Open' | 'Cancelled';
}

export interface TraderPosition {
  id: string;
  asset: string;
  pair: string;
  side: 'LONG' | 'SHORT';
  leverage: number;
  sizeUsd: number;
  entryPrice: number;
  markPrice: number;
  liquidationPrice: number;
  pnlUsd: number;
  pnlPercent: number;
  marginUsd: number;
  timeOpened: string;
}

export interface TraderPortfolioAsset {
  symbol: string;
  name: string;
  amount: number;
  valueUsd: number;
  averageEntryUsd: number;
  currentPriceUsd: number;
  pnlUsd: number;
  pnlPercent: number;
  change24h: number;
  allocationPercent: number;
  color: string;
}

export interface TradeHistoryItem {
  id: string;
  asset: string;
  pair: string;
  side: 'BUY' | 'SELL' | 'LONG' | 'SHORT';
  amount: number;
  amountUsd: number;
  entryPrice: number;
  exitPrice: number;
  pnlUsd: number;
  pnlPercent: number;
  feeUsd: number;
  date: string;
  status: 'Completed' | 'Liquidated' | 'Cancelled';
  executionType: 'Manual' | 'AI Signal' | 'AI Trading Bot' | 'Task Auto-Hedging';
}

export interface AIActivityTimelineItem {
  id: string;
  type: 'SIGNAL_GENERATED' | 'RECOMMENDATION' | 'BOT_STARTED' | 'BOT_TRADE' | 'BOT_PAUSED' | 'BOT_STOPPED' | 'TASK_COMPLETED';
  title: string;
  description: string;
  timestamp: string;
  metadata?: {
    asset?: string;
    pnl?: string;
    botName?: string;
    confidence?: number;
  };
}

export interface RiskManagementStats {
  currentRiskScore: number; // 0-100 (e.g. 34: Moderate)
  riskLevel: 'Conservative' | 'Moderate' | 'Aggressive' | 'High Risk';
  portfolioRiskPercent: number;
  dailyRiskExposureUsd: number;
  maxDrawdownLimitPercent: number;
  currentDrawdownPercent: number;
  totalMarketExposureUsd: number;
  activePositionsCount: number;
  marginUtilizationPercent: number;
}
