import React, { useState } from 'react';
import { Share2, Plus, CheckCircle, Search, Megaphone, Users, Award } from 'lucide-react';
import { adminApi } from '../../backend/api/adminApi';

export const AdminSocialGrowthPage: React.FC = () => {
  const [bountyPerFollower, setBountyPerFollower] = useState('0.05');
  const [notice, setNotice] = useState<string | null>(null);

  const handleUpdate = () => {
    adminApi.recordSensitiveAction({
      action: 'REWARD_OVERRIDE',
      actionTitleFa: 'بروزرسانی نرخ پاداش رشد شبکه‌های اجتماعی',
      target: 'Social Growth Reward Engine',
      previousValue: 'پاداش هر عضو: ۰.۰۳$',
      newValue: `پاداش هر عضو: ${bountyPerFollower}$`,
    });
    setNotice('نرخ پاداش شبکه‌های اجتماعی با موفقیت بروزرسانی و در لاگ ممیزی ثبت شد.');
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {notice && (
        <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-950/40 text-xs text-indigo-200 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* Header */}
      <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0B0F19]">
        <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
          <Share2 className="h-3.5 w-3.5" />
          <span>COMMUNITY GROWTH & VIRAL ENGAGEMENT GOVERNANCE</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-display">
          مدیریت رشد شبکه‌های اجتماعی و کمپین‌های وایرال
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          نظارت بر ماموریت‌های تلگرام، دیسکورد و توییتر، تایید خودکار اعتبارات شبکه، و تعیین نرخ پاداش عضویت
          کامیونیتی برای کاربران پلتفرم.
        </p>
      </div>

      <div className="p-5 rounded-2xl border border-white/[0.08] bg-[#0B0F19] max-w-xl space-y-4">
        <div>
          <label className="text-xs text-slate-300 block mb-1">
            نرخ پاداش به ازای هر تعامل تاییدشده کاربر ($ USD):
          </label>
          <input
            type="text"
            value={bountyPerFollower}
            onChange={(e) => setBountyPerFollower(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
          />
        </div>

        <button
          onClick={handleUpdate}
          className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors"
        >
          ذخیره نرخ پاداش و ثبت در Audit Log
        </button>
      </div>
    </div>
  );
};
