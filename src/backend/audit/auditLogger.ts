import { AuditLogItem, AuditActionType } from '../../shared/types/audit';

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'aud-1',
    adminId: 'admin-super-1',
    adminName: 'Sarah Jenkins',
    adminRole: 'Super Admin',
    action: 'SYSTEM_PARAMETER_UPDATE',
    actionTitleFa: 'تغییر سقف دراوداون جهانی ربات‌ها',
    target: 'Global Risk Engine / Max Drawdown Circuit Breaker',
    previousValue: '15.0% Stop Limit',
    newValue: '12.5% Conservative Limit',
    ipAddress: '185.191.171.42',
    timestamp: '2026-09-22 11:45 UTC',
    result: 'SUCCESS',
  },
  {
    id: 'aud-2',
    adminId: 'admin-super-1',
    adminName: 'Sarah Jenkins',
    adminRole: 'Super Admin',
    action: 'PERMISSION_MODIFIED',
    actionTitleFa: 'ارتقای سطح دسترسی اپراتور',
    target: 'Operator: Marcus Vance (usr-adm-2)',
    previousValue: 'Role: Support',
    newValue: 'Role: Manager (Operations & Campaigns)',
    ipAddress: '185.191.171.42',
    timestamp: '2026-09-22 09:20 UTC',
    result: 'SUCCESS',
  },
  {
    id: 'aud-3',
    adminId: 'admin-fin-1',
    adminName: 'David K.',
    adminRole: 'Finance',
    action: 'REWARD_OVERRIDE',
    actionTitleFa: 'تنظیم ضریب پاداش استخر ماینینگ بیت‌کوین',
    target: 'Stratum Pool SHA-256 Multiplier',
    previousValue: 'Base Rate 1.00x ($0.042/TH)',
    newValue: 'Boosted Rate 1.15x ($0.048/TH)',
    ipAddress: '91.240.118.89',
    timestamp: '2026-09-21 16:10 UTC',
    result: 'SUCCESS',
  },
  {
    id: 'aud-4',
    adminId: 'admin-super-1',
    adminName: 'Sarah Jenkins',
    adminRole: 'Super Admin',
    action: 'INVITATION_REVOKED',
    actionTitleFa: 'مسدودسازی کد دعوت مشکوک',
    target: 'Invite Code: SEC-REVOKED-114',
    previousValue: 'Status: Active (5 remaining)',
    newValue: 'Status: Disabled (Access Terminated)',
    ipAddress: '185.191.171.42',
    timestamp: '2026-09-21 14:05 UTC',
    result: 'SUCCESS',
  },
  {
    id: 'aud-5',
    adminId: 'admin-fin-1',
    adminName: 'David K.',
    adminRole: 'Finance',
    action: 'BALANCE_ADJUSTMENT',
    actionTitleFa: 'تسویه دستی کارمزد شبکه کاربر',
    target: 'User Vault: usr-8842 (ETH Gas Rebalance)',
    previousValue: '$1,200.00 Collateral',
    newValue: '$1,245.50 (Refund Applied)',
    ipAddress: '91.240.118.89',
    timestamp: '2026-09-20 18:30 UTC',
    result: 'SUCCESS',
    requiresMultiSig: true,
  },
  {
    id: 'aud-6',
    adminId: 'admin-2',
    adminName: 'Marcus Vance',
    adminRole: 'Manager',
    action: 'CAMPAIGN_STATUS_CHANGE',
    actionTitleFa: 'فعال‌سازی فاز سوم کمپین تلگرام',
    target: 'Campaign: Telegram Alpha Node Growth',
    previousValue: 'Status: In Review',
    newValue: 'Status: Live (Bounty: $110.00)',
    ipAddress: '178.62.204.18',
    timestamp: '2026-09-20 10:15 UTC',
    result: 'SUCCESS',
  },
];

class AuditLogger {
  private logs: AuditLogItem[] = [...INITIAL_AUDIT_LOGS];

  getLogs(): AuditLogItem[] {
    return [...this.logs];
  }

  logAction(payload: {
    adminId: string;
    adminName: string;
    adminRole: string;
    action: AuditActionType;
    actionTitleFa: string;
    target: string;
    previousValue: string;
    newValue: string;
    ipAddress?: string;
    result?: 'SUCCESS' | 'FAILED' | 'PENDING_APPROVAL';
  }): AuditLogItem {
    const entry: AuditLogItem = {
      id: `aud-${Date.now()}`,
      adminId: payload.adminId,
      adminName: payload.adminName,
      adminRole: payload.adminRole,
      action: payload.action,
      actionTitleFa: payload.actionTitleFa,
      target: payload.target,
      previousValue: payload.previousValue,
      newValue: payload.newValue,
      ipAddress: payload.ipAddress || '127.0.0.1 (Internal Proxy)',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      result: payload.result || 'SUCCESS',
    };

    this.logs.unshift(entry);
    return entry;
  }
}

export const auditLogger = new AuditLogger();
