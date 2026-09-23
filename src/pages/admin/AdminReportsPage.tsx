import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Coins,
  Cpu,
  LineChart,
  Megaphone,
  Dices,
  Calendar,
  Download,
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');

  const reportMetrics = [
    { titleFa: 'حجم کل ناخالص اکوسیستم', value: '$۲۴,۸۹۲,۱۰۰', change: '+۱۸.۴٪', isPositive: true },
    { titleFa: 'درآمد خالص پروتکل پلتفرم', value: '$۳۸۲,۴۱۰', change: '+۱۲.۱٪', isPositive: true },
    { titleFa: 'مجموع پاداش‌های تسویه‌شده', value: '$۲۴۸,۹۲۰', change: '+۹.۳٪', isPositive: true },
    { titleFa: 'جذب کاربران جدید با کد دعوت', value: '۳,۴۱۲ حساب', change: '+۲۴.۵٪', isPositive: true },
  ];

  const breakdownData = [
    { moduleFa: 'استخراج ابری و کلاد ماینینگ', share: '۳۸٪', volume: '$۹,۴۵۸,۹۹۸', icon: Cpu, color: '#6366F1' },
    { moduleFa: 'دستورات و ربات‌های ترید هوش مصنوعی', share: '۳۲٪', volume: '$۷,۹۶۵,۴۷۲', icon: LineChart, color: '#06B6D4' },
    { moduleFa: 'کمپین‌های اسپانسری و شرکای تجاری', share: '۱۸٪', volume: '$۴,۴۸۰,۵۷۸', icon: Megaphone, color: '#A855F7' },
    { moduleFa: 'بازی‌های تفریحی منصفانه (RNG)', share: '۱۲٪', volume: '$۲,۹۸۷,۰۵۲', icon: Dices, color: '#EC4899' },
  ];

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-white/[0.08] bg-[#0B0F19]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>CROSS-MODULE ANALYTICS & REVENUE TELEMETRY</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            گزارش‌های جامع و هوش تجاری پلتفرم
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            تحلیل چندبعدی نرخ رشد کاربران، درآمد پروتکل، عملکرد هش‌ریت ماینینگ، و بازدهی کمپین‌های مشارکتی.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl font-mono">
            {(['7D', '30D', '90D', '1Y'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  timeRange === r
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={() => alert('گزارش تحلیلی به فرمت CSV آماده دانلود شد.')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-slate-300 hover:text-white transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>خروجی اکسل</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportMetrics.map((m, idx) => (
          <div key={idx} className="p-5 rounded-2xl border border-white/[0.08] bg-[#0B0F19]">
            <span className="text-xs text-slate-400 block mb-1">{m.titleFa}</span>
            <span className="text-2xl font-bold font-mono text-white block">{m.value}</span>
            <span className="text-[11px] text-emerald-400 font-mono mt-1 block">{m.change} نسبت به دوره قبل</span>
          </div>
        ))}
      </div>

      {/* Module Share Breakdown */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F19] p-6 space-y-4">
        <h2 className="text-sm font-bold text-white">سهم ماژول‌ها در نقدینگی و فعالیت سامانه</h2>
        <div className="space-y-4">
          {breakdownData.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-indigo-400" />
                    <span className="text-white font-medium">{b.moduleFa}</span>
                  </div>
                  <div className="font-mono text-slate-300">
                    <span className="font-bold text-white">{b.share}</span> ({b.volume})
                  </div>
                </div>
                <div className="w-full bg-white/[0.04] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: b.share.replace('٪', '%'),
                      backgroundColor: b.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
