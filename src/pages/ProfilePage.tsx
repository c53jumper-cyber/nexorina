import React, { useState } from 'react';
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  Key,
  Wallet,
  Copy,
  Check,
  Award,
  ExternalLink,
} from 'lucide-react';
import { USER_AVATAR_URL } from '../data/mockData';

export const ProfilePage: React.FC = () => {
  const [copiedId, setCopiedId] = useState(false);
  const [copiedAddr, setCopiedAddr] = useState(false);

  const profileData = {
    username: 'alex_cyber',
    email: 'alex.cyber@nexorina.net',
    userId: 'NX-98421-OBSIDIAN',
    accountStatus: 'KYC Verified (Tier 3)',
    registrationDate: 'May 14, 2026',
    vipTier: 'VIP Obsidian Founder',
    primaryWallet: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    secondaryWallet: '7xWp...k89MSolana',
    securityScore: '98/100',
    twoFactorStatus: 'Enabled (Hardware FIDO2)',
  };

  const handleCopy = (text: string, isAddr = false) => {
    navigator.clipboard?.writeText(text);
    if (isAddr) {
      setCopiedAddr(true);
      setTimeout(() => setCopiedAddr(false), 2000);
    } else {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Profile Identity Card */}
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#0F1424] via-[#0D101E] to-[#0A0D17] p-6 lg:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <img
                src={USER_AVATAR_URL}
                alt="Alex Cyber"
                referrerPolicy="no-referrer"
                className="h-20 w-20 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-[#0A0D17] flex items-center justify-center">
                <Check className="h-3 w-3 text-black stroke-[3]" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl lg:text-2xl font-bold text-white font-display">
                  {profileData.username}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  {profileData.accountStatus}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span>{profileData.email}</span>
                <span>·</span>
                <span>ID: {profileData.userId}</span>
              </div>
              <div className="mt-2 text-xs text-indigo-400 font-semibold flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5" /> {profileData.vipTier}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <button
              onClick={() => handleCopy(profileData.userId)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.1] bg-white/[0.03] text-xs text-slate-300 hover:text-white"
            >
              <Copy className="h-3.5 w-3.5" /> {copiedId ? 'Copied ID' : 'Copy User ID'}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Details Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account & Identity */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D17] p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white tracking-tight border-b border-white/[0.06] pb-3">
            Account Credentials
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400 flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-slate-500" /> Username
              </span>
              <span className="text-white font-medium">{profileData.username}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400 flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-500" /> Email Address
              </span>
              <span className="text-white font-medium font-mono">{profileData.email}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-slate-500" /> Registration Date
              </span>
              <span className="text-slate-300 font-mono">{profileData.registrationDate}</span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400 flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-500" /> Account Status
              </span>
              <span className="text-emerald-400 font-semibold">{profileData.accountStatus}</span>
            </div>
          </div>
        </div>

        {/* Security & Web3 Connected Wallets */}
        <div className="rounded-2xl border border-white/[0.08] bg-[#0A0D17] p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white tracking-tight border-b border-white/[0.06] pb-3">
            Connected Wallets & Security
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block mb-1">Primary Settlement Address</span>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="font-mono text-slate-200 text-xs truncate max-w-[220px]">
                  {profileData.primaryWallet}
                </span>
                <button
                  onClick={() => handleCopy(profileData.primaryWallet, true)}
                  className="text-indigo-400 hover:text-indigo-300"
                >
                  {copiedAddr ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400 flex items-center gap-2">
                <Key className="h-3.5 w-3.5 text-slate-500" /> 2-Factor Authentication
              </span>
              <span className="text-emerald-400 font-medium font-mono">
                {profileData.twoFactorStatus}
              </span>
            </div>

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400 flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-500" /> Security Rating
              </span>
              <span className="text-emerald-400 font-bold font-mono">
                {profileData.securityScore}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
