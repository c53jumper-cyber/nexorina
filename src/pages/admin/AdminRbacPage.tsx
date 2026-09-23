import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  KeyRound,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { SYSTEM_ROLES_CONFIG } from '../../backend/permissions/rbac';
import { authService } from '../../backend/auth/authService';
import { adminApi } from '../../backend/api/adminApi';
import { SystemRole, SystemResource } from '../../shared/types/rbac';

export const AdminRbacPage: React.FC = () => {
  const [activeRole, setActiveRole] = useState<SystemRole>(() => authService.getCurrentRole());
  const [selectedRoleForDetail, setSelectedRoleForDetail] = useState<SystemRole>('Admin');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSwitchActiveRole = (newRole: SystemRole) => {
    authService.setRole(newRole);
    setActiveRole(newRole);
    adminApi.recordSensitiveAction({
      action: 'PERMISSION_MODIFIED',
      actionTitleFa: 'تغییر نقش فعال سشن اپراتور',
      target: `شبیه‌ساز نقش‌ها: سشن به ${newRole} تغییر یافت`,
      previousValue: `نقش قبلی: ${activeRole}`,
      newValue: `نقش فعال جدید: ${newRole}`,
    });
    showToast(`نقش فعال سشن با موفقیت به [${newRole}] تغییر یافت و در لاگ ممیزی ثبت شد.`);
  };

  const roleConfig = SYSTEM_ROLES_CONFIG[selectedRoleForDetail];

  const allResources: { key: SystemResource; labelFa: string }[] = [
    { key: 'dashboard', labelFa: 'داشبورد مدیریتی' },
    { key: 'users', labelFa: 'مدیریت کاربران' },
    { key: 'invitations', labelFa: 'مدیریت کدهای دعوت' },
    { key: 'rbac', labelFa: 'تنظیمات نقش‌ها و RBAC' },
    { key: 'audit', labelFa: 'لاگ حسابرسی و ممیزی' },
    { key: 'mining', labelFa: 'مدیریت ماینینگ و کلاد' },
    { key: 'trader', labelFa: 'مدیریت ترید و تسک‌ها' },
    { key: 'ai_trading', labelFa: 'معاملات هوش مصنوعی' },
    { key: 'ai_bots', labelFa: 'ربات‌های الگوریتمی' },
    { key: 'campaigns', labelFa: 'مدیریت کمپین‌ها' },
    { key: 'social_growth', labelFa: 'رشد شبکه‌های اجتماعی' },
    { key: 'casino', labelFa: 'مدیریت کازینو و بازی‌ها' },
    { key: 'wallet', labelFa: 'خزانه‌داری و کیف‌پول' },
    { key: 'rewards', labelFa: 'تخصیص و تسویه پاداش‌ها' },
    { key: 'transactions', labelFa: 'دفتر کل تراکنش‌ها' },
    { key: 'reports', labelFa: 'گزارش‌ها و تحلیل داده' },
    { key: 'settings', labelFa: 'تنظیمات پروتکل' },
  ];

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-500/40 bg-[#0C1024]/95 px-4 py-3 text-xs text-white shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span className="font-sans">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-white/[0.08] bg-gradient-to-l from-indigo-950/30 via-[#0B0F19] to-transparent">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono text-indigo-400 font-semibold">
              RBAC · GRANULAR ACCESS CONTROL MATRIX
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            مدیریت سطوح دسترسی و ماتریس نقش‌ها (RBAC)
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            ساختار دسترسی سامانه Nexorina به صورت کنترل دسترسی مبتنی بر نقش (Role-Based Access Control)
            طراحی شده و تفکیک وظایف بین مدیر ارشد، مدیر مالی، کارشناس پشتیبانی و ناظر را به صورت قطعی تضمین می‌کند.
          </p>
        </div>

        {/* Live Active Session Badge */}
        <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-950/20 text-xs font-mono">
          <span className="text-slate-400 block text-[10px]">نقش فعال سشن فعلی شما:</span>
          <span className="text-emerald-400 font-bold text-sm block mt-0.5">{activeRole}</span>
        </div>
      </div>

      {/* Role Switcher Sandbox */}
      <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.03]">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span className="text-xs font-bold text-amber-300">
            محیط تست و شبیه‌ساز نقش‌ها (Live Role Switcher):
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          برای راستی‌آزمایی اعتبارسنجی سمت سرور و مسدودسازی دسترسی، می‌توانید نقش فعال سشن را تغییر دهید:
        </p>

        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {(Object.keys(SYSTEM_ROLES_CONFIG) as SystemRole[]).map((r) => (
            <button
              key={r}
              onClick={() => handleSwitchActiveRole(r)}
              className={`px-3 py-1.5 rounded-xl border transition-all ${
                activeRole === r
                  ? 'bg-indigo-600 border-indigo-400 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              {r} {r === 'User' && '(کاربر عادی - عدم دسترسی)'}
            </button>
          ))}
        </div>
      </div>

      {/* Role Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/[0.08]">
        {(Object.keys(SYSTEM_ROLES_CONFIG) as SystemRole[]).map((r) => (
          <button
            key={r}
            onClick={() => setSelectedRoleForDetail(r)}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
              selectedRoleForDetail === r
                ? 'bg-white/[0.08] text-white font-bold border border-white/[0.1]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
            }`}
          >
            {SYSTEM_ROLES_CONFIG[r].titleFa} ({r})
          </button>
        ))}
      </div>

      {/* Role Detail & Permissions Matrix */}
      <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0B0F19] space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-400" />
            <span>{roleConfig.titleFa}</span>
            <span className="text-xs font-mono text-slate-500">[{roleConfig.role}]</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">{roleConfig.descriptionFa}</p>
        </div>

        {selectedRoleForDetail === 'User' ? (
          <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/[0.05] text-xs text-rose-300 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
            <span>
              کاربران عادی هیچ‌گونه دسترسی به منابع پنل مدیریت ندارند. هرگونه تلاش برای ورود به مسیرهای مدیریتی در
              سمت بک‌اند بررسی و مسدود (403 Forbidden) می‌گردد.
            </span>
          </div>
        ) : (
          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            <table className="w-full text-right text-xs">
              <thead className="bg-white/[0.02] border-b border-white/[0.06] text-slate-400 font-mono text-[11px]">
                <tr>
                  <th className="px-4 py-2.5">منبع سامانه (Resource)</th>
                  <th className="px-4 py-2.5 text-center">مشاهده (Read)</th>
                  <th className="px-4 py-2.5 text-center">ویرایش و ایجاد (Write)</th>
                  <th className="px-4 py-2.5 text-center">حذف داده (Delete)</th>
                  <th className="px-4 py-2.5 text-center">تایید و امضا (Approve)</th>
                  <th className="px-4 py-2.5 text-center">ممیزی و لاگ (Audit)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {allResources.map((res) => {
                  const perm = roleConfig.permissions.find((p) => p.resource === res.key);
                  const isRead = perm?.actions.includes('read') ?? false;
                  const isWrite = perm?.actions.includes('write') ?? false;
                  const isDelete = perm?.actions.includes('delete') ?? false;
                  const isApprove = perm?.actions.includes('approve') ?? false;
                  const isAudit = perm?.actions.includes('audit') ?? false;

                  return (
                    <tr key={res.key} className="hover:bg-white/[0.01]">
                      <td className="px-4 py-2.5 font-sans font-medium text-white">
                        {res.labelFa}
                        <span className="block text-[10px] font-mono text-slate-500">
                          {res.key}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {isRead ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 mx-auto" />
                        ) : (
                          <span className="text-slate-600 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {isWrite ? (
                          <CheckCircle2 className="h-4 w-4 text-indigo-400 mx-auto" />
                        ) : (
                          <span className="text-slate-600 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {isDelete ? (
                          <CheckCircle2 className="h-4 w-4 text-rose-400 mx-auto" />
                        ) : (
                          <span className="text-slate-600 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {isApprove ? (
                          <CheckCircle2 className="h-4 w-4 text-amber-400 mx-auto" />
                        ) : (
                          <span className="text-slate-600 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {isAudit ? (
                          <CheckCircle2 className="h-4 w-4 text-teal-400 mx-auto" />
                        ) : (
                          <span className="text-slate-600 text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
