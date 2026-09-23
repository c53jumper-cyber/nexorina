import React, { useState } from 'react';
import {
  KeyRound,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Ban,
  Copy,
  Users,
  ShieldCheck,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { invitationService } from '../../backend/invitations/invitationService';
import { adminApi } from '../../backend/api/adminApi';
import { InvitationCode, InvitationStatus } from '../../shared/types/invitation';

export const AdminInvitationsPage: React.FC = () => {
  const [invitations, setInvitations] = useState<InvitationCode[]>(() => invitationService.getAll());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | InvitationStatus>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [customCode, setCustomCode] = useState('');
  const [usageLimit, setUsageLimit] = useState(10);
  const [expiryDays, setExpiryDays] = useState(30);
  const [notes, setNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard?.writeText?.(code);
    setCopiedId(id);
    showToast(`کد دعوت ${code} در کلیپ‌بورد کپی شد.`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + Number(expiryDays));

    const res = adminApi.createInvitation({
      code: customCode.trim() || undefined,
      usageLimit: Number(usageLimit),
      expiresAt: expiryDate.toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      notes: notes.trim() || undefined,
    });

    if (res.success && res.data) {
      setInvitations(invitationService.getAll());
      setIsCreateModalOpen(false);
      setCustomCode('');
      setNotes('');
      showToast(`کد دعوت جدید (${res.data.code}) با موفقیت ایجاد و در لاگ حسابرسی ثبت شد.`);
    } else {
      showToast(res.error?.messageFa || 'خطا در ثبت کد دعوت.');
    }
  };

  const handleToggleStatus = (id: string, currentStatus: InvitationStatus) => {
    const nextStatus: InvitationStatus = currentStatus === 'Active' ? 'Disabled' : 'Active';
    const res = adminApi.updateInvitationStatus(id, nextStatus);
    if (res.success) {
      setInvitations(invitationService.getAll());
      showToast(`وضعیت کد دعوت به ${nextStatus === 'Active' ? 'فعال' : 'غیرفعال'} تغییر یافت.`);
    }
  };

  const filteredInvitations = invitations.filter((inv) => {
    const matchesSearch =
      inv.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.creatorAdminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.notes && inv.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-6 z-50 flex items-center gap-3 rounded-2xl border border-indigo-500/40 bg-[#0C1024]/95 px-4 py-3 text-xs text-white shadow-2xl backdrop-blur-md">
          <KeyRound className="h-4 w-4 text-indigo-400" />
          <span className="font-sans">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-white/[0.08] bg-gradient-to-l from-indigo-950/30 via-[#0B0F19] to-transparent">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono text-indigo-400 font-semibold">
              GATEWAY ACCESS CONTROL · INVITATION GOVERNANCE
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            مدیریت کدهای دعوت و ثبت‌نام کاربران
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            سامانه Nexorina یک پلتفرم بسته مبتنی بر کد دعوت (Invitation Only) است. در این بخش می‌توانید کدهای
            دعوت جدید تولید کرده، سقف استفاده کاربران را تعیین و کدهای منقضی را باطل نمایید.
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
          className="shadow-lg shadow-indigo-600/30 shrink-0"
        >
          ایجاد کد دعوت جدید
        </Button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#0B0F19]">
          <span className="text-slate-400 block text-[11px]">مجموع کدهای صادرشده</span>
          <span className="text-xl font-bold text-white block mt-1">{invitations.length}</span>
        </div>
        <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#0B0F19]">
          <span className="text-slate-400 block text-[11px]">کدهای فعال (Active)</span>
          <span className="text-xl font-bold text-emerald-400 block mt-1">
            {invitations.filter((i) => i.status === 'Active').length}
          </span>
        </div>
        <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#0B0F19]">
          <span className="text-slate-400 block text-[11px]">تکمیل‌شده (Used Up)</span>
          <span className="text-xl font-bold text-indigo-400 block mt-1">
            {invitations.filter((i) => i.status === 'Used Up').length}
          </span>
        </div>
        <div className="p-3.5 rounded-xl border border-white/[0.08] bg-[#0B0F19]">
          <span className="text-slate-400 block text-[11px]">غیرفعال / منقضی</span>
          <span className="text-xl font-bold text-amber-400 block mt-1">
            {invitations.filter((i) => i.status === 'Disabled' || i.status === 'Expired').length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-white/[0.06] bg-[#0B0F19]">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی کد، مدیر ایجادکننده یا یادداشت..."
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto text-xs font-mono">
          {(['all', 'Active', 'Used Up', 'Expired', 'Disabled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {st === 'all'
                ? 'همه'
                : st === 'Active'
                ? 'فعال'
                : st === 'Used Up'
                ? 'تکمیل‌شده'
                : st === 'Expired'
                ? 'منقضی'
                : 'غیرفعال'}
            </button>
          ))}
        </div>
      </div>

      {/* Invitations Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F19] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-mono text-[11px]">
              <tr>
                <th className="px-4 py-3">کد دعوت (Token)</th>
                <th className="px-4 py-3">وضعیت</th>
                <th className="px-4 py-3">ظرفیت استفاده</th>
                <th className="px-4 py-3">مدیر صادرکننده</th>
                <th className="px-4 py-3">تاریخ انقضا</th>
                <th className="px-4 py-3">یادداشت</th>
                <th className="px-4 py-3 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-mono">
              {filteredInvitations.map((inv) => (
                <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white tracking-wider">{inv.code}</span>
                      <button
                        onClick={() => handleCopyCode(inv.code, inv.id)}
                        className="text-slate-400 hover:text-indigo-400 transition-colors"
                        title="کپی کد"
                      >
                        {copiedId === inv.id ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        inv.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : inv.status === 'Used Up'
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                          : inv.status === 'Expired'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-white/[0.05] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-indigo-500 h-full rounded-full"
                          style={{ width: `${(inv.usedCount / inv.usageLimit) * 100}%` }}
                        />
                      </div>
                      <span className="text-slate-300">
                        {inv.usedCount} از {inv.usageLimit} ({inv.remainingCount} باقی‌مانده)
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-300 font-sans text-xs">
                    {inv.creatorAdminName}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-[11px]">{inv.expiresAt}</td>
                  <td className="px-4 py-3 text-slate-400 font-sans text-xs max-w-xs truncate">
                    {inv.notes || '—'}
                  </td>
                  <td className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1.5 justify-end">
                      <button
                        onClick={() => handleToggleStatus(inv.id, inv.status)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] transition-colors ${
                          inv.status === 'Active'
                            ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20'
                        }`}
                      >
                        {inv.status === 'Active' ? 'غیرفعال‌سازی' : 'فعال‌سازی مجدد'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Invitation */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#0C1020] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">صدور کد دعوت جدید</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  کد اختصاصی (اختیاری - در صورت خالی بودن خودکار تولید می‌شود):
                </label>
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                  placeholder="مثلاً: VIP-ALPHA-2026"
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">سقف تعداد مجاز ثبت‌نام:</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">مدت اعتبار (روز):</label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(Number(e.target.value))}
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">یادداشت اداری و هدف تخصیص:</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="مثلاً: تخصیص برای گروه سرمایه‌گذاران بتا"
                  className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  انصراف
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  ثبت و صدور کد دعوت
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
