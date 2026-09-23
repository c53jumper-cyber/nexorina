import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Shield,
  Search,
} from 'lucide-react';
import { TRANSACTIONS_LIST } from '../../data/mockData';
import { Transaction } from '../../types';
import { adminApi } from '../../backend/api/adminApi';

export const AdminWalletPage: React.FC = () => {
  const [txList, setTxList] = useState<Transaction[]>([
    ...TRANSACTIONS_LIST,
    {
      id: 'TX-99014',
      type: 'Withdrawal',
      asset: 'BTC',
      amount: 0.85,
      amountUsd: 55607.0,
      status: 'Pending',
      date: '2026-09-22 12:45',
      reference: '0x889...PendingMultiSig',
      destinationOrSource: '0x889a71...9F0',
    },
    {
      id: 'TX-99015',
      type: 'Withdrawal',
      asset: 'ETH',
      amount: 4.5,
      amountUsd: 15371.0,
      status: 'Pending',
      date: '2026-09-22 12:50',
      reference: '0x221...PendingApproval',
      destinationOrSource: '0x221e09...8A1',
    },
  ]);

  const [filterType, setFilterType] = useState<string>('All');
  const [notice, setNotice] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    const tx = txList.find((t) => t.id === id);
    setTxList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Completed' } : t))
    );

    adminApi.recordSensitiveAction({
      action: 'BALANCE_ADJUSTMENT',
      actionTitleFa: 'تایید و تسویه برداشت خزانه‌داری',
      target: `تراکنش: ${id} (${tx?.amount} ${tx?.asset})`,
      previousValue: 'وضعیت: در انتظار تایید چندامضایی (Pending)',
      newValue: 'وضعیت: تایید و تسویه به مم‌پول بلاک‌چین (Completed)',
    });

    setNotice(`تراکنش ${id} تایید شد و تغییرات در لاگ حسابرسی ثبت گردید.`);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleReject = (id: string) => {
    const tx = txList.find((t) => t.id === id);
    setTxList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'Failed' } : t))
    );

    adminApi.recordSensitiveAction({
      action: 'BALANCE_ADJUSTMENT',
      actionTitleFa: 'رد تراکنش برداشت و بازگشت وجه',
      target: `تراکنش: ${id} (${tx?.amount} ${tx?.asset})`,
      previousValue: 'وضعیت: در انتظار (Pending)',
      newValue: 'وضعیت: ردشده / عودت به کیف‌پول کاربر (Rejected)',
    });

    setNotice(`تراکنش ${id} رد و مبالغ به بالانس کاربر عودت داده شد.`);
    setTimeout(() => setNotice(null), 3500);
  };

  const filtered = txList.filter(
    (t) => filterType === 'All' || t.status === filterType
  );

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
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <Wallet className="h-3.5 w-3.5" />
            <span>MULTI-ASSET TREASURY & TRANSACTION CLEARING</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            خزانه‌داری، تسویه‌حساب و تایید تراکنش‌ها
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            بررسی و امضای درخواست‌های برداشت بزرگ، تطبیق نقدینگی کیف‌پول‌های گرم و سرد، و ثبت دفترکل مالی غیرقابل برگشت.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
            موجودی کل خزانه: $۸,۹۲۰,۰۰۰ USD
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs font-mono">
        {['All', 'Pending', 'Completed', 'Failed'].map((st) => (
          <button
            key={st}
            onClick={() => setFilterType(st)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterType === st
                ? 'bg-indigo-600 text-white font-bold'
                : 'bg-white/[0.04] text-slate-400 hover:text-white'
            }`}
          >
            {st === 'All'
              ? 'همه'
              : st === 'Pending'
              ? 'در انتظار تایید'
              : st === 'Completed'
              ? 'تایید و تسویه‌شده'
              : 'ردشده / ناموفق'}
          </button>
        ))}
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0B0F19] overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-white/[0.02] border-b border-white/[0.06] text-slate-400 font-mono text-[11px]">
              <tr>
                <th className="px-4 py-3">شناسه تراکنش</th>
                <th className="px-4 py-3">نوع عملیات</th>
                <th className="px-4 py-3">ارز / دارایی</th>
                <th className="px-4 py-3">مقدار</th>
                <th className="px-4 py-3">معادل دلاری</th>
                <th className="px-4 py-3">وضعیت</th>
                <th className="px-4 py-3">زمان ثبت</th>
                <th className="px-4 py-3 text-left">عملیات تسویه</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-mono">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3 font-bold text-white">{tx.id}</td>
                  <td className="px-4 py-3 text-slate-300 font-sans">
                    {tx.type === 'Withdrawal'
                      ? 'برداشت'
                      : tx.type === 'Deposit'
                      ? 'واریز'
                      : tx.type === 'Reward'
                      ? 'پاداش'
                      : tx.type}
                  </td>
                  <td className="px-4 py-3 text-indigo-400 font-bold">{tx.asset}</td>
                  <td className="px-4 py-3 text-white">
                    {tx.amount} {tx.asset}
                  </td>
                  <td className="px-4 py-3 text-emerald-400">${tx.amountUsd.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : tx.status === 'Pending'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {tx.status === 'Completed'
                        ? 'تکمیل‌شده'
                        : tx.status === 'Pending'
                        ? 'در انتظار تایید'
                        : 'ردشده'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-[11px]">{tx.date}</td>
                  <td className="px-4 py-3 text-left font-sans">
                    {tx.status === 'Pending' ? (
                      <div className="flex items-center gap-1.5 justify-end">
                        <button
                          onClick={() => handleApprove(tx.id)}
                          className="px-2.5 py-1 rounded-lg text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30"
                        >
                          تایید تسویه
                        </button>
                        <button
                          onClick={() => handleReject(tx.id)}
                          className="px-2.5 py-1 rounded-lg text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30"
                        >
                          رد تراکنش
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-[11px]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
