import React, { useState } from 'react';
import {
  Megaphone,
  PlusCircle,
  Play,
  Pause,
  Users,
  Gift,
  CheckCircle,
  Calendar,
} from 'lucide-react';
import { CAMPAIGNS_LIST } from '../../data/mockData';
import { Campaign } from '../../types';
import { Modal } from '../../components/common/Modal';
import { adminApi } from '../../backend/api/adminApi';

export const AdminCampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS_LIST);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [newName, setNewName] = useState('');
  const [newPartner, setNewPartner] = useState('');
  const [newTarget, setNewTarget] = useState(2000);
  const [newRewardPool, setNewRewardPool] = useState('20,000 USDT');
  const [newRewardPerUser, setNewRewardPerUser] = useState('10 USDT');
  const [notice, setNotice] = useState<string | null>(null);

  const handleToggleStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const next = c.status === 'Active' ? 'Paused' : 'Active';
          adminApi.recordSensitiveAction({
            action: 'CAMPAIGN_STATUS_CHANGE',
            actionTitleFa: 'تغییر وضعیت کمپین مشارکت',
            target: `کمپین: ${c.name} (${id})`,
            previousValue: `وضعیت: ${c.status}`,
            newValue: `وضعیت: ${next}`,
          });
          setNotice(`وضعیت کمپین "${c.name}" به "${next === 'Active' ? 'فعال' : 'متوقف'}" تغییر یافت.`);
          setTimeout(() => setNotice(null), 3000);
          return { ...c, status: next as any };
        }
        return c;
      })
    );
  };

  const handleCreateCampaign = () => {
    if (!newName || !newPartner) return;
    const newC: Campaign = {
      id: `camp-${Date.now()}`,
      name: newName,
      partner: newPartner,
      targetUsers: Number(newTarget),
      currentUsers: 0,
      remainingCapacity: Number(newTarget),
      rewardPool: newRewardPool,
      rewardPoolUsd: 20000,
      rewardPerUser: newRewardPerUser,
      rewardPerUserUsd: 10,
      status: 'Active',
      startDate: '2026-09-22',
      endDate: '2026-10-31',
      description: `کمپین رسمی و مشارکتی با ${newPartner}.`,
      category: 'Web3 & Fintech',
    };

    adminApi.recordSensitiveAction({
      action: 'CAMPAIGN_STATUS_CHANGE',
      actionTitleFa: 'ایجاد و انتشار کمپین حمایتی جدید',
      target: `کمپین: ${newName} (همکار: ${newPartner})`,
      previousValue: 'None',
      newValue: `استخر پاداش: ${newRewardPool} | ظرفیت: ${newTarget} نفر`,
    });

    setCampaigns([newC, ...campaigns]);
    setIsCreateOpen(false);
    setNewName('');
    setNewPartner('');
    setNotice(`کمپین جدید "${newC.name}" با موفقیت منتشر شد.`);
    setTimeout(() => setNotice(null), 3000);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-white/[0.08] bg-[#0B0F19]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
            <Megaphone className="h-3.5 w-3.5" />
            <span>PARTNER ENGAGEMENT & SPONSOR REWARD DISBURSEMENT</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            مدیریت کمپین‌های تبلیغاتی و شرکا
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            راه‌اندازی ماموریت‌های حمایتی شرکای تجاری، تنظیم استخرهای پاداش توکن و پایش سقف مشارکت کاربران.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-colors flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>ایجاد کمپین جدید</span>
        </button>
      </div>

      {/* Campaigns Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F19] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-white/[0.02] border-b border-white/[0.06] text-slate-400 font-mono text-[11px]">
              <tr>
                <th className="px-4 py-3">نام کمپین</th>
                <th className="px-4 py-3">اسپانسر / همکار</th>
                <th className="px-4 py-3">استخر پاداش</th>
                <th className="px-4 py-3">پاداش هر کاربر</th>
                <th className="px-4 py-3">ظرفیت تکمیل‌شده</th>
                <th className="px-4 py-3">وضعیت</th>
                <th className="px-4 py-3 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium text-white font-sans">{c.name}</td>
                  <td className="px-4 py-3 font-mono text-indigo-400">{c.partner}</td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-400">{c.rewardPool}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{c.rewardPerUser}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">
                    {c.currentUsers} از {c.targetUsers} ({c.remainingCapacity} باقی‌مانده)
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        c.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {c.status === 'Active' ? 'فعال' : 'متوقف'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-left font-sans">
                    <button
                      onClick={() => handleToggleStatus(c.id)}
                      className="px-3 py-1 rounded-lg text-xs bg-white/[0.05] border border-white/[0.1] text-slate-300 hover:text-white hover:bg-white/[0.1]"
                    >
                      {c.status === 'Active' ? 'توقف کمپین' : 'فعال‌سازی مجدد'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="ایجاد کمپین تبلیغاتی جدید">
          <div className="space-y-4 text-xs text-right font-sans" dir="rtl">
            <div>
              <label className="text-xs text-slate-300 block mb-1">نام کمپین:</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="مثلاً: بونتی همکاری با سولانا ائتلاف دیفای"
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">نام شریک تجاری:</label>
                <input
                  type="text"
                  value={newPartner}
                  onChange={(e) => setNewPartner(e.target.value)}
                  placeholder="مثلاً: Solana Foundation"
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">سقف کاربران:</label>
                <input
                  type="number"
                  value={newTarget}
                  onChange={(e) => setNewTarget(Number(e.target.value))}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/[0.05]"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleCreateCampaign}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                ثبت و انتشار کمپین
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
