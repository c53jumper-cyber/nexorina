import React, { useState } from 'react';
import {
  Dices,
  Sliders,
  CheckCircle,
  PlusCircle,
  Edit,
  Power,
  BarChart,
  Users,
} from 'lucide-react';
import { CASINO_GAMES } from '../../data/mockData';
import { CasinoGame } from '../../types';
import { Modal } from '../../components/common/Modal';
import { adminApi } from '../../backend/api/adminApi';

export const AdminCasinoPage: React.FC = () => {
  const [games, setGames] = useState<CasinoGame[]>(CASINO_GAMES);
  const [editingGame, setEditingGame] = useState<CasinoGame | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleToggleStatus = (id: string) => {
    setGames((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const next = g.status === 'Active' ? 'Maintenance' : 'Active';
          adminApi.recordSensitiveAction({
            action: 'SYSTEM_PARAMETER_UPDATE',
            actionTitleFa: 'تغییر وضعیت دسترسی بازی کازینو',
            target: `بازی: ${g.name} (${id})`,
            previousValue: `وضعیت: ${g.status}`,
            newValue: `وضعیت: ${next}`,
          });
          setNotice(`وضعیت بازی "${g.name}" به "${next === 'Active' ? 'فعال' : 'در دست تعمیر'}" تغییر یافت.`);
          setTimeout(() => setNotice(null), 3000);
          return { ...g, status: next as any };
        }
        return g;
      })
    );
  };

  const handleSaveGameSettings = () => {
    if (!editingGame) return;
    setGames((prev) => prev.map((g) => (g.id === editingGame.id ? editingGame : g)));
    adminApi.recordSensitiveAction({
      action: 'SYSTEM_PARAMETER_UPDATE',
      actionTitleFa: 'تنظیم ضریب بازگشت سرمایه بازی (RTP)',
      target: `بازی: ${editingGame.name}`,
      previousValue: 'None',
      newValue: `نرخ RTP: ${editingGame.rtp} | بازیکنان فعال: ${editingGame.playersCount}`,
    });
    setEditingGame(null);
    setNotice('تنظیمات بازی با موفقیت ذخیره و در لاگ ممیزی ثبت شد.');
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
      <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#0B0F19]">
        <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
          <Dices className="h-3.5 w-3.5" />
          <span>PROVABLY FAIR RNG ENGINE & GAME REGULATION</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white font-display">
          مدیریت بازی‌های سرگرمی و کازینو (RNG Governance)
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          تنظیم ضرایب بازگشت سرمایه عادلانه (Provably Fair RTP)، فعال‌سازی یا توقف بازی‌ها و نظارت بر سقف مبالغ شرط‌بندی.
        </p>
      </div>

      {/* Games Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F19] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-white/[0.02] border-b border-white/[0.06] text-slate-400 font-mono text-[11px]">
              <tr>
                <th className="px-4 py-3">نام بازی</th>
                <th className="px-4 py-3">دسته‌بندی</th>
                <th className="px-4 py-3">نرخ بازگشت (RTP)</th>
                <th className="px-4 py-3">کاربران فعال</th>
                <th className="px-4 py-3">وضعیت</th>
                <th className="px-4 py-3 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {games.map((g) => (
                <tr key={g.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-bold text-white font-sans">{g.name}</td>
                  <td className="px-4 py-3 text-slate-400">{g.category}</td>
                  <td className="px-4 py-3 font-mono text-emerald-400 font-bold">{g.rtp}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">
                    {g.playersCount.toLocaleString()} کاربر
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        g.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {g.status === 'Active' ? 'فعال' : 'تعمیر'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-left font-sans">
                    <div className="flex items-center gap-1.5 justify-end">
                      <button
                        onClick={() => setEditingGame(g)}
                        className="px-2.5 py-1 rounded-lg text-xs bg-white/[0.04] text-slate-300 hover:text-white"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => handleToggleStatus(g.id)}
                        className="px-2.5 py-1 rounded-lg text-xs bg-white/[0.04] text-slate-300 hover:text-white"
                      >
                        {g.status === 'Active' ? 'توقف' : 'فعال‌سازی'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingGame && (
        <Modal
          isOpen={!!editingGame}
          onClose={() => setEditingGame(null)}
          title={`تنظیمات بازی: ${editingGame.name}`}
        >
          <div className="space-y-4 text-xs text-right font-sans" dir="rtl">
            <div>
              <label className="text-xs text-slate-300 block mb-1">
                ضریب بازگشت سرمایه منصفانه (RTP %):
              </label>
              <input
                type="text"
                value={editingGame.rtp}
                onChange={(e) => setEditingGame({ ...editingGame, rtp: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">تعداد بازیکنان فعال:</label>
              <input
                type="number"
                value={editingGame.playersCount}
                onChange={(e) => setEditingGame({ ...editingGame, playersCount: Number(e.target.value) })}
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingGame(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/[0.05]"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleSaveGameSettings}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white"
              >
                ذخیره تنظیمات
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
