import React, { useState } from 'react';
import {
  Cpu,
  PlusCircle,
  Edit,
  Power,
  Sliders,
  Coins,
  CheckCircle,
  Activity,
  Layers,
} from 'lucide-react';
import { Miner } from '../../types';
import { Modal } from '../../components/common/Modal';
import { adminApi } from '../../backend/api/adminApi';

interface AdminMiningPageProps {
  miners: Miner[];
}

export const AdminMiningPage: React.FC<AdminMiningPageProps> = ({ miners: initialMiners }) => {
  const [minersList, setMinersList] = useState<Miner[]>(initialMiners);
  const [isAddMinerOpen, setIsAddMinerOpen] = useState(false);
  const [editingMiner, setEditingMiner] = useState<Miner | null>(null);

  const [newMinerName, setNewMinerName] = useState('');
  const [newMinerPower, setNewMinerPower] = useState('450 TH/s');
  const [newMinerRewardRate, setNewMinerRewardRate] = useState('0.0015 BTC / day');
  const [newMinerLevel, setNewMinerLevel] = useState(4);

  const [notice, setNotice] = useState<string | null>(null);

  const handleToggleMinerStatus = (id: string) => {
    setMinersList((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const next = m.status === 'active' ? 'paused' : 'active';
          adminApi.recordSensitiveAction({
            action: 'SYSTEM_PARAMETER_UPDATE',
            actionTitleFa: 'تغییر وضعیت ریگ ماینینگ ابری',
            target: `ریگ: ${m.name} (${id})`,
            previousValue: `وضعیت: ${m.status}`,
            newValue: `وضعیت: ${next}`,
          });
          setNotice(`وضعیت ریگ ماینینگ "${m.name}" به "${next === 'active' ? 'فعال' : 'متوقف'}" تغییر یافت.`);
          setTimeout(() => setNotice(null), 3000);
          return { ...m, status: next };
        }
        return m;
      })
    );
  };

  const handleAddMiner = () => {
    if (!newMinerName) return;
    const newM: Miner = {
      id: `miner-${Date.now()}`,
      name: newMinerName,
      power: newMinerPower,
      hashrateNumeric: parseInt(newMinerPower) || 300,
      status: 'active',
      rewardRate: newMinerRewardRate,
      uptime: '00d 01h 00m',
      level: Number(newMinerLevel),
      efficiency: '99.0%',
      dailyEstimateUsd: 85.0,
      supportedCoins: ['BTC', 'ETH', 'USDT'],
    };

    adminApi.recordSensitiveAction({
      action: 'SYSTEM_PARAMETER_UPDATE',
      actionTitleFa: 'افزودن کلاستر ماینینگ جدید',
      target: `ریگ جدید: ${newMinerName}`,
      previousValue: 'None',
      newValue: `ظرفیت: ${newMinerPower} | پاداش: ${newMinerRewardRate}`,
    });

    setMinersList((prev) => [newM, ...prev]);
    setIsAddMinerOpen(false);
    setNewMinerName('');
    setNotice(`کلاستر جدید "${newM.name}" با موفقیت اضافه شد.`);
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
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <Cpu className="h-3.5 w-3.5" />
            <span>CLOUD MINING FARM & STRATUM POOL INFRASTRUCTURE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            مدیریت زیرساخت و ریگ‌های ماینینگ
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            تعیین نرخ پاداش استخرها، مدیریت توزیع هش‌ریت کلاسترها، وضعیت پایداری استراتوم و تعریف سخت‌افزارهای جدید.
          </p>
        </div>

        <button
          onClick={() => setIsAddMinerOpen(true)}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-colors flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>افزودن کلاستر جدید</span>
        </button>
      </div>

      {/* Miners Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F19] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs font-mono">
            <thead className="bg-white/[0.02] border-b border-white/[0.06] text-slate-400 text-[11px]">
              <tr>
                <th className="px-4 py-3 font-sans">نام کلاستر ماینر</th>
                <th className="px-4 py-3">توان هش‌ریت</th>
                <th className="px-4 py-3">نرخ استخراج روزانه</th>
                <th className="px-4 py-3">سطح سخت‌افزار</th>
                <th className="px-4 py-3">وضعیت</th>
                <th className="px-4 py-3 text-left font-sans">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {minersList.map((m) => (
                <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-white font-sans">{m.name}</div>
                    <span className="text-[10px] text-slate-500">{m.id}</span>
                  </td>
                  <td className="px-4 py-3 text-amber-400 font-bold">{m.power}</td>
                  <td className="px-4 py-3 text-emerald-400">{m.rewardRate}</td>
                  <td className="px-4 py-3 text-slate-300">Level {m.level}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {m.status === 'active' ? 'فعال' : 'متوقف'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-left font-sans">
                    <button
                      onClick={() => handleToggleMinerStatus(m.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        m.status === 'active'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20'
                      }`}
                    >
                      {m.status === 'active' ? 'توقف موقت' : 'راه‌اندازی'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddMinerOpen && (
        <Modal
          isOpen={isAddMinerOpen}
          onClose={() => setIsAddMinerOpen(false)}
          title="افزودن کلاستر ماینینگ جدید"
        >
          <div className="space-y-4 text-xs text-right font-sans" dir="rtl">
            <div>
              <label className="text-xs text-slate-300 block mb-1">نام کلاستر ریگ:</label>
              <input
                type="text"
                value={newMinerName}
                onChange={(e) => setNewMinerName(e.target.value)}
                placeholder="مثلاً: Antminer S21 Hydro Cluster"
                className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-300 block mb-1">توان پردازشی (TH/s):</label>
                <input
                  type="text"
                  value={newMinerPower}
                  onChange={(e) => setNewMinerPower(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 block mb-1">نرخ پاداش روزانه:</label>
                <input
                  type="text"
                  value={newMinerRewardRate}
                  onChange={(e) => setNewMinerRewardRate(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddMinerOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-300 hover:bg-white/[0.05]"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleAddMiner}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950"
              >
                ثبت کلاستر
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
