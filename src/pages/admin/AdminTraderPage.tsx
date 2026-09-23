import React, { useState } from 'react';
import {
  LineChart,
  PlusCircle,
  Clock,
  Coins,
  CheckCircle,
  Sliders,
  Trash2,
  Sparkles,
  Bot,
} from 'lucide-react';
import { TRADER_DAILY_TASKS } from '../../data/mockData';
import { TraderTask } from '../../types';
import { Modal } from '../../components/common/Modal';
import { adminApi } from '../../backend/api/adminApi';

export const AdminTraderPage: React.FC = () => {
  const [tasks, setTasks] = useState<TraderTask[]>(TRADER_DAILY_TASKS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newAsset, setNewAsset] = useState('BTC');
  const [newReward, setNewReward] = useState('0.0025 BTC');
  const [newDuration, setNewDuration] = useState('04h 00m');
  const [notice, setNotice] = useState<string | null>(null);

  const handleToggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const next = t.status === 'Completed' ? 'Available' : 'Completed';
          adminApi.recordSensitiveAction({
            action: 'SYSTEM_PARAMETER_UPDATE',
            actionTitleFa: 'بروزرسانی تسک تریدینگ روزانه',
            target: `تسک: ${t.taskName}`,
            previousValue: `وضعیت: ${t.status}`,
            newValue: `وضعیت: ${next}`,
          });
          setNotice(`وضعیت تسک "${t.taskName}" تغییر یافت.`);
          setTimeout(() => setNotice(null), 3000);
          return { ...t, status: next as any };
        }
        return t;
      })
    );
  };

  const handleCreateTask = () => {
    if (!newTaskName) return;
    const newTask: TraderTask = {
      id: `task-${Date.now()}`,
      asset: newAsset,
      taskName: newTaskName,
      duration: newDuration,
      status: 'Available',
      reward: newReward,
      rewardUsd: 150.0,
      progress: 0,
      difficulty: 'Medium',
    };

    adminApi.recordSensitiveAction({
      action: 'SYSTEM_PARAMETER_UPDATE',
      actionTitleFa: 'ایجاد تسک ترید جدید برای کاربران',
      target: `تسک جدید: ${newTaskName}`,
      previousValue: 'None',
      newValue: `ارز: ${newAsset} | پاداش: ${newReward}`,
    });

    setTasks([...tasks, newTask]);
    setIsCreateOpen(false);
    setNewTaskName('');
    setNotice(`تسک ترید جدید "${newTask.taskName}" با موفقیت منتشر شد.`);
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
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 mb-1">
            <LineChart className="h-3.5 w-3.5" />
            <span>ALGORITHMIC TRADING ENGINE & BOT SUPERVISION</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            مدیریت معاملات، تسک‌ها و سیگنال‌های ترید
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            تعریف تسک‌های تحلیلی و شبیه‌سازی بازار برای کاربران، پایش عملکرد ربات‌های DCA و گرید، و تنظیم
            سیگنال‌های هوش مصنوعی.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-colors flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>تعریف تسک ترید جدید</span>
        </button>
      </div>

      {/* Tasks Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F19] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-white/[0.02] border-b border-white/[0.06] text-slate-400 font-mono text-[11px]">
              <tr>
                <th className="px-4 py-3">نام و شرح تسک</th>
                <th className="px-4 py-3">دارایی مربوطه</th>
                <th className="px-4 py-3">مدت زمان</th>
                <th className="px-4 py-3">پاداش تسویه</th>
                <th className="px-4 py-3">وضعیت انتشار</th>
                <th className="px-4 py-3 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {tasks.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-medium text-white font-sans">{t.taskName}</td>
                  <td className="px-4 py-3 font-mono font-bold text-indigo-400">{t.asset}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{t.duration}</td>
                  <td className="px-4 py-3 font-mono text-emerald-400 font-bold">{t.reward}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        t.status === 'Completed'
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {t.status === 'Completed' ? 'تکمیل‌شده' : 'در دسترس'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-left font-sans">
                    <button
                      onClick={() => handleToggleTaskStatus(t.id)}
                      className="px-3 py-1 rounded-lg text-xs bg-white/[0.05] border border-white/[0.1] text-slate-300 hover:text-white hover:bg-white/[0.1]"
                    >
                      تغییر وضعیت
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Task */}
      {isCreateOpen && (
        <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="تعریف تسک ترید روزانه">
          <div className="space-y-4 text-xs text-right font-sans" dir="rtl">
            <div>
              <label className="text-xs text-slate-300 block mb-1">عنوان تسک:</label>
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="مثلاً: تحلیل عمق بازار BTC و ثبت موقعیت تعهدی"
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">نماد دارایی:</label>
                <input
                  type="text"
                  value={newAsset}
                  onChange={(e) => setNewAsset(e.target.value.toUpperCase())}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">میزان پاداش:</label>
                <input
                  type="text"
                  value={newReward}
                  onChange={(e) => setNewReward(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
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
                onClick={handleCreateTask}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950"
              >
                ثبت و انتشار تسک
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
