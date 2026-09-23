import React from 'react';
import {
  Users,
  UserCheck,
  Cpu,
  LineChart,
  Megaphone,
  Dices,
  Gift,
  ShieldAlert,
  ArrowUpRight,
  KeyRound,
  FileCheck2,
  ShieldCheck,
  Wallet,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { AdminNavSection } from '../../types';
import { auditLogger } from '../../backend/audit/auditLogger';
import { invitationService } from '../../backend/invitations/invitationService';

interface AdminDashboardPageProps {
  onNavigateAdmin: (section: AdminNavSection) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigateAdmin }) => {
  const auditLogs = auditLogger.getLogs().slice(0, 4);
  const invitations = invitationService.getAll();
  const activeInvCount = invitations.filter((i) => i.status === 'Active').length;

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Admin Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-l from-[#11132B] via-[#0E1022] to-[#0A0D17] p-6 lg:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>CENTRAL GOVERNANCE ENGINE · ROOT PRIVILEGES</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-display">
              کنسول حاکمیت مرکزی و مانیتورینگ سیستم
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              مدیریت یکپارچه چرخه حیات کاربران، کدهای دعوت، ماتریس دسترسی RBAC، پایش الگوریتم‌های ترید و تسویه
              نقدینگی خزانه‌داری پلتفرم Nexorina.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              سلامت سامانه: ۹۹.۹۸٪ پایدار
            </span>
          </div>
        </div>
      </div>

      {/* 9 Core Vital Metrics in Persian */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            شاخص‌های حیاتی و وضعیت لحظه‌ای پلتفرم (Platform Vital Telemetry)
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">زنده · داده‌های همگام</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Users */}
          <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0B0F19] hover:border-indigo-500/30 transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">کاربران ثبت‌نام‌شده</span>
              <Users className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">۱۲,۴۸۰</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">+۸.۴٪ رشد ماهانه (KYC تاییدشده)</div>
          </div>

          {/* Card 2: Active Invitations */}
          <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0B0F19] hover:border-indigo-500/30 transition-all cursor-pointer" onClick={() => onNavigateAdmin('admin-invitations')}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">کدهای دعوت فعال</span>
              <KeyRound className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">{activeInvCount} <span className="text-xs text-slate-500 font-normal">کد مجاز</span></div>
            <div className="text-[11px] text-indigo-400 font-mono mt-1">مدیریت سقف و ابطال کدهای دعوت ←</div>
          </div>

          {/* Card 3: Audit Trail */}
          <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0B0F19] hover:border-indigo-500/30 transition-all cursor-pointer" onClick={() => onNavigateAdmin('admin-audit')}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">رویدادهای ممیزی (Audit Log)</span>
              <FileCheck2 className="h-4 w-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">۱,۲4۰ <span className="text-xs text-slate-500 font-normal">رکورد ممیزی</span></div>
            <div className="text-[11px] text-rose-400 font-mono mt-1">ثبت ۱۰۰٪ عملیات‌های حساس ←</div>
          </div>

          {/* Card 4: Mining */}
          <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0B0F19]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">هش‌ریت فعال ماینینگ</span>
              <Cpu className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">۴۵۰.۲ <span className="text-xs text-slate-500 font-normal">TH/s</span></div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">۸۴۰ ریگ فعال در استخر ابری</div>
          </div>

          {/* Card 5: Trading */}
          <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0B0F19]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">حجم معاملات الگوریتمی</span>
              <LineChart className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">$۲,۴۵۰,۸۰۰</div>
            <div className="text-[11px] text-emerald-400 font-mono mt-1">۱,۸۹۰ موقعیت فعال ترید ربات</div>
          </div>

          {/* Card 6: Treasury */}
          <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0B0F19]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400">موجودی خزانه‌داری پلتفرم</span>
              <Wallet className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white">$۸,۹۲۰,۰۰۰</div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">پشتوانه وثیقه‌گذاری چندامضایی</div>
          </div>
        </div>
      </div>

      {/* Quick Governance Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => onNavigateAdmin('admin-invitations')}
          className="p-4 rounded-xl border border-white/[0.08] bg-[#0B0F19] hover:bg-white/[0.03] text-right flex items-center justify-between group transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">صدور و مدیریت کدهای دعوت</div>
              <div className="text-[11px] text-slate-400 mt-0.5">کنترل ورود کاربران جدید و سقف ظرفیت</div>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
        </button>

        <button
          onClick={() => onNavigateAdmin('admin-rbac')}
          className="p-4 rounded-xl border border-white/[0.08] bg-[#0B0F19] hover:bg-white/[0.03] text-right flex items-center justify-between group transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">مدیریت سطوح دسترسی (RBAC)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">ماتریس مجوزها و شبیه‌ساز نقش‌ها</div>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
        </button>

        <button
          onClick={() => onNavigateAdmin('admin-audit')}
          className="p-4 rounded-xl border border-white/[0.08] bg-[#0B0F19] hover:bg-white/[0.03] text-right flex items-center justify-between group transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">دفترکل لاگ حسابرسی (Audit Trail)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">مشاهده قبل/بعد تغییرات حساس مدیریتی</div>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-slate-500 group-hover:text-white transition-colors" />
        </button>
      </div>

      {/* Recent Sensitive Administrative Actions Preview */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F19] p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileCheck2 className="h-4 w-4 text-rose-400" />
            <h3 className="text-xs font-bold text-white font-mono uppercase">
              آخرین رویدادهای ممیزی و تغییرات حساس (Recent Audit Logs)
            </h3>
          </div>
          <button
            onClick={() => onNavigateAdmin('admin-audit')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-mono"
          >
            مشاهده تمام لاگ‌های ممیزی ←
          </button>
        </div>

        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl border border-white/[0.04] bg-white/[0.01] hover:bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] text-slate-500">{log.timestamp}</span>
                <span className="font-bold text-white">{log.adminName}</span>
                <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                  {log.adminRole}
                </span>
                <span className="text-slate-300 font-medium">{log.actionTitleFa}</span>
              </div>
              <div className="flex items-center gap-3 font-mono text-[11px]">
                <span className="text-slate-400 truncate max-w-xs">{log.target}</span>
                <span className="text-emerald-400 font-bold">{log.result}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
