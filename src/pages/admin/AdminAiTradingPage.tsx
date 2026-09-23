import React, { useState } from 'react';
import { Sparkles, Bot, ShieldCheck, CheckCircle2, TrendingUp, Sliders } from 'lucide-react';
import { adminApi } from '../../backend/api/adminApi';

export const AdminAiTradingPage: React.FC = () => {
  const [modelConfidence, setModelConfidence] = useState('85');
  const [maxLeverage, setMaxLeverage] = useState('10');
  const [circuitBreaker, setCircuitBreaker] = useState('12.5');
  const [notice, setNotice] = useState<string | null>(null);

  const handleSaveParameters = () => {
    adminApi.recordSensitiveAction({
      action: 'SYSTEM_PARAMETER_UPDATE',
      actionTitleFa: 'بروزرسانی پارامترهای موتور هوش مصنوعی ترید',
      target: 'AI Trading Quantitative Engine Models',
      previousValue: 'آستانه اطمینان مدل: ۸۰٪ | حداکثر لوریج: ۲۰x',
      newValue: `آستانه اطمینان مدل: ${modelConfidence}٪ | حداکثر لوریج: ${maxLeverage}x | قطع‌کننده دراوداون: ${circuitBreaker}٪`,
    });

    setNotice('تنظیمات موتور هوش مصنوعی با موفقیت ثبت و در لاگ حسابرسی ذخیره شد.');
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {notice && (
        <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-950/40 text-xs text-indigo-200 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0B0F19]">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <Sparkles className="h-3.5 w-3.5" />
          <span>QUANTITATIVE NEURAL ENGINE & SIGNAL GOVERNANCE</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-display">
          مدیریت معاملات هوش مصنوعی و ربات‌های خودکار (AI Trading & Bots)
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          کنترل فیلترهای ریسک سیگنال‌های تولیدی هوش مصنوعی، تنظیم حدود استاپ‌لاس جهانی و نظارت بر موقعیت‌های
          تعهدی باز ربات‌های اتوماتیک در پلتفرم.
        </p>
      </div>

      {/* Parameters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0B0F19] space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>حداقل ضریب اطمینان مدل (Confidence)</span>
            <span className="font-mono text-cyan-400 font-bold">{modelConfidence}%</span>
          </div>
          <input
            type="range"
            min="60"
            max="95"
            value={modelConfidence}
            onChange={(e) => setModelConfidence(e.target.value)}
            className="w-full accent-cyan-400"
          />
          <p className="text-[11px] text-slate-500">
            سیگنال‌هایی با نرخ اطمینان کمتر از این درصد برای کاربران منتشر نخواهد شد.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0B0F19] space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>سقف اهرم مجاز ربات‌ها (Max Leverage)</span>
            <span className="font-mono text-indigo-400 font-bold">{maxLeverage}x</span>
          </div>
          <input
            type="range"
            min="2"
            max="50"
            value={maxLeverage}
            onChange={(e) => setMaxLeverage(e.target.value)}
            className="w-full accent-indigo-500"
          />
          <p className="text-[11px] text-slate-500">
            محدودیت محافظتی برای جلوگیری از لیکوئید شدن سرمایه کاربران در نوسانات شدید بازار.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0B0F19] space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>قطع‌کننده اضطراری ریزش (Circuit Breaker)</span>
            <span className="font-mono text-rose-400 font-bold">{circuitBreaker}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="25"
            step="0.5"
            value={circuitBreaker}
            onChange={(e) => setCircuitBreaker(e.target.value)}
            className="w-full accent-rose-500"
          />
          <p className="text-[11px] text-slate-500">
            در صورت افت سرمایه بیش از این درصد، تمام ربات‌ها فوراً به حالت نقد (Cash Out) تبدیل می‌شوند.
          </p>
        </div>
      </div>

      <div className="flex justify-end p-4 rounded-2xl border border-white/[0.08] bg-[#0B0F19]">
        <button
          onClick={handleSaveParameters}
          className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-lg shadow-cyan-600/30 transition-colors"
        >
          ذخیره پارامترها و ثبت در لاگ ممیزی
        </button>
      </div>
    </div>
  );
};
