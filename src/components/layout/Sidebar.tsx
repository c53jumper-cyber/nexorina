import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  Dices,
  LineChart,
  Megaphone,
  Share2,
  Wallet,
  Gift,
  ArrowLeftRight,
  Bell,
  User,
  Settings,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  X,
  Sparkles,
} from 'lucide-react';
import { UserNavSection } from '../../types';
import { Logo } from '../common/Logo';

interface SidebarProps {
  currentSection: UserNavSection;
  onSelectSection: (section: UserNavSection) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  unreadCount?: number;
}

interface NavItem {
  id: UserNavSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeType?: 'live' | 'hot' | 'new';
  group: 'main' | 'finance' | 'account';
}

const NAV_ITEMS: NavItem[] = [
  // MAIN
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'main' },
  { id: 'mining', label: 'Mining', icon: Cpu, badge: 'Live', badgeType: 'live', group: 'main' },
  { id: 'casino', label: 'Casino', icon: Dices, badge: 'Demo', group: 'main' },
  { id: 'trader', label: 'Trader', icon: LineChart, group: 'main' },
  { id: 'campaigns', label: 'Campaigns', icon: Megaphone, badge: 'Hot', badgeType: 'hot', group: 'main' },
  { id: 'social-growth', label: 'Social Growth', icon: Share2, badge: 'New', badgeType: 'new', group: 'main' },

  // FINANCE
  { id: 'wallet', label: 'Wallet', icon: Wallet, group: 'finance' },
  { id: 'rewards', label: 'Rewards', icon: Gift, group: 'finance' },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight, group: 'finance' },

  // ACCOUNT
  { id: 'notifications', label: 'Notifications', icon: Bell, group: 'account' },
  { id: 'profile', label: 'Profile', icon: User, group: 'account' },
  { id: 'settings', label: 'Settings', icon: Settings, group: 'account' },
  { id: 'support', label: 'Support', icon: HelpCircle, group: 'account' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  isOpenMobile,
  onCloseMobile,
  unreadCount = 3,
}) => {
  const renderNavGroup = (title: string, groupKey: 'main' | 'finance' | 'account') => {
    const items = NAV_ITEMS.filter((item) => item.group === groupKey);

    return (
      <div className="mb-5">
        <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
          {title}
        </div>
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectSection(item.id);
                  onCloseMobile();
                }}
                className={`group relative flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/20 via-indigo-600/10 to-transparent text-white font-semibold border border-indigo-500/30 shadow-[0_0_16px_rgba(99,102,241,0.15)]'
                    : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 border border-transparent'
                }`}
              >
                {/* Active left indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                )}

                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-all duration-200 ${
                      isActive
                        ? 'text-indigo-400 scale-110 drop-shadow-[0_0_6px_rgba(99,102,241,0.5)]'
                        : 'text-slate-400 group-hover:text-slate-200 group-hover:scale-105'
                    }`}
                  />
                  <span className="tracking-wide">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.id === 'notifications' && unreadCount > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-bold text-white font-mono shadow-[0_0_8px_rgba(99,102,241,0.5)]">
                      {unreadCount}
                    </span>
                  )}
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        item.badgeType === 'live'
                          ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                          : item.badgeType === 'hot'
                          ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                          : item.badgeType === 'new'
                          ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                          : 'text-indigo-400 bg-indigo-500/10'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>
    );
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 overflow-y-auto">
      <div>
        {/* Top of Sidebar: Brand Logo */}
        <div className="pb-5 mb-5 border-b border-white/[0.08] flex items-center justify-between">
          <button
            onClick={() => onSelectSection('dashboard')}
            className="text-left group transition-transform hover:opacity-95"
          >
            <Logo size="md" />
          </button>

          {/* Close button for Mobile Drawer */}
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.05] md:hidden transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Categories */}
        {renderNavGroup('Main', 'main')}
        {renderNavGroup('Finance', 'finance')}
        {renderNavGroup('Account', 'account')}
      </div>

      {/* Protocol Health & Network Status at Bottom */}
      <div className="pt-4 border-t border-white/[0.08] space-y-2">
        <div className="flex items-center justify-between px-2 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
            <span className="text-slate-300">Nexorina Network</span>
          </div>
          <span className="text-slate-500">v2.4.0</span>
        </div>
        <div className="px-2 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-[10px] text-slate-400 font-mono flex items-center justify-between">
          <span>Latency: 12ms</span>
          <span className="text-emerald-400">Operational</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 flex-col shrink-0 border-r border-white/[0.08] bg-[#070A11] min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] bg-[#070A11] border-r border-white/[0.1] z-50 h-full shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
