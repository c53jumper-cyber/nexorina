import React, { useState } from 'react';
import {
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from './Button';
import { invitationService } from '../../backend/invitations/invitationService';
import { userApi } from '../../backend/api/userApi';

interface InvitationAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export const InvitationAuthModal: React.FC<InvitationAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [invitationCode, setInvitationCode] = useState('');
  const [codeValidationState, setCodeValidationState] = useState<{
    valid: boolean;
    checked: boolean;
    message?: string;
  }>({ valid: false, checked: false });

  // Registration fields
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleValidateCode = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!invitationCode.trim()) {
      setCodeValidationState({
        valid: false,
        checked: true,
        message: 'Please enter an invitation token to continue.',
      });
      return;
    }

    const res = invitationService.validateCode(invitationCode);
    if (res.valid) {
      setCodeValidationState({
        valid: true,
        checked: true,
        message: 'Valid Invitation Token. You may now complete account registration.',
      });
      setStep(2);
    } else {
      setCodeValidationState({
        valid: false,
        checked: true,
        message: res.reason || 'Invalid invitation code.',
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !email.trim() || !password) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('You must accept the Nexorina Platform Terms of Service.');
      return;
    }

    const res = userApi.register({
      invitationCode,
      username,
      email,
      password,
    });

    if (res.success) {
      setStep(3);
      setTimeout(() => {
        onSuccess(res.data);
      }, 1800);
    } else {
      setErrorMessage(res.error?.message || 'Registration failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-md rounded-3xl border border-white/[0.1] bg-[#0A0D18] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/15 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <KeyRound className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-display">
                  Nexorina Exclusive Onboarding
                </h3>
                <span className="text-[10px] font-mono text-slate-400">
                  INVITATION-ONLY PROTOCOL
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white rounded-lg p-1 hover:bg-white/[0.05]"
            >
              ✕
            </button>
          </div>

          {/* Stepper indicator */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
            <span className={step >= 1 ? 'text-indigo-400 font-bold' : ''}>
              1. Invite Code
            </span>
            <span>→</span>
            <span className={step >= 2 ? 'text-indigo-400 font-bold' : ''}>
              2. Credentials
            </span>
            <span>→</span>
            <span className={step >= 3 ? 'text-emerald-400 font-bold' : ''}>
              3. Activated
            </span>
          </div>

          {/* Step 1: Code Verification */}
          {step === 1 && (
            <form onSubmit={handleValidateCode} className="space-y-4">
              <div className="p-3.5 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-xs text-slate-300 leading-relaxed">
                Nexorina is an exclusive fintech and quant node network. An approved{' '}
                <strong className="text-white">Invitation Code</strong> is strictly required to create an account.
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1.5 font-medium">
                  Enter Your Invitation Token:
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={invitationCode}
                    onChange={(e) => {
                      setInvitationCode(e.target.value.toUpperCase());
                      setCodeValidationState({ valid: false, checked: false });
                    }}
                    placeholder="e.g. NEXO-VIP-7782"
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-10 pr-3 py-2.5 text-xs text-white uppercase font-mono tracking-wider focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {codeValidationState.checked && !codeValidationState.valid && (
                  <p className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1 font-mono">
                    <AlertCircle className="h-3 w-3" />
                    <span>{codeValidationState.message}</span>
                  </p>
                )}
              </div>

              {/* Demo Hint Helper */}
              <div className="p-3 rounded-xl bg-indigo-500/[0.05] border border-indigo-500/20 text-xs">
                <span className="text-[11px] text-indigo-300 font-semibold block mb-1">
                  Active Sandbox Invite Codes for Testing:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['NEXO-VIP-7782', 'ALPHA-NODE-9901'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setInvitationCode(c)}
                      className="px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-500/30 text-[10px] font-mono text-indigo-300 hover:text-white"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" variant="primary" className="w-full justify-center">
                  Verify & Continue
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </form>
          )}

          {/* Step 2: Account Registration */}
          {step === 2 && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/25 text-xs text-emerald-300">
                <span className="font-mono">Token: {invitationCode}</span>
                <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded font-bold">
                  VALIDATED
                </span>
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="text-xs text-slate-300 block mb-1">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="trader_alpha"
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@domain.com"
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded accent-indigo-600"
                />
                <label htmlFor="terms" className="text-[11px] text-slate-400 leading-snug">
                  I agree to the Terms of Service, Confidentiality Policy, and Risk Disclaimer.
                </label>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(1)}
                  className="w-1/3"
                >
                  Back
                </Button>
                <Button type="submit" variant="primary" size="sm" className="w-2/3 justify-center">
                  Create Account
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Success Screen */}
          {step === 3 && (
            <div className="py-6 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="text-base font-bold text-white font-display">
                Account Successfully Created!
              </h4>
              <p className="text-xs text-slate-300 max-w-xs mx-auto">
                Invitation token successfully redeemed. Redirecting to your personal control center...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
