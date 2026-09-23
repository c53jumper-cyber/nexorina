/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Nexorina Layered User Access & Verification System - Core Type Definitions
 * 
 * Defines the contract between the future Backend/Authorization Engine
 * and the User Application UI.
 */

export type UserAccessState =
  | 'Invited'
  | 'Registered'
  | 'Assessment Pending'
  | 'Assessment Completed'
  | 'Under Review'
  | 'Verified'
  | 'Rejected'
  | 'Suspended'
  | 'Restricted';

export type AccessLevelId = 0 | 1 | 2 | 3 | 4;

export interface AccessLevelConfig {
  id: AccessLevelId;
  name: string;
  tierTitle: string;
  description: string;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
  unlockedModules: string[];
  maxDailyVolumeUsd: number;
  canAccessApi: boolean;
  canAccessAiTrading: boolean;
  canAccessSpecialistBounties: boolean;
  isInternalOnly: boolean;
}

export interface UserAccessSession {
  userId: string;
  username: string;
  invitationCode: string;
  accessState: UserAccessState;
  accessLevel: AccessLevelId;
  assessmentScore?: number;
  submittedAt?: string;
  verifiedAt?: string;
  reviewerNotes?: string;
  allowedModules: string[];
  restrictions?: string[];
}

/**
 * Architectural Placeholders for Future Backend Domains
 * (user_access, access_levels, invitations, assessments, verification, access_events)
 */

export interface AssessmentQuestion {
  id: string;
  prompt: string;
  category: 'risk_management' | 'security_protocols' | 'platform_rules';
  options: { id: string; label: string }[];
  required: boolean;
}

export interface AssessmentAttempt {
  attemptId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  answers: Record<string, string>;
  status: 'in_progress' | 'submitted' | 'approved' | 'rejected';
}

export interface AccessEventLog {
  id: string;
  timestamp: string;
  userId: string;
  previousState: UserAccessState;
  newState: UserAccessState;
  assignedLevel?: AccessLevelId;
  trigger: 'user_submission' | 'reviewer_decision' | 'system_policy';
}

/**
 * Private Access Application & Invitation Architecture
 */

export type ApplicationStatus =
  | 'Pending'
  | 'Approved'
  | 'Rejected'
  | 'Expired'
  | 'Withdrawn'
  | 'Invited'
  | 'Registered';

export interface AccessApplicationRequest {
  id: string;
  email: string;
  purpose: string;
  specialization?: string;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
}

export type InvitationStatus = 'unused' | 'used' | 'expired' | 'revoked';

export interface InvitationRecord {
  id: string;
  token: string;
  recipientEmail: string;
  createdAt: string;
  expiresAt: string;
  status: InvitationStatus;
  accessLevel: AccessLevelId;
  inviterInfo?: string;
  usedAt?: string;
  registeredUsername?: string;
}
