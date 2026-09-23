import React, { useState } from 'react';
import {
  Bell,
  Cpu,
  Gift,
  Megaphone,
  ShieldAlert,
  CheckCheck,
  Clock,
  Trash2,
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsPageProps {
  notifications: NotificationItem[];
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  notifications: initialList,
}) => {
  const [items, setItems] = useState<NotificationItem[]>(initialList);
  const [activeTab, setActiveTab] = useState<'all' | 'system' | 'reward' | 'campaign' | 'security'>('all');

  const filtered =
    activeTab === 'all' ? items : items.filter((n) => n.category === activeTab);

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleToggleRead = (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
            <Bell className="h-3.5 w-3.5" />
            <span>DISPATCH CENTER & TELEMETRY ALERTS</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            Notifications Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time broadcasts covering system releases, yield credits, campaign updates, and
            security events.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/[0.08] transition-all self-start sm:self-auto"
        >
          <CheckCheck className="h-4 w-4 text-indigo-400" /> Mark All as Read
        </button>
      </div>

      {/* Categories Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-x-auto scrollbar-none">
        {[
          { id: 'all', label: 'All Notifications' },
          { id: 'system', label: 'System' },
          { id: 'reward', label: 'Rewards' },
          { id: 'campaign', label: 'Campaigns' },
          { id: 'security', label: 'Security' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D17] p-5 lg:p-6 divide-y divide-white/[0.06]">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            No notifications found in this category.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => handleToggleRead(item.id)}
              className={`py-4 px-3 rounded-xl transition-all cursor-pointer flex items-start gap-4 ${
                !item.read ? 'bg-indigo-500/[0.04]' : 'hover:bg-white/[0.02]'
              }`}
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                  item.category === 'system'
                    ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-400'
                    : item.category === 'reward'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : item.category === 'campaign'
                    ? 'border-purple-500/30 bg-purple-500/10 text-purple-400'
                    : 'border-rose-500/30 bg-rose-500/10 text-rose-400'
                }`}
              >
                {item.category === 'system' && <Bell className="h-4 w-4" />}
                {item.category === 'reward' && <Gift className="h-4 w-4" />}
                {item.category === 'campaign' && <Megaphone className="h-4 w-4" />}
                {item.category === 'security' && <ShieldAlert className="h-4 w-4" />}
              </div>

              <div className="flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <h3
                    className={`text-xs font-semibold ${
                      !item.read ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500 shrink-0">
                    {item.timestamp}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">{item.message}</p>
              </div>

              {!item.read && (
                <span
                  className="h-2 w-2 rounded-full bg-indigo-500 self-center shrink-0"
                  title="Unread"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
