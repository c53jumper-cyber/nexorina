import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  UserX,
  Eye,
  Shield,
  Coins,
  Gift,
  ArrowLeftRight,
} from 'lucide-react';
import { ADMIN_USERS_LIST } from '../../data/mockData';
import { AdminUserRecord } from '../../types';
import { Modal } from '../../components/common/Modal';
import { adminApi } from '../../backend/api/adminApi';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUserRecord[]>(ADMIN_USERS_LIST);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'KYC Verified' | 'Suspended'>('All');
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = users.filter((u) => {
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    const matchesSearch =
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleToggleStatus = (id: string, newStatus: AdminUserRecord['status']) => {
    const targetUser = users.find((u) => u.id === id);
    const prevStatus = targetUser?.status || 'Unknown';

    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
    if (selectedUser?.id === id) {
      setSelectedUser((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    // Record in Audit Log
    adminApi.recordSensitiveAction({
      action: 'USER_STATUS_CHANGE',
      actionTitleFa: 'تغییر وضعیت دسترسی کاربر',
      target: `کاربر: ${targetUser?.username} (${id})`,
      previousValue: `وضعیت قبلی: ${prevStatus}`,
      newValue: `وضعیت جدید: ${newStatus}`,
    });

    setNotice(`وضعیت کاربر "${targetUser?.username}" به "${newStatus}" تغییر یافت و در لاگ حسابرسی ثبت گردید.`);
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Notice Banner */}
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
            <Users className="h-3.5 w-3.5" />
            <span>GLOBAL USER REGISTRY & KYC AUDIT</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            مدیریت و احراز هویت کاربران
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            بررسی پرونده‌های کاربری، وضعیت تایید هویت KYC، بالانس مالی حساب‌ها و کنترل سوسپند یا فعال‌سازی دسترسی کاربران.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/[0.08]">
            مجموع کاربران ثبت‌شده: {users.length}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-[#0B0F19]">
        <div className="relative w-full sm:w-80">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی نام کاربری، ایمیل یا شناسه..."
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs font-mono">
          {(['All', 'Active', 'KYC Verified', 'Suspended'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {status === 'All'
                ? 'همه'
                : status === 'Active'
                ? 'فعال'
                : status === 'KYC Verified'
                ? 'احراز شده (KYC)'
                : 'معلق (Suspended)'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F19] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-white/[0.02] border-b border-white/[0.06] text-slate-400 font-mono text-[11px]">
              <tr>
                <th className="px-4 py-3">شناسه / کاربر</th>
                <th className="px-4 py-3">ایمیل</th>
                <th className="px-4 py-3">سطح KYC</th>
                <th className="px-4 py-3">موجودی کیف‌پول</th>
                <th className="px-4 py-3">وضعیت حساب</th>
                <th className="px-4 py-3">تاریخ ثبت‌نام</th>
                <th className="px-4 py-3 text-left">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-mono">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-bold text-white font-sans">{user.username}</div>
                    <span className="text-[10px] text-slate-500 font-mono">#{user.id}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 font-mono">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold">
                      {user.status === 'KYC Verified' ? 'سطح ۲ کامل' : 'سطح ۱ اولیه'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-bold text-emerald-400 font-mono">
                    ${user.balanceUsd.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        user.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : user.status === 'KYC Verified'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-[11px]">{user.joinDate}</td>
                  <td className="px-4 py-3 text-left">
                    <div className="flex items-center gap-1.5 justify-end">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                        title="مشاهده جزئیات پرونده"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {user.status === 'Suspended' ? (
                        <button
                          onClick={() => handleToggleStatus(user.id, 'Active')}
                          className="px-2 py-1 rounded-lg text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                        >
                          رفع تعلیق
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleStatus(user.id, 'Suspended')}
                          className="px-2 py-1 rounded-lg text-[10px] bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                        >
                          تعلیق حساب
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <Modal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          title={`پرونده کاربری: ${selectedUser.username}`}
        >
          <div className="space-y-4 text-xs text-right font-sans" dir="rtl">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] font-mono">
              <div>
                <span className="text-slate-400 block text-[10px]">شناسه کاربری:</span>
                <span className="text-white font-bold">{selectedUser.id}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">وضعیت KYC:</span>
                <span className="text-indigo-400 font-bold">
                  {selectedUser.status === 'KYC Verified' ? 'سطح ۲ تاییدشده' : 'سطح ۱ پایه'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">ایمیل ثبت‌شده:</span>
                <span className="text-slate-200">{selectedUser.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">تاریخ عضویت:</span>
                <span className="text-slate-200">{selectedUser.joinDate}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/[0.05] border border-emerald-500/20">
              <span className="text-slate-400 block text-[10px] mb-1">موجودی تجمیعی کیف‌پول:</span>
              <span className="text-xl font-bold font-mono text-emerald-400">
                ${selectedUser.balanceUsd.toLocaleString()} USD
              </span>
            </div>

            <div className="pt-3 border-t border-white/[0.08] flex justify-between items-center">
              <div>
                {selectedUser.status === 'Suspended' ? (
                  <button
                    onClick={() => handleToggleStatus(selectedUser.id, 'Active')}
                    className="px-3 py-1.5 rounded-xl text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  >
                    فعال‌سازی مجدد کاربر
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleStatus(selectedUser.id, 'Suspended')}
                    className="px-3 py-1.5 rounded-xl text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30"
                  >
                    تعلیق و مسدودسازی دسترسی
                  </button>
                )}
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-1.5 rounded-xl text-xs text-slate-300 bg-white/[0.04] hover:bg-white/[0.08]"
              >
                بستن پنجره
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
