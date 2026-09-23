/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  FileCheck2,
  Clock,
  ArrowRight,
  ArrowLeft,
  X,
  AlertTriangle,
  Send,
  Sparkles,
  Lock,
} from 'lucide-react';
import { MOCK_ASSESSMENT_QUESTIONS } from '../../shared/constants/accessLevels';
import { UserAccessState, AccessLevelId } from '../../shared/types/access';

interface AssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentState: UserAccessState;
  currentLevel: AccessLevelId;
  onAssessmentCompleted: (newState: UserAccessState, newLevel: AccessLevelId) => void;
}

type Step = 'intro' | 'rules' | 'questions' | 'submitted' | 'review_status';

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  isOpen,
  onClose,
  currentState,
  currentLevel,
  onAssessmentCompleted,
}) => {
  const [step, setStep] = useState<Step>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const questions = MOCK_ASSESSMENT_QUESTIONS;
  const currentQ = questions[currentQuestionIndex];
  const progressPercent = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  const handleSelectAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitAssessment = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('submitted');
      // Transition to 'Under Review' or directly 'Verified' with Access Level 1
      onAssessmentCompleted('Under Review', 0);
    }, 1200);
  };

  const handleSimulateApproval = () => {
    onAssessmentCompleted('Verified', 1);
    setStep('review_status');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl border border-white/[0.1] bg-[#0B0F1E] p-6 shadow-2xl shadow-indigo-500/10 text-left">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          aria-label="Close Assessment Modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-white/[0.08] pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <FileCheck2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-indigo-400">
              Nexorina Protocol Security · Layered Access
            </div>
            <h2 className="text-lg font-bold text-white">
              User Access Assessment & Verification
            </h2>
          </div>
        </div>

        {/* =========================================================================
            STEP 1: INTRO
           ========================================================================= */}
        {step === 'intro' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/20">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold mb-1">
                <Sparkles className="h-4 w-4" />
                <span>Private Platform Assessment</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Nexorina operates under a gated, merit-verified architecture. Before higher operational
                tiers and trading engines are unlocked, all registered accounts must complete this
                foundational security and protocol readiness assessment.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] text-slate-500 block uppercase">Current State</span>
                <span className="text-amber-400 font-bold mt-0.5 block">{currentState}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <span className="text-[10px] text-slate-500 block uppercase">Target Level</span>
                <span className="text-indigo-400 font-bold mt-0.5 block">Level 1 — Verified</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-white/[0.05]"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep('rules')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
              >
                <span>Review Protocol Rules</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: RULES
           ========================================================================= */}
        {step === 'rules' && (
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase font-mono tracking-wider text-slate-300">
              Assessment Standards & Integrity Guidelines
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-100">Singular Identity & Binding</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Your assessment answers will be cryptographically hashed to your invitation ticket.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <Lock className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-100">Autonomous Compliance Check</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Demonstrate understanding of risk management, stop-loss limits, and vault custody.
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                <Clock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-100">Multi-stage Review Pipeline</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Passing this assessment places your profile into reviewer queue for Level 1 activation.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setStep('intro')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep('questions')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
              >
                <span>Start Questions ({questions.length})</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 3: QUESTIONS
           ========================================================================= */}
        {step === 'questions' && currentQ && (
          <div className="space-y-4">
            {/* Progress indicator */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{progressPercent}% Complete</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[10px] uppercase font-mono text-indigo-400 mb-1">
                Category: {currentQ.category.replace('_', ' ')}
              </div>
              <p className="text-sm font-semibold text-white leading-snug">
                {currentQ.prompt}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {currentQ.options.map((opt) => {
                const isSelected = answers[currentQ.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectAnswer(currentQ.id, opt.id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/15 text-white shadow-sm shadow-indigo-500/10'
                        : 'border-white/[0.06] bg-white/[0.01] text-slate-300 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <div
                      className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                        isSelected
                          ? 'border-indigo-400 bg-indigo-500 text-white'
                          : 'border-white/20'
                      }`}
                    >
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  disabled={!answers[currentQ.id]}
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Next Question</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  disabled={!answers[currentQ.id] || isSubmitting}
                  onClick={handleSubmitAssessment}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Submit Assessment'}</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: SUBMITTED (UNDER REVIEW)
           ========================================================================= */}
        {step === 'submitted' && (
          <div className="space-y-4 text-center py-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 mx-auto">
              <Clock className="h-7 w-7 animate-pulse" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Assessment Submitted</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Your assessment answers have been received and logged under ticket{' '}
                <span className="font-mono text-indigo-400 font-semibold">#ASM-9021</span>.
                Your status is currently <span className="text-amber-400 font-semibold">Under Review</span>.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300 font-mono text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Submission State:</span>
                <span className="text-amber-400">Under Review</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Verification Engine:</span>
                <span className="text-slate-300">Queued for Level 1 clearance</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-slate-300 bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
              >
                Close & Return to Dashboard
              </button>
              <button
                onClick={handleSimulateApproval}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors"
              >
                Simulate Review Approval →
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 5: REVIEW STATUS (VERIFIED)
           ========================================================================= */}
        {step === 'review_status' && (
          <div className="space-y-4 text-center py-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto">
              <CheckCircle className="h-7 w-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Verification Confirmed</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Your profile has successfully cleared compliance review. Access Level 1 (Verified User) is now active.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 text-xs font-mono text-left space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Account Status:</span>
                <span className="text-emerald-400 font-bold">Verified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Access Level:</span>
                <span className="text-indigo-400 font-bold">Level 1 — Verified User</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Unlocked Modules:</span>
                <span className="text-slate-300">Trading, Mining, Quests, Wallet</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
            >
              Continue to Verified Platform
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
