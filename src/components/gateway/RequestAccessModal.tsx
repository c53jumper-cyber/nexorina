/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Mail,
  FileText,
  Send,
  CheckCircle,
  ShieldCheck,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { AccessApplicationRequest } from '../../shared/types/access';

interface RequestAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (newApp: AccessApplicationRequest) => void;
}

export const RequestAccessModal: React.FC<RequestAccessModalProps> = ({
  isOpen,
  onClose,
  onSubmitSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('');
  const [specialization, setSpecialization] = useState('Quantitative Modeling');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid, reachable email address.');
      return;
    }

    if (purpose.trim().length < 20) {
      setErrorMessage('Please provide a substantive reason for joining (at least 20 characters).');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const ticketId = `APP-${Math.floor(1000 + Math.random() * 9000)}`;
      const newApp: AccessApplicationRequest = {
        id: ticketId.toLowerCase(),
        email: email.trim(),
        purpose: purpose.trim(),
        specialization,
        status: 'Pending',
        submittedAt: new Date().toISOString(),
      };
      setIsSubmitting(false);
      setIsSubmitted(true);
      setSubmittedTicket(ticketId);
      onSubmitSuccess(newApp);
    }, 1000);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setEmail('');
    setPurpose('');
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#0B0F1E] p-6 shadow-2xl text-left">
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-5 border-b border-white/[0.08] pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-400">
                  Selective Admission · Private Network
                </div>
                <h2 className="text-lg font-bold text-white">
                  Request Platform Access
                </h2>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Nexorina does not offer open registration. Applications are individually reviewed
              to preserve platform liquidity, computational resource availability, and participant integrity.
            </p>

            {errorMessage && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Email Address <span className="text-indigo-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.com"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-sans"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Private invitation link will be dispatched to this address if approved.
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Area of Specialization <span className="text-slate-500 text-[10px]">(Optional)</span>
                </label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#101526] border border-white/[0.08] text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Quantitative Modeling">Quantitative Modeling & Algorithmic Strategy</option>
                  <option value="Node & Hashrate Infrastructure">Mining Cluster & Node Infrastructure</option>
                  <option value="Treasury & Vault Operations">Treasury Management & Capital Allocation</option>
                  <option value="Independent Research">Independent Security & Protocol Research</option>
                  <option value="Other Specialist">Other Specialized Field</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Why do you want to join Nexorina? <span className="text-indigo-400">*</span>
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="Outline your background, intended platform operations, and expected computational requirements..."
                  rows={4}
                  required
                  className="w-full p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none leading-relaxed"
                />
                <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                  <span>Minimum 20 characters</span>
                  <span>{purpose.length} chars</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isSubmitting ? 'Transmitting Request...' : 'Submit Access Request'}</span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="py-4 text-center space-y-4 animate-in fade-in">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 mx-auto">
              <CheckCircle className="h-7 w-7 text-indigo-400" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Access Request Received</h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm mx-auto leading-relaxed">
                Your request has been submitted successfully. Your application is currently under review.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Ticket Reference:</span>
                <span className="text-indigo-400 font-bold">#{submittedTicket}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Registered Email:</span>
                <span className="text-slate-200">{email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-amber-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Pending Review
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-left text-xs text-slate-300">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold mb-1">
                <ShieldCheck className="h-4 w-4" />
                <span>Next Step</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                If your request is approved, you will receive a private invitation link by email.
                Access is not guaranteed and invitations carry a strict 24-hour validity lifetime.
              </p>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 text-xs font-semibold transition-colors"
            >
              Close & Return to Gateway
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
