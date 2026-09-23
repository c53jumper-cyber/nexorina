import React, { useState } from 'react';
import {
  ShieldAlert,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Lock,
  Cpu,
  Coins,
  Flame,
  FileCheck2,
} from 'lucide-react';
import { adminApi } from '../../backend/api/adminApi';

export const AdminSettingsPage: React.FC = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [gasSponsorship, setGasSponsorship] = useState(true);
  const [platformFee, setPlatformFee] = useState('1.5');
  const [minWithdrawal, setMinWithdrawal] = useState('50.00');
  const [autoApproveLimit, setAutoApproveLimit] = useState('5000.00');
  const [notice, setNotice] = useState<string | null>(null);

  const handleSave = () => {
    // Audit Log recording
    adminApi.recordSensitiveAction({
      action: 'SYSTEM_PARAMETER_UPDATE',
      actionTitleFa: 'بروزرسانی پارامترهای پروتکل و خزانه‌داری',
      target: 'System Settings / Financial Parameters',
      previousValue: 'کارمزد: ۱.۵٪ | حداقل برداشت: ۵۰$ | سقف تایید خودکار: ۵,۰۰۰$',
      newValue: `کارمزد: ${platformFee}٪ | حداقل برداشت: ${minWithdrawal}$ | سقف تایید خودکار: ${autoApproveLimit}$ | وضعیت نگهداری: ${maintenanceMode ? 'فعال' : 'غیرفعال'}`,
    });

    setNotice('تنظیمات پروتکل با موفقیت ذخیره و تغییرات در لاگ حسابرسی (Audit Trail) ثبت شد.');
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-white/[0.08] bg-[#0B0F19]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400 mb-1">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>GLOBAL PROTOCOL GOVERNANCE & KILL-SWITCH CONTROLS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            تنظیمات کلان پروتکل و حاکمیت سیستم
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            فعال‌سازی حالت نگهداری اضطراری (Kill-Switch)، تعیین کارمزدهای شبکه، سقف تسویه خودکار خزانه‌داری و
            قوانین امنیتی جهانی پلتفرم.
          </p>
        </div>

        {notice && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 text-xs text-emerald-300">
            <CheckCircle className="h-4 w-4" />
            <span>{notice}</span>
          </div>
        )}
      </div>

      {/* Emergency Status Banner */}
      <div
        className={`rounded-2xl border p-5 transition-all ${
          maintenanceMode
            ? 'border-rose-500/50 bg-rose-950/20'
            : 'border-white/[0.08] bg-[#0B0F19]'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                maintenanceMode
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-emerald-500/10 text-emerald-400'
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                {maintenanceMode ? 'حالت نگهداری اضطراری فعال است (Maintenance Mode ON)' : 'سیستم در حالت عملیاتی نرمال است'}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {maintenanceMode
                  ? 'تمامی تراکنش‌ها و سفارشات ترید کاربران به صورت موقت متوقف شده است.'
                  : 'تمامی سرویس‌های ماینینگ، ترید هوش مصنوعی و خزانه‌داری در دسترس کامل هستند.'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setMaintenanceMode(!maintenanceMode)}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-colors shrink-0 ${
              maintenanceMode
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/30'
                : 'bg-white/[0.05] border border-white/[0.1] text-slate-300 hover:text-white hover:bg-white/[0.1]'
            }`}
          >
            {maintenanceMode ? 'غیرفعال‌سازی حالت نگهداری' : 'فعال‌سازی کلید اضطراری (Kill-Switch)'}
          </button>
        </div>
      </div>

      {/* Financial & Protocol Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Treasury Limits */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F19] p-5 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
            <Coins className="h-4 w-4 text-indigo-400" />
            <span>حدود مالی و پارامترهای خزانه‌داری</span>
          </h2>

          <div>
            <label className="text-xs text-slate-300 block mb-1">
              کارمزد پلتفرم برای معاملات و تسویه‌ها (%):
            </label>
            <input
              type="text"
              value={platformFee}
              onChange={(e) => setPlatformFee(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">
              حداقل مبلغ مجاز جهت برداشت کاربر ($ USD):
            </label>
            <input
              type="text"
              value={minWithdrawal}
              onChange={(e) => setMinWithdrawal(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">
              سقف تایید خودکار واریز/برداشت بدون نیاز به تایید دستی ($ USD):
            </label>
            <input
              type="text"
              value={autoApproveLimit}
              onChange={(e) => setAutoApproveLimit(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Security & Multi-Sig Rules */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F19] p-5 space-y-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-400" />
            <span>قوانین امنیتی و احراز هویت چندمرحله‌ای</span>
          </h2>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div>
              <div className="text-xs font-bold text-white">الزام احراز هویت دوعاملی (2FA) برای مدیران</div>
              <div className="text-[11px] text-slate-400 mt-0.5">ورود به پنل ادمین بدون کلید سخت‌افزاری مسدود است</div>
            </div>
            <span className="text-emerald-400 font-mono text-xs font-bold">اجباری (ON)</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div>
              <div className="text-xs font-bold text-white">حفاظت ضد نفوذ (Rate Limiting)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">محدودسازی حداکثر ۱۰۰ درخواست در دقیقه بر اساس IP</div>
            </div>
            <span className="text-emerald-400 font-mono text-xs font-bold">فعال (Active)</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div>
              <div className="text-xs font-bold text-white">پرداخت کارمزد شبکه (Gas Sponsorship)</div>
              <div className="text-[11px] text-slate-400 mt-0.5">پوشش هزینه گس تراکنش‌ها برای کاربران سطح VIP</div>
            </div>
            <input
              type="checkbox"
              checked={gasSponsorship}
              onChange={(e) => setGasSponsorship(e.target.checked)}
              className="h-4 w-4 rounded accent-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end p-4 rounded-2xl border border-white/[0.08] bg-[#0B0F19]">
        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-colors"
        >
          ذخیره تغییرات و ثبت در لاگ حسابرسی
        </button>
      </div>
    </div>
  );
};
