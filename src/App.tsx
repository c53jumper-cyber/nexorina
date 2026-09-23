/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserNavSection } from './types';
import {
  MOCK_USER_METRICS,
  INITIAL_ACTIVITIES,
  MINERS_LIST,
  SUPPORTED_CRYPTO_ASSETS,
  CASINO_GAMES,
  TRADER_DAILY_TASKS,
  CAMPAIGNS_LIST,
  TRANSACTIONS_LIST,
  NOTIFICATIONS_LIST,
} from './data/mockData';
import { InvitationRecord } from './shared/types/access';

// Private Access Gateway (Invitation-Only Entry Architecture)
import { PrivateAccessGateway } from './components/gateway/PrivateAccessGateway';

// Layout Components
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';

// User Application Modules (Exclusively English)
import { DashboardPage } from './pages/DashboardPage';
import { MiningPage } from './pages/MiningPage';
import { CasinoPage } from './pages/CasinoPage';
import { TraderPage } from './pages/TraderPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { SocialGrowthPage } from './pages/SocialGrowthPage';
import { WalletPage } from './pages/WalletPage';
import { RewardsPage } from './pages/RewardsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { SupportPage } from './pages/SupportPage';

const VALID_USER_SECTIONS: UserNavSection[] = [
  'dashboard',
  'mining',
  'casino',
  'trader',
  'campaigns',
  'social-growth',
  'wallet',
  'rewards',
  'transactions',
  'notifications',
  'profile',
  'settings',
  'support',
];

export default function App() {
  // Application View: Private Gateway vs User Panel
  const [appView, setAppView] = useState<'gateway' | 'user_panel'>(() => {
    const hash = window.location.hash.replace('#', '');
    if (VALID_USER_SECTIONS.includes(hash as UserNavSection)) {
      return 'user_panel';
    }
    return 'gateway';
  });

  const [currentSection, setCurrentSection] = useState<UserNavSection>(() => {
    const hash = window.location.hash.replace('#', '');
    if (VALID_USER_SECTIONS.includes(hash as UserNavSection)) {
      return hash as UserNavSection;
    }
    return 'dashboard';
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Synchronize browser history / back-forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'gateway') {
        setAppView('gateway');
      } else if (VALID_USER_SECTIONS.includes(hash as UserNavSection)) {
        setAppView('user_panel');
        setCurrentSection(hash as UserNavSection);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // User Application Mock State
  const [metrics] = useState(MOCK_USER_METRICS);
  const [activities] = useState(INITIAL_ACTIVITIES);
  const [miners] = useState(MINERS_LIST);
  const [assets] = useState(SUPPORTED_CRYPTO_ASSETS);
  const [casinoGames] = useState(CASINO_GAMES);
  const [traderTasks] = useState(TRADER_DAILY_TASKS);
  const [campaigns] = useState(CAMPAIGNS_LIST);
  const [transactions] = useState(TRANSACTIONS_LIST);
  const [notifications] = useState(NOTIFICATIONS_LIST);

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const handleNavigateUser = (section: UserNavSection) => {
    setCurrentSection(section);
    setIsMobileSidebarOpen(false);
    if (window.location.hash.replace('#', '') !== section) {
      window.location.hash = section;
    }
  };

  const handleInvitationRegistered = (_username: string, _invitation: InvitationRecord) => {
    // Single-use invitation redeemed -> enter interior User Panel
    setAppView('user_panel');
    setCurrentSection('dashboard');
    window.location.hash = 'dashboard';
  };

  const handleLockToGateway = () => {
    setAppView('gateway');
    window.location.hash = 'gateway';
  };

  // 1. Private Access Gateway View (Controlled Invitation-Only Entry)
  if (appView === 'gateway') {
    return (
      <PrivateAccessGateway
        onEnterUserPanel={() => {
          setAppView('user_panel');
          window.location.hash = currentSection || 'dashboard';
        }}
        onRegisteredAndVerified={handleInvitationRegistered}
      />
    );
  }

  // 2. Verified User Application View
  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Discreet Gateway Quick Switcher Banner for Seamless Navigation */}
      <div className="bg-[#090D1A] border-b border-indigo-500/20 px-4 py-1.5 text-[11px] font-mono flex items-center justify-between text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          <span className="text-slate-200">Verified User Session Active</span>
          <span className="text-slate-600">·</span>
          <span className="text-indigo-400">Invitation Validated</span>
        </div>
        <button
          onClick={handleLockToGateway}
          className="text-slate-400 hover:text-white hover:underline transition-colors flex items-center gap-1"
          title="Return to Private Access Gateway"
        >
          <span>Private Access Gateway ⇄</span>
        </button>
      </div>

      {/* Top Header */}
      <Header
        currentSection={currentSection}
        onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        onNavigate={(sec) => handleNavigateUser(sec as UserNavSection)}
        unreadCount={unreadNotifsCount}
        totalBalanceUsd={metrics.totalBalance}
        onLockToGateway={handleLockToGateway}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* User Navigation Sidebar */}
        <Sidebar
          currentSection={currentSection}
          onSelectSection={handleNavigateUser}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          unreadCount={unreadNotifsCount}
        />

        {/* User Application Main Viewport */}
        <main className="flex-1 overflow-y-auto px-4 pt-6 pb-24 md:pb-8 md:px-8 md:py-8 lg:px-10 max-w-7xl mx-auto w-full">
          {currentSection === 'dashboard' && (
            <DashboardPage
              stats={metrics}
              activities={activities}
              onNavigate={handleNavigateUser}
            />
          )}

          {currentSection === 'mining' && (
            <MiningPage
              miners={miners}
              supportedAssets={assets}
              miningBalance={metrics.miningRewards}
            />
          )}

          {currentSection === 'casino' && <CasinoPage games={casinoGames} />}

          {currentSection === 'trader' && (
            <TraderPage
              tasks={traderTasks}
              tradingBalance={metrics.tradingRewards}
            />
          )}

          {currentSection === 'campaigns' && <CampaignsPage campaigns={campaigns} />}

          {currentSection === 'social-growth' && <SocialGrowthPage />}

          {currentSection === 'wallet' && (
            <WalletPage
              assets={assets}
              totalBalance={metrics.totalBalance}
              availableBalance={metrics.availableBalance}
              rewardsBalance={metrics.miningRewards + metrics.tradingRewards + metrics.campaignRewards}
            />
          )}

          {currentSection === 'rewards' && (
            <RewardsPage
              miningRewards={metrics.miningRewards}
              tradingRewards={metrics.tradingRewards}
              campaignRewards={metrics.campaignRewards}
            />
          )}

          {currentSection === 'transactions' && (
            <TransactionsPage transactions={transactions} />
          )}

          {currentSection === 'notifications' && (
            <NotificationsPage notifications={notifications} />
          )}

          {currentSection === 'profile' && <ProfilePage />}

          {currentSection === 'settings' && <SettingsPage />}

          {currentSection === 'support' && <SupportPage />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        currentSection={currentSection}
        onSelectSection={handleNavigateUser}
        onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
      />
    </div>
  );
}
