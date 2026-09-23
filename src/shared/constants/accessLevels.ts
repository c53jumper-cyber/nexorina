/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AccessLevelConfig, AccessLevelId, AssessmentQuestion, UserAccessSession } from '../types/access';

export const SYSTEM_ACCESS_LEVELS: Record<AccessLevelId, AccessLevelConfig> = {
  0: {
    id: 0,
    name: 'Applicant',
    tierTitle: 'Level 0 — Applicant',
    description: 'Onboarding applicant with pending assessment or manual verification.',
    badgeColor: 'text-slate-400',
    badgeBg: 'bg-slate-500/10',
    badgeBorder: 'border-slate-500/30',
    unlockedModules: ['dashboard_preview'],
    maxDailyVolumeUsd: 0,
    canAccessApi: false,
    canAccessAiTrading: false,
    canAccessSpecialistBounties: false,
    isInternalOnly: false,
  },
  1: {
    id: 1,
    name: 'Verified User',
    tierTitle: 'Level 1 — Verified User',
    description: 'Standard verified Nexorina ecosystem account with essential services enabled.',
    badgeColor: 'text-indigo-400',
    badgeBg: 'bg-indigo-500/10',
    badgeBorder: 'border-indigo-500/30',
    unlockedModules: ['dashboard', 'mining', 'casino', 'trader_basic', 'campaigns', 'social_growth', 'wallet', 'rewards'],
    maxDailyVolumeUsd: 25000,
    canAccessApi: false,
    canAccessAiTrading: true,
    canAccessSpecialistBounties: false,
    isInternalOnly: false,
  },
  2: {
    id: 2,
    name: 'Trusted User',
    tierTitle: 'Level 2 — Trusted User',
    description: 'Elevated trust tier with high-frequency execution and expanded withdrawal ceilings.',
    badgeColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/10',
    badgeBorder: 'border-emerald-500/30',
    unlockedModules: ['dashboard', 'mining', 'casino', 'trader', 'ai_trading', 'campaigns', 'social_growth', 'wallet', 'rewards'],
    maxDailyVolumeUsd: 150000,
    canAccessApi: true,
    canAccessAiTrading: true,
    canAccessSpecialistBounties: true,
    isInternalOnly: false,
  },
  3: {
    id: 3,
    name: 'Advanced / Specialist',
    tierTitle: 'Level 3 — Advanced Specialist',
    description: 'High-tier institutional access for quantitative modelers, node operators, and bounty leads.',
    badgeColor: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/30',
    unlockedModules: ['dashboard', 'mining', 'casino', 'trader', 'ai_trading_bots', 'campaigns', 'social_growth', 'wallet', 'rewards', 'node_telemetry'],
    maxDailyVolumeUsd: 1000000,
    canAccessApi: true,
    canAccessAiTrading: true,
    canAccessSpecialistBounties: true,
    isInternalOnly: false,
  },
  4: {
    id: 4,
    name: 'Core / Internal',
    tierTitle: 'Level 4 — Core Internal',
    description: 'Internal infrastructure and governance stakeholder tier with root operational visibility.',
    badgeColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/10',
    badgeBorder: 'border-amber-500/30',
    unlockedModules: ['*'],
    maxDailyVolumeUsd: 10000000,
    canAccessApi: true,
    canAccessAiTrading: true,
    canAccessSpecialistBounties: true,
    isInternalOnly: true,
  },
};

export const MOCK_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'q1',
    category: 'platform_rules',
    prompt: 'What is the primary role of cryptographic invitation nonces in the Nexorina ecosystem?',
    required: true,
    options: [
      { id: 'opt_1a', label: 'To gate access, prevent bot infiltration, and bind audit lineage' },
      { id: 'opt_1b', label: 'To provide free infinite daily trading leverage' },
      { id: 'opt_1c', label: 'To bypass compliance reviews and secondary verification' },
    ],
  },
  {
    id: 'q2',
    category: 'risk_management',
    prompt: 'How does Nexorina safeguard automated AI Trading Bots and quantitative models?',
    required: true,
    options: [
      { id: 'opt_2a', label: 'Through hard-coded stop-loss limits, kill-switches, and circuit breakers' },
      { id: 'opt_2b', label: 'By promising guaranteed 100% daily market returns' },
      { id: 'opt_2c', label: 'By executing all trades without balance checks' },
    ],
  },
  {
    id: 'q3',
    category: 'security_protocols',
    prompt: 'Which security precaution is mandatory when managing withdrawal addresses?',
    required: true,
    options: [
      { id: 'opt_3a', label: 'Whitelisting destination addresses with 24h timelock enforcement' },
      { id: 'opt_3b', label: 'Sharing API private keys in public chat channels' },
      { id: 'opt_3c', label: 'Disabling two-factor authentication for faster transactions' },
    ],
  },
];

export const DEFAULT_USER_ACCESS_SESSION: UserAccessSession = {
  userId: 'usr_nx_89214',
  username: 'Alex_Vance',
  invitationCode: 'NEX-7829-ALPHA',
  accessState: 'Verified',
  accessLevel: 1,
  assessmentScore: 100,
  submittedAt: '2026-09-18T10:30:00Z',
  verifiedAt: '2026-09-18T12:00:00Z',
  reviewerNotes: 'Identity confirmed via invitation hash. Basic access level active.',
  allowedModules: SYSTEM_ACCESS_LEVELS[1].unlockedModules,
};
