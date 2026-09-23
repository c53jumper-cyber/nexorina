import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, Check, X } from 'lucide-react';
import { Button } from '../common/Button';

interface RiskNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  botName: string;
}

export const RiskNoticeModal: React.FC<RiskNoticeModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  botName,
}) => {
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedCapital, setAgreedCapital] = useState(false);

  if (!isOpen) return null;

  const canProceed = agreedTerms && agreedCapital;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl border border-rose-500/30 bg-[#0C0F1A] p-6 shadow-2xl shadow-rose-900/20 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Protocol Risk Notice & Mandatory Disclosure
              </h2>
              <span className="text-xs font-mono text-rose-400">
                Pre-Execution Acknowledgment for {botName}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-white/[0.05]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Core Warning Content */}
        <div className="py-4 space-y-3.5 text-xs text-slate-300 leading-relaxed">
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 flex items-start gap-2.5 text-amber-200">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <strong className="font-semibold block text-amber-300">
                Trading Outcomes Are Not Guaranteed
              </strong>
              <p className="text-[11px] text-amber-200/90 leading-normal">
                Cryptocurrency algorithmic trading involves significant market risk. Outcomes can
                result in both positive gains and negative capital drawdowns. Past simulation metrics
                do not guarantee future results.
              </p>
            </div>
          </div>

          <div className="space-y-2 text-slate-400 text-[11px] bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
            <p>
              • <strong>Simulation Phase Notice:</strong> Currently in Nexorina Stage 03 UI Preview.
              All orders, simulated drawdowns, and trading activities are executed in mock
              environment with zero financial liability.
            </p>
            <p>
              • <strong>Future Live Protocol Terms:</strong> In production, user bots interact with
              decentralized liquidity and automated order routes. Stop-loss parameters and circuit
              breakers must be configured responsibly.
            </p>
          </div>

          {/* Interactive Checkboxes */}
          <div className="space-y-2.5 pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-white/[0.2] bg-white/[0.05] text-indigo-600 focus:ring-0"
              />
              <span className="text-[11px] text-slate-300">
                I understand that algorithmic trading carries market risk and profits are never
                guaranteed or risk-free.
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedCapital}
                onChange={(e) => setAgreedCapital(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-white/[0.2] bg-white/[0.05] text-indigo-600 focus:ring-0"
              />
              <span className="text-[11px] text-slate-300">
                I accept the bot drawdown thresholds and authorize algorithmic execution rules.
              </span>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Decline & Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!canProceed}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={
              canProceed
                ? 'bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30'
                : 'opacity-50 cursor-not-allowed'
            }
          >
            I Acknowledge Risks & Proceed
          </Button>
        </div>
      </div>
    </div>
  );
};
