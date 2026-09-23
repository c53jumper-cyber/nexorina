/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Clock,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { UserAccessState, AccessLevelId } from '../../shared/types/access';
import { SYSTEM_ACCESS_LEVELS } from '../../shared/constants/accessLevels';

interface AccountVerificationCardProps {
  accessState: UserAccessState;
  accessLevel: AccessLevelId;
  onOpenAssessment: () => void;
  onStateChangeForDemo?: (state: UserAccessState, level: AccessLevelId) => void;
}

export const AccountVerificationCard: React.FC<AccountVerificationCardProps> = ({
  accessState,
  accessLevel,
  onOpenAssessment,
  onStateChangeForDemo,
}) => {
  const [showDemoSwitcher, setShowDemoSwitcher] = useState(false);
  const isVerified = accessState === 'Verified';
  const isPending =
    accessState === 'Assessment Pending' ||
    accessState === 'Registered' ||
    accessState === 'Invited' ||
    accessState === 'Under Review' ||
    accessState === 'Assessment Completed';
  const isRestricted = accessState === 'Restricted' || accessState === 'Suspended' || accessState === 'Rejected';

  const levelConfig = SYSTEM_ACCESS_LEVELS[accessLevel] || SYSTEM_ACCESS_LEVELS[1];

  return (
    <div className="relative rounded-2xl border border-white/[0.08] bg-[#0B0F19] p-4 shadow-lg hover:border-white/[0.12] transition-colors">
      <div className="flex items-center justify-between gap-3">
        {/* Left Section: Icon & Header */}
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
              isVerified
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : isPending
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {isVerified ? (
              <ShieldCheck className="h-4 w-4" />
            ) : isPending ? (
              <Clock className="h-4 w-4" />
            ) : (
              <ShieldAlert className="h-4 w-4" />
            )}
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              {isVerified ? 'Account Status' : 'Account Verification'}
            </div>
            
            {/* Status Display */}
            {isVerified ? (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </span>
                <span className="text-slate-600 text-xs">·</span>
                <span className="text-xs font-mono text-slate-300">
                  Access Level: <strong className={levelConfig.badgeColor}>{levelConfig.tierTitle.split(' — ')[0]}</strong>
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-400 font-mono">Status:</span>
                <span className={`text-xs font-bold font-mono ${isRestricted ? 'text-rose-400' : 'text-amber-400'}`}>
                  {accessState}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Section: Action Button & Demo Switcher */}
        <div className="flex items-center gap-2">
          {!isVerified && !isRestricted && (
            <button
              onClick={onOpenAssessment}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm shadow-indigo-500/20 transition-all group"
            >
              <span>Continue</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {isVerified && (
            <button
              onClick={onOpenAssessment}
              className="px-2.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white text-[11px] font-mono transition-colors"
              title="View verification and access tier specifications"
            >
              Tier Details
            </button>
          )}

          {isRestricted && (
            <span className="text-[11px] font-mono text-rose-400 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 flex items-center gap-1">
              <Lock className="h-3 w-3" />
              Restricted
            </span>
          )}

          {/* Discreet State Switcher for Testing/Demoing */}
          {onStateChangeForDemo && (
            <button
              onClick={() => setShowDemoSwitcher(!showDemoSwitcher)}
              className="p-1.5 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-white/[0.04] transition-colors"
              title="Demo Access State Tester"
            >
              <Sliders className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Expandable Demo State Picker */}
      {showDemoSwitcher && onStateChangeForDemo && (
        <div className="mt-3 pt-3 border-t border-white/[0.06] flex flex-wrap items-center gap-2 text-[10px] font-mono animate-in fade-in duration-150">
          <span className="text-slate-500">Simulate Access State:</span>
          <button
            onClick={() => onStateChangeForDemo('Assessment Pending', 0)}
            className={`px-2 py-0.5 rounded border transition-colors ${
              accessState === 'Assessment Pending'
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'border-white/[0.06] text-slate-400 hover:text-white'
            }`}
          >
            Assessment Pending (L0)
          </button>
          <button
            onClick={() => onStateChangeForDemo('Under Review', 0)}
            className={`px-2 py-0.5 rounded border transition-colors ${
              accessState === 'Under Review'
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'border-white/[0.06] text-slate-400 hover:text-white'
            }`}
          >
            Under Review (L0)
          </button>
          <button
            onClick={() => onStateChangeForDemo('Verified', 1)}
            className={`px-2 py-0.5 rounded border transition-colors ${
              accessState === 'Verified' && accessLevel === 1
                ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                : 'border-white/[0.06] text-slate-400 hover:text-white'
            }`}
          >
            Verified (Level 1)
          </button>
          <button
            onClick={() => onStateChangeForDemo('Verified', 2)}
            className={`px-2 py-0.5 rounded border transition-colors ${
              accessState === 'Verified' && accessLevel === 2
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'border-white/[0.06] text-slate-400 hover:text-white'
            }`}
          >
            Trusted (Level 2)
          </button>
          <button
            onClick={() => onStateChangeForDemo('Restricted', 0)}
            className={`px-2 py-0.5 rounded border transition-colors ${
              accessState === 'Restricted'
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                : 'border-white/[0.06] text-slate-400 hover:text-white'
            }`}
          >
            Restricted
          </button>
        </div>
      )}
    </div>
  );
};
