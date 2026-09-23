import React, { useState } from 'react';
import {
  FileCheck2,
  Search,
  Filter,
  ShieldAlert,
  ArrowRightLeft,
  Calendar,
  Download,
  AlertTriangle,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { auditLogger } from '../../backend/audit/auditLogger';
import { AuditLogItem } from '../../shared/types/audit';

export const AdminAuditLogPage: React.FC = () => {
  const [logs] = useState<AuditLogItem[]>(() => auditLogger.getLogs());
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actionTitleFa.includes(searchQuery) ||
      log.ipAddress.includes(searchQuery);

    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-white/[0.08] bg-gradient-to-l from-rose-950/30 via-[#0B0F19] to-transparent">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono text-rose-400 font-semibold">
              FORENSIC AUDIT TRAIL · IMMUTABLE GOVERNANCE
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            لاگ حسابرسی مدیران و عملیات حساس (Audit Log)
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            تمامی تغییرات حساس، از جمله اصلاح موجودی‌ها، تغییر ضرایب پاداش، ویرایش دسترسی‌های RBAC، و تنظیمات
            پارامترهای جهانی سیستم، با ثبت هویت اپراتور، آدرس IP و مقدار قبل/بعد در این دفترکل غیرقابل تغییر ثبت می‌گردد.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={() => alert('گزارش رمزنگاری‌شده لاگ‌های حسابرسی به فرمت JSON آماده دانلود شد.')}
          >
            خروجی لاگ ممیزی
          </Button>
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
            placeholder="جستجو بر اساس نام مدیر، هدف تغییر، یا آدرس IP..."
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">فیلتر نوع عملیات:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">تمام عملیات‌ها</option>
            <option value="SYSTEM_PARAMETER_UPDATE">تنظیمات سیستم</option>
            <option value="PERMISSION_MODIFIED">تغییر سطح دسترسی</option>
            <option value="REWARD_OVERRIDE">اصلاح ضریب پاداش</option>
            <option value="BALANCE_ADJUSTMENT">تغییر موجودی کاربر</option>
            <option value="INVITATION_GENERATED">صدور کد دعوت</option>
            <option value="INVITATION_REVOKED">ابطال کد دعوت</option>
            <option value="CAMPAIGN_STATUS_CHANGE">تغییر وضعیت کمپین</option>
          </select>
        </div>
      </div>

      {/* Forensic Audit Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F19] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="border-b border-white/[0.08] bg-white/[0.02] text-slate-400 font-mono text-[11px]">
              <tr>
                <th className="px-4 py-3">زمان (UTC)</th>
                <th className="px-4 py-3">مدیر مسئول</th>
                <th className="px-4 py-3">عملیات اجرایی</th>
                <th className="px-4 py-3">هدف تغییر (Target)</th>
                <th className="px-4 py-3">تغییرات (قبل → بعد)</th>
                <th className="px-4 py-3">آدرس IP</th>
                <th className="px-4 py-3 text-left">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-bold text-white">{log.adminName}</div>
                      <span className="text-[10px] font-mono text-indigo-400">{log.adminRole}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-slate-200 text-xs font-semibold">
                      {log.actionTitleFa}
                    </span>
                    <span className="block text-[10px] font-mono text-slate-500 mt-0.5">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300 font-mono text-[11px] max-w-xs truncate">
                    {log.target}
                  </td>
                  <td className="px-4 py-3 max-w-sm">
                    <div className="space-y-1 font-mono text-[11px]">
                      <div className="text-rose-400 line-through truncate opacity-80">
                        {log.previousValue}
                      </div>
                      <div className="text-emerald-400 font-bold truncate">
                        {log.newValue}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                  <td className="px-4 py-3 text-left">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                        log.result === 'SUCCESS'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {log.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Drawer Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#0C1020] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">جزئیات رکورد ممیزی #{selectedLog.id}</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div>
                  <span className="text-slate-400 block text-[10px]">اپراتور:</span>
                  <span className="text-white font-bold">{selectedLog.adminName} ({selectedLog.adminRole})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">زمان ثبت:</span>
                  <span className="text-slate-300 font-mono">{selectedLog.timestamp}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] mb-1">شناسه هدف عملیات:</span>
                <div className="p-2.5 rounded-lg bg-white/[0.03] text-slate-200 font-mono text-[11px]">
                  {selectedLog.target}
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-rose-400 block text-[10px]">مقدار قبلی (Previous State):</span>
                  <div className="p-2.5 rounded-lg bg-rose-500/[0.05] border border-rose-500/20 text-rose-300 font-mono text-[11px]">
                    {selectedLog.previousValue}
                  </div>
                </div>
                <div>
                  <span className="text-emerald-400 block text-[10px]">مقدار جدید اعمال‌شده (New Applied State):</span>
                  <div className="p-2.5 rounded-lg bg-emerald-500/[0.05] border border-emerald-500/20 text-emerald-300 font-mono text-[11px]">
                    {selectedLog.newValue}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px] font-mono text-slate-400 pt-2 border-t border-white/[0.06]">
                <span>IP مبدا: {selectedLog.ipAddress}</span>
                <span className="text-left">نتیجه: {selectedLog.result}</span>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/[0.08] text-left">
              <Button variant="secondary" size="xs" onClick={() => setSelectedLog(null)}>
                بستن پنجره
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
