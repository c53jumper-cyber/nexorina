export type AuditActionType =
  | 'CONFIG_CHANGE'
  | 'BALANCE_ADJUSTMENT'
  | 'REWARD_OVERRIDE'
  | 'CAMPAIGN_STATUS_CHANGE'
  | 'USER_STATUS_CHANGE'
  | 'PERMISSION_MODIFIED'
  | 'SYSTEM_PARAMETER_UPDATE'
  | 'INVITATION_GENERATED'
  | 'INVITATION_REVOKED'
  | 'SECURITY_POLICY_UPDATE';

export interface AuditLogItem {
  id: string;
  adminId: string;
  adminName: string;
  adminRole: string;
  action: AuditActionType;
  actionTitleFa: string;
  target: string;
  previousValue: string;
  newValue: string;
  ipAddress: string;
  userAgent?: string;
  timestamp: string;
  result: 'SUCCESS' | 'FAILED' | 'PENDING_APPROVAL';
  requiresMultiSig?: boolean;
}
