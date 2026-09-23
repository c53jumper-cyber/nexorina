import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Search,
  ShieldAlert,
  Wallet,
  Menu,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  ChevronDown,
  User,
  Settings,
  Shield,
  HelpCircle,
  LogOut,
  CheckCheck,
  Cpu,
  Gift,
  Megaphone,
  Info,
} from 'lucide-react';
import { USER_AVATAR_URL, NOTIFICATIONS_DATA } from '../../data/mockData';
import { NotificationItem } from '../../types';

interface HeaderProps {
  currentSection: string;
  onOpenMobileMenu: () => void;
  onNavigate: (section: string) => void;
  unreadCount?: number;
  totalBalanceUsd: number;
  onLockToGateway?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentSection,
  onOpenMobileMenu,
  onNavigate,
  unreadCount = 3,
  totalBalanceUsd,
  onLockToGateway,
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifFilter, setNotifFilter] = useState<'all' | 'reward' | 'mining' | 'campaign' | 'system'>('all');
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS_DATA);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format page title cleanly
  const getPageTitle = (section: string) => {
    if (section === 'social-growth') return 'Social Growth';
    const clean = section.replace('admin-', '').replace('-', ' ');
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  };

  const getSectionCategory = (section: string) => {
    if (['dashboard', 'mining', 'casino', 'trader', 'campaigns', 'social-growth'].includes(section)) {
      return 'Main';
    }
    if (['wallet', 'rewards', 'transactions'].includes(section)) {
      return 'Finance';
    }
    if (['notifications', 'profile', 'settings', 'support'].includes(section)) {
      return 'Account';
    }
    return 'Admin';
  };

  const filteredNotifs = notifications.filter((n) => {
    if (notifFilter === 'all') return true;
    return n.category === notifFilter;
  });

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const currentUnread = notifications.filter((n) => !n.read).length;

  const getNotifIcon = (category: string) => {
    switch (category) {
      case 'reward':
        return <Gift className="h-3.5 w-3.5 text-emerald-400" />;
      case 'mining':
        return <Cpu className="h-3.5 w-3.5 text-indigo-400" />;
      case 'campaign':
        return <Megaphone className="h-3.5 w-3.5 text-amber-400" />;
      default:
        return <Info className="h-3.5 w-3.5 text-cyan-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/[0.08] bg-[#07090E]/95 px-4 md:px-6 backdrop-blur-xl">
      {/* Left Zone: Mobile toggle, Page Title, & Breadcrumb */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-slate-300 hover:text-white md:hidden"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Page Title & Breadcrumbs */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <span className="text-indigo-400/90 font-mono">Nexorina</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">{getSectionCategory(currentSection)}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200">{getPageTitle(currentSection)}</span>
          </div>
          <h1 className="text-sm md:text-base font-bold text-white tracking-tight leading-none mt-0.5 font-display">
            {getPageTitle(currentSection)}
          </h1>
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden lg:block ml-6 w-64 xl:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets, miners, tasks..."
            className="h-9 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-9 pr-8 text-xs text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/60 focus:bg-white/[0.05] focus:outline-none transition-all"
          />
          <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-white/[0.1] bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
            /
          </kbd>
        </div>
      </div>

      {/* Right Zone: System Status, Balances, Admin Switcher, Notifications & Profile */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Network status indicator (No pill: clean typography with separator) */}
        <div className="hidden xl:flex items-center gap-2 text-xs text-slate-400 pr-2 border-r border-white/[0.08]">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          <span className="text-slate-300 font-mono text-[11px]">Mainnet Mesh</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400 font-mono text-[11px]">12ms</span>
        </div>

        {/* Quick Balance Preview */}
        <button
          onClick={() => onNavigate('wallet')}
          className="hidden sm:flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] px-3 py-1.5 transition-colors"
        >
          <Wallet className="h-4 w-4 text-indigo-400" />
          <div className="text-left">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block leading-none">
              Balance
            </span>
            <span className="text-xs font-semibold font-mono tabular-nums text-white">
              ${totalBalanceUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </button>

        {/* Notifications Icon with Interactive Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-slate-300 hover:bg-white/[0.06] hover:text-white transition-colors"
            aria-label="View notifications"
          >
            <Bell className="h-4 w-4" />
            {currentUnread > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-white/[0.12] bg-[#0B0F19] shadow-2xl shadow-indigo-500/10 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3.5 border-b border-white/[0.08] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-display">
                    Notifications
                  </span>
                  {currentUnread > 0 && (
                    <span className="text-[10px] font-mono font-bold text-indigo-400">
                      ({currentUnread} new)
                    </span>
                  )}
                </div>
                {currentUnread > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-indigo-300 transition-colors"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Notification Category Filters */}
              <div className="flex items-center gap-1 p-2 border-b border-white/[0.06] bg-white/[0.01] overflow-x-auto text-[11px]">
                {(['all', 'reward', 'mining', 'campaign', 'system'] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNotifFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                      notifFilter === cat
                        ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Notification list */}
              <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.04]">
                {filteredNotifs.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No notifications in this category
                  </div>
                ) : (
                  filteredNotifs.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3.5 transition-colors hover:bg-white/[0.03] ${
                        !n.read ? 'bg-indigo-500/[0.03]' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.08]">
                          {getNotifIcon(n.category)}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-medium text-white">{n.title}</span>
                            {!n.read && (
                              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{n.message}</p>
                          <span className="text-[10px] text-slate-500 font-mono block">
                            {n.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-white/[0.08] text-center bg-white/[0.01]">
                <button
                  onClick={() => {
                    onNavigate('notifications');
                    setIsNotifOpen(false);
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium py-1 w-full"
                >
                  View All Notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with Interactive Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 pl-1 pr-1.5 py-1 rounded-xl border border-transparent hover:border-white/[0.08] hover:bg-white/[0.03] transition-colors"
          >
            <img
              src={USER_AVATAR_URL}
              alt="Alex Morgan"
              referrerPolicy="no-referrer"
              className="h-8 w-8 rounded-lg object-cover border border-white/[0.1]"
            />
            <div className="hidden md:block text-left">
              <div className="text-xs font-medium text-slate-200 leading-tight">Alex Morgan</div>
              <div className="text-[10px] font-mono text-emerald-400 leading-none">VIP Obsidian</div>
            </div>
            <ChevronDown className="h-3 w-3 text-slate-500 hidden md:block" />
          </button>

          {/* Profile Menu Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/[0.12] bg-[#0B0F19] p-1.5 shadow-2xl shadow-indigo-500/10 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2.5 border-b border-white/[0.06] mb-1">
                <div className="text-xs font-semibold text-white">Alex Morgan</div>
                <div className="text-[11px] text-slate-400 font-mono">alex.morgan@nexorina.net</div>
                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                  <span>Verified Identity · Tier 3</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setIsProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-white transition-colors"
                >
                  <User className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Profile Overview</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('settings');
                    setIsProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-white transition-colors"
                >
                  <Settings className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Account Settings</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('settings');
                    setIsProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-white transition-colors"
                >
                  <Shield className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Security & 2FA</span>
                </button>

                <button
                  onClick={() => {
                    onNavigate('support');
                    setIsProfileOpen(false);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-slate-300 hover:bg-white/[0.05] hover:text-white transition-colors"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Help & Support</span>
                </button>
              </div>

              <div className="pt-1 mt-1 border-t border-white/[0.06]">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    if (onLockToGateway) {
                      onLockToGateway();
                    } else {
                      onNavigate('dashboard');
                    }
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Lock Session / Private Gateway</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
