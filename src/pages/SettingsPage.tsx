import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Bell,
  Palette,
  Globe,
  User,
  Key,
  Smartphone,
  Check,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'notifications' | 'appearance' | 'language'>('account');
  const [language, setLanguage] = useState<'en' | 'fa'>('en');
  const [themeMode, setThemeMode] = useState<'dark-slate' | 'pure-black' | 'cyber-indigo'>('dark-slate');
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [payoutAlerts, setPayoutAlerts] = useState(true);
  const [marketingAlerts, setMarketingAlerts] = useState(false);

  const handleSave = () => {
    setSaveNotice('Settings updated successfully.');
    setTimeout(() => setSaveNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
            <Settings className="h-3.5 w-3.5" />
            <span>PLATFORM PREFERENCES & CLIENT CONFIGURATION</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white font-display">
            System Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your credentials, cryptographic security keys, multi-channel dispatch, and UI
            appearance.
          </p>
        </div>

        {saveNotice && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-2 text-xs text-emerald-300">
            <Check className="h-4 w-4" />
            <span>{saveNotice}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-x-auto scrollbar-none">
        {[
          { id: 'account', label: 'Account', icon: User },
          { id: 'security', label: 'Security', icon: Shield },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'appearance', label: 'Appearance', icon: Palette },
          { id: 'language', label: 'Language', icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D17] p-6">
        {activeTab === 'account' && (
          <div className="space-y-4 max-w-xl text-xs">
            <h3 className="text-sm font-semibold text-white">General Account Information</h3>
            <div>
              <label className="text-slate-400 block mb-1">Display Username</label>
              <input
                type="text"
                defaultValue="alex_cyber"
                className="w-full rounded-lg bg-white/[0.04] border border-white/[0.1] px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Registered Email</label>
              <input
                type="email"
                defaultValue="alex.cyber@nexorina.net"
                className="w-full rounded-lg bg-white/[0.04] border border-white/[0.1] px-3 py-2 text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Timezone</label>
              <select className="w-full rounded-lg bg-white/[0.04] border border-white/[0.1] px-3 py-2 text-white">
                <option className="bg-[#0E1322]">UTC (Coordinated Universal Time)</option>
                <option className="bg-[#0E1322]">UTC+03:30 (Tehran / Middle East)</option>
                <option className="bg-[#0E1322]">UTC+01:00 (CET / Frankfurt)</option>
                <option className="bg-[#0E1322]">UTC-05:00 (EST / New York)</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-4 max-w-xl text-xs">
            <h3 className="text-sm font-semibold text-white">Security & Cryptographic Keys</h3>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Two-Factor Authentication (2FA)</div>
                <div className="text-[11px] text-slate-400">YubiKey & Authenticator app verified</div>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Active
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Session IP Whitelist</div>
                <div className="text-[11px] text-slate-400">Enforce verified IP subnets for withdrawals</div>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-indigo-500" />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Update Master Password</label>
              <input
                type="password"
                placeholder="Enter new 16+ character passphrase"
                className="w-full rounded-lg bg-white/[0.04] border border-white/[0.1] px-3 py-2 text-white focus:outline-none"
              />
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-3 max-w-xl text-xs">
            <h3 className="text-sm font-semibold text-white">Dispatch Subscriptions</h3>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer">
              <div>
                <div className="text-white font-medium">Daily Mining & Task Payout Alerts</div>
                <div className="text-[11px] text-slate-400">Receive real-time push on reward credits</div>
              </div>
              <input
                type="checkbox"
                checked={payoutAlerts}
                onChange={(e) => setPayoutAlerts(e.target.checked)}
                className="h-4 w-4 accent-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer">
              <div>
                <div className="text-white font-medium">Security & New Login Alerts</div>
                <div className="text-[11px] text-slate-400">Instant notification of unverified IPs</div>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-4 w-4 accent-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer">
              <div>
                <div className="text-white font-medium">Campaign Partner Quests</div>
                <div className="text-[11px] text-slate-400">New high-yield referral pool openings</div>
              </div>
              <input
                type="checkbox"
                checked={marketingAlerts}
                onChange={(e) => setMarketingAlerts(e.target.checked)}
                className="h-4 w-4 accent-indigo-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer">
              <div>
                <div className="text-white font-medium">Critical Security Alerts & Revocations</div>
                <div className="text-[11px] text-slate-400">Mandatory dispatches for timelocks and access modifications</div>
              </div>
              <input
                type="checkbox"
                defaultChecked
                disabled
                className="h-4 w-4 accent-indigo-500 opacity-60 cursor-not-allowed"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] cursor-pointer">
              <div>
                <div className="text-white font-medium">Important Network Announcements</div>
                <div className="text-[11px] text-slate-400">Protocol upgrades, scheduled maintenance, and node deployments</div>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 accent-indigo-500"
              />
            </label>

            <div className="pt-3 border-t border-white/[0.06]">
              <label className="text-slate-400 block mb-1 text-[11px] font-mono uppercase tracking-wider">
                Primary Contact Preference
              </label>
              <select className="w-full rounded-lg bg-white/[0.04] border border-white/[0.1] px-3 py-2 text-white focus:outline-none">
                <option value="email">Verified Recipient Email (Default)</option>
                <option value="in_app">In-App Account Notification Center Only</option>
                <option value="encrypted">Encrypted Dispatch Channel (GPG / Signaled)</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-4 max-w-xl text-xs">
            <h3 className="text-sm font-semibold text-white">Interface Styling & Theme</h3>
            <p className="text-slate-400">Select preferred dark theme profile:</p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'dark-slate', label: 'Dark Obsidian', color: '#090D16' },
                { id: 'pure-black', label: 'OLED Pure Black', color: '#000000' },
                { id: 'cyber-indigo', label: 'Cyber Indigo', color: '#0E1126' },
              ].map((th) => (
                <button
                  key={th.id}
                  onClick={() => setThemeMode(th.id as any)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    themeMode === th.id
                      ? 'border-indigo-500 bg-indigo-500/10 text-white'
                      : 'border-white/[0.08] text-slate-400 hover:text-white'
                  }`}
                >
                  <div
                    className="h-6 w-full rounded mb-2 border border-white/[0.1]"
                    style={{ backgroundColor: th.color }}
                  />
                  <span className="text-[11px] font-medium">{th.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'language' && (
          <div className="space-y-4 max-w-xl text-xs">
            <h3 className="text-sm font-semibold text-white">Language / زبان</h3>
            <p className="text-slate-400">Select platform display language:</p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setLanguage('en')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  language === 'en'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white font-semibold'
                    : 'border-white/[0.08] text-slate-400'
                }`}
              >
                <div className="text-sm font-bold text-white">English (US)</div>
                <div className="text-[11px] text-slate-400 mt-1">Default international locale</div>
              </button>

              <button
                onClick={() => setLanguage('fa')}
                className={`p-4 rounded-xl border text-right transition-all font-sans ${
                  language === 'fa'
                    ? 'border-indigo-500 bg-indigo-500/10 text-white font-semibold'
                    : 'border-white/[0.08] text-slate-400'
                }`}
              >
                <div className="text-sm font-bold text-white font-['Vazirmatn']">فارسی (Persian)</div>
                <div className="text-[11px] text-slate-400 mt-1 font-['Vazirmatn']">پشتیبانی زبان فارسی</div>
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
