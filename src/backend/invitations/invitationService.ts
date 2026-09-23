import { InvitationCode, InvitationStatus } from '../../shared/types/invitation';

export const INITIAL_INVITATIONS: InvitationCode[] = [
  {
    id: 'inv-1',
    code: 'NEXO-VIP-7782',
    creatorAdminId: 'admin-super-1',
    creatorAdminName: 'Sarah Jenkins (Super Admin)',
    creationDate: '2026-09-01 10:30 UTC',
    expiresAt: '2026-10-01 23:59 UTC',
    usageLimit: 25,
    usedCount: 14,
    remainingCount: 11,
    status: 'Active',
    notes: 'Institutional Beta Testing allocation',
    usedByUsers: [
      {
        userId: 'usr-101',
        username: 'alex_trader',
        email: 'alex@nexorina.internal',
        registeredAt: '2026-09-05 14:20 UTC',
        ipAddress: '194.26.29.112',
      },
      {
        userId: 'usr-102',
        username: 'elena_quant',
        email: 'elena@quantfund.io',
        registeredAt: '2026-09-10 09:15 UTC',
        ipAddress: '82.165.197.1',
      },
    ],
  },
  {
    id: 'inv-2',
    code: 'ALPHA-NODE-9901',
    creatorAdminId: 'admin-super-1',
    creatorAdminName: 'Sarah Jenkins (Super Admin)',
    creationDate: '2026-09-12 12:00 UTC',
    expiresAt: '2026-11-01 00:00 UTC',
    usageLimit: 50,
    usedCount: 50,
    remainingCount: 0,
    status: 'Used Up',
    notes: 'Solana validator miners partnership batch',
    usedByUsers: [],
  },
  {
    id: 'inv-3',
    code: 'EARLY-BIRD-2026',
    creatorAdminId: 'admin-2',
    creatorAdminName: 'Marcus Vance (Admin)',
    creationDate: '2026-08-15 08:00 UTC',
    expiresAt: '2026-09-15 00:00 UTC',
    usageLimit: 10,
    usedCount: 6,
    remainingCount: 4,
    status: 'Expired',
    notes: 'Early community bounty participants',
    usedByUsers: [],
  },
  {
    id: 'inv-4',
    code: 'SEC-REVOKED-114',
    creatorAdminId: 'admin-super-1',
    creatorAdminName: 'Sarah Jenkins (Super Admin)',
    creationDate: '2026-09-18 16:40 UTC',
    expiresAt: '2026-12-31 23:59 UTC',
    usageLimit: 5,
    usedCount: 1,
    remainingCount: 4,
    status: 'Disabled',
    notes: 'Suspicious origin revoked by security operator',
    usedByUsers: [],
  },
];

class InvitationService {
  private invitations: InvitationCode[] = [...INITIAL_INVITATIONS];

  getAll(): InvitationCode[] {
    return [...this.invitations];
  }

  getById(id: string): InvitationCode | undefined {
    return this.invitations.find((i) => i.id === id);
  }

  validateCode(code: string): { valid: boolean; reason?: string; invitation?: InvitationCode } {
    const cleanCode = code.trim().toUpperCase();
    const inv = this.invitations.find((i) => i.code.toUpperCase() === cleanCode);

    if (!inv) {
      return { valid: false, reason: 'Invalid invitation code. Nexorina requires a verified invite token.' };
    }

    if (inv.status === 'Disabled') {
      return { valid: false, reason: 'This invitation code has been disabled by security governance.' };
    }

    if (inv.status === 'Expired') {
      return { valid: false, reason: 'This invitation code has expired.' };
    }

    if (inv.remainingCount <= 0 || inv.status === 'Used Up') {
      return { valid: false, reason: 'This invitation code has reached its maximum redemptions limit.' };
    }

    return { valid: true, invitation: inv };
  }

  createInvitation(payload: {
    code?: string;
    usageLimit: number;
    expiresAt: string;
    notes?: string;
    creatorAdminId: string;
    creatorAdminName: string;
  }): InvitationCode {
    const generatedCode =
      payload.code && payload.code.trim().length > 0
        ? payload.code.trim().toUpperCase()
        : `NEXO-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInv: InvitationCode = {
      id: `inv-${Date.now()}`,
      code: generatedCode,
      creatorAdminId: payload.creatorAdminId,
      creatorAdminName: payload.creatorAdminName,
      creationDate: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      expiresAt: payload.expiresAt,
      usageLimit: payload.usageLimit,
      usedCount: 0,
      remainingCount: payload.usageLimit,
      status: 'Active',
      notes: payload.notes || 'Generated via Administrative Console',
      usedByUsers: [],
    };

    this.invitations.unshift(newInv);
    return newInv;
  }

  updateStatus(id: string, nextStatus: InvitationStatus): boolean {
    const inv = this.invitations.find((i) => i.id === id);
    if (!inv) return false;
    inv.status = nextStatus;
    return true;
  }

  redeemCode(code: string, user: { userId: string; username: string; email: string; ipAddress: string }): boolean {
    const validation = this.validateCode(code);
    if (!validation.valid || !validation.invitation) return false;

    const target = validation.invitation;
    target.usedCount += 1;
    target.remainingCount = Math.max(0, target.usageLimit - target.usedCount);

    if (target.remainingCount === 0) {
      target.status = 'Used Up';
    }

    target.usedByUsers.push({
      ...user,
      registeredAt: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
    });

    return true;
  }
}

export const invitationService = new InvitationService();
