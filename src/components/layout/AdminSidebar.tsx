import React from 'react';
import {
  ShieldAlert,
  Users,
  Cpu,
  Dices,
  LineChart,
  Megaphone,
  Wallet,
  Gift,
  ArrowLeftRight,
  Bell,
  HelpCircle,
  BarChart3,
  Sliders,
  ArrowLeft,
  X,
  KeyRound,
  FileCheck2,
  FileText,
  ShieldCheck,
  Sparkles,
  Bot,
  Share2,
} from 'lucide-react';
import { AdminNavSection } from '../../types';

interface AdminSidebarProps {
  currentSection: AdminNavSection;
  onSelectSection: (section: AdminNavSection) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onReturnToUser: () => void;
}

interface AdminNavItem {
  id: AdminNavSection;
  labelFa: string;
  labelEn: string;
  icon: React.ComponentType<{ className?: string }>;
  group: 'governance' | 'modules' | 'finance' | 'system';
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  // 1. حاکمیت و نظارت (Governance & Overview)
  { id: 'admin-dashboard', labelFa: 'داشبورد مدیریتی', labelEn: 'Dashboard', icon: ShieldAlert, group: 'governance' },
  { id: 'admin-users', labelFa: 'مدیریت کاربران', labelEn: 'Users Management', icon: Users, group: 'governance' },
  { id: 'admin-invitations', labelFa: 'مدیریت دعوتنامه‌ها', labelEn: 'Invitations', icon: KeyRound, group: 'governance' },
  { id: 'admin-rbac', labelFa: 'سطوح دسترسی و نقش‌ها', labelEn: 'RBAC Permissions', icon: ShieldCheck, group: 'governance' },
  { id: 'admin-audit', labelFa: 'لاگ حسابرسی مدیران', labelEn: 'Audit Trail', icon: FileCheck2, group: 'governance' },
  { id: 'admin-logs', labelFa: 'لاگ سیستم و امنیت', labelEn: 'Security & Logs', icon: FileText, group: 'governance' },
  { id: 'admin-reports', labelFa: 'گزارش‌ها و تحلیل‌ها', labelEn: 'Reports & Analytics', icon: BarChart3, group: 'governance' },

  // 2. ماژول‌های فعال (Active Modules Control)
  { id: 'admin-mining', labelFa: 'مدیریت ماینینگ', labelEn: 'Mining Management', icon: Cpu, group: 'modules' },
  { id: 'admin-trader', labelFa: 'مدیریت ترید', labelEn: 'Trader Tasks', icon: LineChart, group: 'modules' },
  { id: 'admin-ai-trading', labelFa: 'معاملات هوش مصنوعی', labelEn: 'AI Trading', icon: Sparkles, group: 'modules' },
  { id: 'admin-ai-bots', labelFa: 'ربات‌های الگوریتمی', labelEn: 'AI Trading Bots', icon: Bot, group: 'modules' },
  { id: 'admin-campaigns', labelFa: 'مدیریت کمپین‌ها', labelEn: 'Campaigns', icon: Megaphone, group: 'modules' },
  { id: 'admin-social-growth', labelFa: 'رشد شبکه‌ها', labelEn: 'Social Growth', icon: Share2, group: 'modules' },
  { id: 'admin-casino', labelFa: 'مدیریت کازینو', labelEn: 'Casino & Games', icon: Dices, group: 'modules' },

  // 3. مالی و خزانه‌داری (Finance & Treasury)
  { id: 'admin-wallet', labelFa: 'کیف‌پول و خزانه‌داری', labelEn: 'Treasury & Wallets', icon: Wallet, group: 'finance' },
  { id: 'admin-rewards', labelFa: 'مدیریت پاداش‌ها', labelEn: 'Rewards Settlement', icon: Gift, group: 'finance' },
  { id: 'admin-transactions', labelFa: 'دفتر کل تراکنش‌ها', labelEn: 'Ledger Journal', icon: ArrowLeftRight, group: 'finance' },

  // 4. سیستم و تنظیمات (System & Governance)
  { id: 'admin-settings', labelFa: 'تنظیمات سیستم', labelEn: 'System Settings', icon: Sliders, group: 'system' },
  { id: 'admin-notifications', labelFa: 'اعلان‌های همگانی', labelEn: 'Broadcasts', icon: Bell, group: 'system' },
  { id: 'admin-support', labelFa: 'پشتیبانی کاربران', labelEn: 'Support Desk', icon: HelpCircle, group: 'system' },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentSection,
  onSelectSection,
  isOpenMobile,
  onCloseMobile,
  onReturnToUser,
}) => {
  const renderGroup = (
    titleFa: string,
    titleEn: string,
    groupKey: 'governance' | 'modules' | 'finance' | 'system'
  ) => {
    const items = ADMIN_NAV_ITEMS.filter((i) => i.group === groupKey);

    return (
      <div className="mb-4">
        <div className="px-3 mb-1.5 flex items-center justify-between text-[11px] font-mono font-medium text-slate-400">
          <span>{titleFa}</span>
          <span className="text-[10px] text-slate-600 uppercase">{titleEn}</span>
        </div>
        <div className="space-y-0.5">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-l from-rose-950/40 to-indigo-950/60 border border-indigo-500/40 text-white font-bold shadow-lg shadow-indigo-950/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.labelFa}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{item.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-50 w-72 bg-[#080B16] border-l border-white/[0.08] flex flex-col transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header of Admin Sidebar */}
        <div className="h-16 px-4 border-b border-white/[0.08] flex items-center justify-between bg-gradient-to-l from-[#0D1022] to-transparent">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-rose-600 text-white shadow-lg shadow-rose-500/20">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold text-white tracking-wide">
                کنسول مدیریت Nexorina
              </div>
              <div className="text-[10px] font-mono text-indigo-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>ROOT PRIVILEGES · RBAC</span>
              </div>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 hover:text-white lg:hidden rounded-lg hover:bg-white/[0.04]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-none">
          {renderGroup('حاکمیت و دسترسی', 'Governance', 'governance')}
          {renderGroup('مدیریت ماژول‌ها', 'Modules', 'modules')}
          {renderGroup('امور مالی و پاداش', 'Finance', 'finance')}
          {renderGroup('سامانه و پشتیبانی', 'System', 'system')}
        </div>

        {/* Bottom Switch Back to User Application */}
        <div className="p-3 border-t border-white/[0.08] bg-[#070912]">
          <button
            onClick={onReturnToUser}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-white/[0.1] bg-white/[0.02] text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>بازگشت به پنل کاربری (User App)</span>
          </button>
        </div>
      </aside>
    </>
  );
};
