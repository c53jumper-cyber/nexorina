export type UserNavSection =
  | 'dashboard'
  | 'mining'
  | 'casino'
  | 'trader'
  | 'campaigns'
  | 'social-growth'
  | 'wallet'
  | 'rewards'
  | 'transactions'
  | 'notifications'
  | 'profile'
  | 'settings'
  | 'support';

export type AdminNavSection =
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-invitations'
  | 'admin-rbac'
  | 'admin-audit'
  | 'admin-logs'
  | 'admin-mining'
  | 'admin-casino'
  | 'admin-trader'
  | 'admin-ai-trading'
  | 'admin-ai-bots'
  | 'admin-campaigns'
  | 'admin-social-growth'
  | 'admin-wallet'
  | 'admin-rewards'
  | 'admin-transactions'
  | 'admin-notifications'
  | 'admin-support'
  | 'admin-reports'
  | 'admin-settings';

export * from '../shared/types/rbac';
export * from '../shared/types/auth';
export * from '../shared/types/audit';
export * from '../shared/types/invitation';

export interface UserStats {
  totalBalance: number;
  availableBalance: number;
  miningRewards: number;
  tradingRewards: number;
  campaignRewards: number;
  totalEarnings: number;
  activeTasks: number;
  balanceChange24h: number;
}

export interface ActivityItem {
  id: string;
  type: 'mining' | 'trading' | 'campaign' | 'casino' | 'wallet';
  title: string;
  description: string;
  amount?: string;
  isPositive?: boolean;
  timestamp: string;
}

export interface Miner {
  id: string;
  name: string;
  power: string;
  hashrateNumeric: number;
  status: 'active' | 'paused' | 'standby' | 'available' | 'unavailable';
  rewardRate: string;
  uptime: string;
  level: number;
  efficiency: string;
  dailyEstimateUsd: number;
  supportedCoins: string[];
  isImportant?: boolean;
  sharesAccepted?: number;
  sharesRejected?: number;
  hardwareTemp?: string;
  powerDraw?: string;
  modelCode?: string;
  image?: string;
  description?: string;
}

export interface CryptoAsset {
  symbol: string;
  name: string;
  balance: number;
  usdValue: number;
  priceUsd: number;
  change24h: number;
  iconColor: string;
  network: string;
  status: 'active' | 'maintenance' | 'coming_soon';
}

export interface CasinoGame {
  id: string;
  name: string;
  category: 'Slots' | 'Crash' | 'Dice' | 'Roulette' | 'Blackjack' | 'Live Games';
  status: 'Active' | 'Hot' | 'New' | 'Maintenance';
  rtp: string;
  playersCount: number;
  image?: string;
  accentColor: string;
}

export interface TraderTask {
  id: string;
  asset: string;
  taskName: string;
  duration: string;
  status: 'In Progress' | 'Ready to Claim' | 'Available' | 'Completed';
  reward: string;
  rewardUsd: number;
  progress: number;
  difficulty: 'Low' | 'Medium' | 'High';
}

export interface Campaign {
  id: string;
  name: string;
  partner: string;
  targetUsers: number;
  currentUsers: number;
  remainingCapacity: number;
  rewardPool: string;
  rewardPoolUsd: number;
  rewardPerUser: string;
  rewardPerUserUsd: number;
  status: 'Active' | 'Full' | 'Completed' | 'Paused';
  startDate: string;
  endDate: string;
  category: string;
  description: string;
}

export interface Transaction {
  id: string;
  type: 'Deposit' | 'Withdrawal' | 'Reward' | 'Transfer';
  asset: string;
  amount: number;
  amountUsd: number;
  status: 'Completed' | 'Pending' | 'Failed';
  date: string;
  reference: string;
  destinationOrSource?: string;
}

export interface NotificationItem {
  id: string;
  category: 'system' | 'reward' | 'campaign' | 'security';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority?: 'high' | 'normal';
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  lastUpdated: string;
  messagesCount: number;
}

export interface AdminUserRecord {
  id: string;
  username: string;
  email: string;
  status: 'Active' | 'KYC Verified' | 'Suspended';
  balanceUsd: number;
  rewardsUsd: number;
  joinDate: string;
  lastActive: string;
  tier: string;
}

export interface SocialGrowthCampaign {
  id: string;
  platform: 'Instagram' | 'TikTok' | 'YouTube' | 'X' | 'Telegram' | 'Discord';
  campaignName: string;
  target: string;
  targetCount: number;
  currentProgress: number; // percentage
  currentFollowers: number;
  reward: string;
  rewardUsd: number;
  status: 'Active' | 'Hot' | 'Completed' | 'Upcoming';
  category: string;
  description: string;
  accentColor: string;
}

export * from './trader';

