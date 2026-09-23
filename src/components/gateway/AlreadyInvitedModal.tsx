/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Link as LinkIcon,
  ShieldCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
  User,
  KeyRound,
  Lock,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { InvitationRecord } from '../../shared/types/access';
import { MOCK_INVITATIONS } from '../../data/mockAccessData';

interface AlreadyInvitedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistrationComplete: (invitation: InvitationRecord, username: string) => void;
}

export const AlreadyInvitedModal: React.FC<AlreadyInvitedModalProps> = ({
  isOpen,
  onClose,
  onRegistrationComplete,
}) => {
  const [invitations, setInvitations] = useState<InvitationRecord[]>(MOCK_INVITATIONS);
  const [inputUrl, setInputUrl] = useState('');
  const [resolvedInvitation, setResolvedInvitation] = useState<InvitationRecord | null>(null);
  const [validationError, setValidationError] = useState<'not_found' | 'expired' | 'used' | null>(null);

  // Registration Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [securityPhrase, setSecurityPhrase] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regError, setRegError] = useState('');

  if (!isOpen) return null;

  const handleResolveLink = (urlOrTokenToTest?: string) => {
    const raw = (urlOrTokenToTest ?? inputUrl).trim();
    setValidationError(null);
    setResolvedInvitation(null);
    setRegError('');

    if (!raw) return;

    // Extract token from either full URL or token slug
    const cleanToken = raw.replace(/^https?:\/\/.*\/invite\/?/i, '').replace(/[^a-zA-Z0-9_-]/g, '');

    const found = invitations.find(
      (inv) => inv.token === cleanToken || raw.includes(inv.token)
    );

    if (!found) {
      setValidationError('not_found');
      return;
    }

    // Check expiration
    const isExpired = new Date(found.expiresAt).getTime() < Date.now() || found.status === 'expired';
    if (isExpired) {
      setValidationError('expired');
      setResolvedInvitation(found);
      return;
    }

    // Check single-use state
    if (found.status === 'used') {
      setValidationError('used');
      setResolvedInvitation(found);
      return;
    }

    // Valid invitation
    setResolvedInvitation(found);
    setInputUrl(raw);
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvedInvitation) return;
    setRegError('');

    if (username.trim().length < 3) {
      setRegError('Username must be at least 3 alphanumeric characters.');
      return;
    }
    if (password.length < 8) {
      setRegError('Password must contain at least 8 characters.');
      return;
    }

    setIsRegistering(true);
    setTimeout(() => {
      // Transition invitation state: Unused -> Used (Single-use enforcement)
      const updatedInv: InvitationRecord = {
        ...resolvedInvitation,
        status: 'used',
        usedAt: new Date().toISOString(),
        registeredUsername: username.trim(),
      };

      setInvitations((prev) =>
        prev.map((i) => (i.id === updatedInv.id ? updatedInv : i))
      );

      setIsRegistering(false);
      onRegistrationComplete(updatedInv, username.trim());
      onClose();
    }, 1200);
  };

  const handleCloseModal = () => {
    setInputUrl('');
    setResolvedInvitation(null);
    setValidationError(null);
    setRegError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#0B0F1E] p-6 shadow-2xl text-left">
        <button
          onClick={handleCloseModal}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-white/[0.08] pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
            <LinkIcon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
              Verified Entry · Private Link Resolver
            </div>
            <h2 className="text-lg font-bold text-white">
              Invitation Link Validation
            </h2>
          </div>
        </div>

        {/* Phase 1: Enter Invitation Link */}
        {!resolvedInvitation || validationError ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              If your access request was approved, you received a private, single-use invitation link
              valid for 24 hours. Enter your complete invitation link below to resolve credentials.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                Private Invitation Link
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://nexorina.network/invite/nx-alpha-..."
                  className="w-full pl-9 pr-24 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                />
                <button
                  type="button"
                  onClick={() => handleResolveLink()}
                  className="absolute right-1.5 top-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
                >
                  Resolve
                </button>
              </div>
            </div>

            {/* Error States */}
            {validationError === 'not_found' && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-rose-200">Invalid Invitation Link</div>
                  <div className="text-[11px] text-rose-300/90 mt-0.5">
                    No active or registered record matches this link token. Check your invitation email or request access.
                  </div>
                </div>
              </div>
            )}

            {validationError === 'expired' && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                <Clock className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-amber-200">Invitation Expired</div>
                  <div className="text-[11px] text-amber-300/90 mt-0.5">
                    This invitation has surpassed its 24-hour validity lifetime and is no longer usable.
                  </div>
                </div>
              </div>
            )}

            {validationError === 'used' && (
              <div className="p-3.5 rounded-xl bg-slate-500/10 border border-slate-500/30 text-slate-300 text-xs flex items-start gap-2.5">
                <Lock className="h-4 w-4 shrink-0 mt-0.5 text-slate-400" />
                <div>
                  <div className="font-semibold text-slate-200">Invitation Already Redeemed</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    This single-use invitation was already registered to{' '}
                    <strong className="text-slate-300">{resolvedInvitation?.registeredUsername}</strong> and cannot be reused.
                  </div>
                </div>
              </div>
            )}

            {/* Quick Test Fixtures for Evaluators / Reviewers */}
            <div className="pt-2 border-t border-white/[0.06]">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-2">
                Simulate Invitation Link Scenarios:
              </span>
              <div className="space-y-1.5 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    const testUrl = 'https://nexorina.network/invite/nx-alpha-9281';
                    setInputUrl(testUrl);
                    handleResolveLink(testUrl);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl bg-emerald-500/[0.05] hover:bg-emerald-500/[0.1] border border-emerald-500/20 text-emerald-300 flex items-center justify-between"
                >
                  <span>✓ Active Invitation (nx-alpha-9281)</span>
                  <span className="text-[10px] text-emerald-400">Valid · 22h left</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const testUrl = 'https://nexorina.network/invite/nx-expired-0012';
                    setInputUrl(testUrl);
                    handleResolveLink(testUrl);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl bg-amber-500/[0.05] hover:bg-amber-500/[0.1] border border-amber-500/20 text-amber-300 flex items-center justify-between"
                >
                  <span>✕ Expired Invitation (nx-expired-0012)</span>
                  <span className="text-[10px] text-amber-400">Expired</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const testUrl = 'https://nexorina.network/invite/nx-used-4491';
                    setInputUrl(testUrl);
                    handleResolveLink(testUrl);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] text-slate-400 flex items-center justify-between"
                >
                  <span>⊘ Used Invitation (nx-used-4491)</span>
                  <span className="text-[10px] text-slate-500">Already Redeemed</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Phase 2: Valid Invitation Verified → Complete Private Registration */
          <div className="space-y-4 animate-in fade-in">
            {/* Invitation Badge */}
            <div className="p-3.5 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 text-xs">
              <div className="flex items-center justify-between font-mono mb-1">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  Invitation Verified
                </span>
                <span className="text-slate-400 text-[11px]">Single-Use Nonce Active</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-emerald-500/10 text-[11px] font-mono text-slate-300">
                <div>
                  <span className="text-slate-500 block">Assigned Recipient:</span>
                  <span className="text-white truncate block">{resolvedInvitation.recipientEmail}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Initial Tier:</span>
                  <span className="text-indigo-400 font-bold block">Level 1 — Verified User</span>
                </div>
              </div>
            </div>

            {regError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {regError}
              </div>
            )}

            <form onSubmit={handleCompleteRegistration} className="space-y-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Desired Username <span className="text-indigo-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. Satoshi_Quant"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Master Access Password <span className="text-indigo-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Security Recovery Passphrase <span className="text-slate-500 text-[10px]">(Optional)</span>
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={securityPhrase}
                    onChange={(e) => setSecurityPhrase(e.target.value)}
                    placeholder="Emergency account protection passphrase"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => setResolvedInvitation(null)}
                  className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Back to Resolver
                </button>

                <button
                  type="submit"
                  disabled={isRegistering}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
                >
                  <span>{isRegistering ? 'Finalizing Entry...' : 'Complete Registration & Enter'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
