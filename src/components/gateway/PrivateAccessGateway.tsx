/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Shield,
  Lock,
  FileCheck2,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Key,
} from 'lucide-react';
import { RequestAccessModal } from './RequestAccessModal';
import { AlreadyInvitedModal } from './AlreadyInvitedModal';
import { AccessApplicationRequest, InvitationRecord } from '../../shared/types/access';

interface PrivateAccessGatewayProps {
  onEnterUserPanel: () => void;
  onRegisteredAndVerified: (username: string, invitation: InvitationRecord) => void;
}

export const PrivateAccessGateway: React.FC<PrivateAccessGatewayProps> = ({
  onEnterUserPanel,
  onRegisteredAndVerified,
}) => {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isInvitedModalOpen, setIsInvitedModalOpen] = useState(false);
  const [submittedAppsCount, setSubmittedAppsCount] = useState(1);

  const handleApplicationSubmitted = (newApp: AccessApplicationRequest) => {
    setSubmittedAppsCount((prev) => prev + 1);
  };

  const handleRegistrationComplete = (inv: InvitationRecord, username: string) => {
    onRegisteredAndVerified(username, inv);
  };

  return (
    <div className="min-h-screen bg-[#05070D] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Top Protocol Status & Navigation Bar */}
      <header className="border-b border-white/[0.06] bg-[#070A14]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white font-mono text-sm">NEXORINA</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-400 border border-white/[0.08]">
                  PRIVATE
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 block leading-none mt-0.5">
                Controlled Access Network
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              <span>Network Status: Operational</span>
            </div>

            {/* Quick Switch to User Panel for testing/demo */}
            <button
              onClick={onEnterUserPanel}
              className="flex items-center gap-1.5 text-xs font-mono text-indigo-300 hover:text-white px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors"
              title="Enter verified session preview"
            >
              <span>Active Session →</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20 flex flex-col items-center justify-center text-center">
        {/* Controlled Access Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono text-slate-300 mb-6">
          <Lock className="h-3.5 w-3.5 text-indigo-400" />
          <span>Admission Policy: Invitation Required</span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">Public Registration Closed</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.15]">
          Autonomous Financial Infrastructure & Quantitative Clusters
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-5 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
          Nexorina is a private, selective ecosystem. Accounts are provisioned exclusively through
          verified cryptographic invitations with multi-tiered operational clearance.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-xl shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all group"
          >
            <span>Request Access</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            onClick={() => setIsInvitedModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.1] text-slate-200 hover:text-white font-medium text-sm transition-all"
          >
            <Key className="h-4 w-4 text-emerald-400" />
            <span>Already Invited?</span>
          </button>
        </div>

        {/* Platform Integrity Metrics / Trust Bar */}
        <div className="mt-14 w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-2">
              <ShieldCheck className="h-4 w-4" />
              <span>Controlled Entry</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every applicant is vetted for substantive operational purpose to maintain platform liquidity integrity.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
              <Clock className="h-4 w-4" />
              <span>24-Hour Expiration</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Dispatched invitation links are cryptographically bound, single-use, and expire automatically after 24 hours.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col justify-between">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
              <Layers className="h-4 w-4" />
              <span>Layered Clearance</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Platform modules, from hashrate clusters to AI trading bots, unlock progressively based on verified access levels.
            </p>
          </div>
        </div>

        {/* Architecture Separation & Verification Flow */}
        <div className="mt-12 w-full p-5 rounded-2xl bg-white/[0.01] border border-white/[0.05] text-left">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
            <span>Access Pipeline Architecture</span>
            <span className="text-indigo-400">Strict Nonce Verification</span>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-300">
            <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">1. Application</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600 shrink-0" />
            <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">2. Review</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600 shrink-0" />
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">3. 24h Invitation</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600 shrink-0" />
            <span className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">4. Registration</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600 shrink-0" />
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">5. User Platform</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Nexorina Autonomous Network · Private Ecosystem</span>
          <span className="text-[11px] text-slate-600">
            Controlled Access Architecture · All Rights Reserved
          </span>
        </div>
      </footer>

      {/* Modals */}
      <RequestAccessModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmitSuccess={handleApplicationSubmitted}
      />

      <AlreadyInvitedModal
        isOpen={isInvitedModalOpen}
        onClose={() => setIsInvitedModalOpen(false)}
        onRegistrationComplete={handleRegistrationComplete}
      />
    </div>
  );
};
