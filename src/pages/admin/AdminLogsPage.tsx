import React, { useState } from 'react';
import {
  FileText,
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Cpu,
  Server,
  RefreshCw,
} from 'lucide-react';
import { authService } from '../../backend/auth/authService';
import { SecurityEvent } from '../../shared/types/auth';

export const AdminLogsPage: React.FC = () => {
  const [securityEvents] = useState<SecurityEvent[]>(() => authService.getSecurityEvents());
  const [activeTab, setActiveTab] = useState<'security' | 'system'>('security');

  const systemMetrics = [
    { nameFa: 'نرخ موفقیت فراخوانی API', value: '99.98%', status: 'optimal' },
    { nameFa: 'زمان پاسخ میانگین (p95 Latency)', value: '42ms', status: 'optimal' },
    { nameFa: 'اتصالات فعال پایگاه داده (Pool)', value: '14 / 50', status: 'normal' },
    { nameFa: 'وضعیت ردیس کش (Redis Cache)', value: '94.2% Hit Ratio', status: 'optimal' },
  ];

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border border-white/[0.08] bg-gradient-to-l from-indigo-950/30 via-[#0B0F19] to-transparent">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono text-indigo-400 font-semibold">
              TELEMETRY & SECURITY EVENT MONITORING
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white font-display">
            لاگ‌های سیستم، امنیت و احراز هویت
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            مانیتورینگ بلادرنگ رویدادهای ورود به سیستم، چالش‌های 2FA، درخواست‌های نامعتبر، و وضعیت سلامت زیرساخت سرورها.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'security'
                ? 'bg-indigo-600 text-white font-bold'
                : 'text-slate-400 hover:text-white bg-white/[0.03]'
            }`}
          >
            لاگ‌های امنیت و ورود
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              activeTab === 'system'
                ? 'bg-indigo-600 text-white font-bold'
                : 'text-slate-400 hover:text-white bg-white/[0.03]'
            }`}
          >
            سلامت سیستم و API
          </button>
        </div>
      </div>

      {activeTab === 'security' ? (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F19] overflow-hidden shadow-xl">
          <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
            <h3 className="text-xs font-bold text-white font-mono uppercase">
              Security Telemetry Stream
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Monitoring
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-white/[0.02] border-b border-white/[0.06] text-slate-400 font-mono text-[11px]">
                <tr>
                  <th className="px-4 py-3">زمان (UTC)</th>
                  <th className="px-4 py-3">نوع رویداد</th>
                  <th className="px-4 py-3">سطح حساسیت</th>
                  <th className="px-4 py-3">جزئیات رویداد</th>
                  <th className="px-4 py-3">آدرس IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] font-mono">
                {securityEvents.map((evt) => (
                  <tr key={evt.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-slate-400 text-[11px]">{evt.timestamp}</td>
                    <td className="px-4 py-3 text-white font-bold">{evt.eventType}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          evt.severity === 'low'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : evt.severity === 'medium'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {evt.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-sans text-xs">{evt.details}</td>
                    <td className="px-4 py-3 text-slate-400 text-[11px]">{evt.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemMetrics.map((m, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-white/[0.08] bg-[#0B0F19]">
              <span className="text-xs text-slate-400 block mb-1">{m.nameFa}</span>
              <span className="text-2xl font-bold font-mono text-emerald-400 block">{m.value}</span>
              <span className="text-[10px] text-slate-500 font-mono mt-2 block">
                Status: Normal Operation
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
