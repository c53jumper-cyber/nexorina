import { SystemRole } from '../../shared/types/rbac';
import { AuthState, UserSession, SecurityEvent } from '../../shared/types/auth';
import { invitationService } from '../invitations/invitationService';

export const DEMO_OPERATORS: Record<SystemRole, { id: string; username: string; email: string; fullName: string }> = {
  'Super Admin': {
    id: 'adm-super-1',
    username: 'sarah_root',
    email: 'sarah.jenkins@nexorina.internal',
    fullName: 'Sarah Jenkins (Super Admin)',
  },
  'Admin': {
    id: 'adm-ops-1',
    username: 'marcus_ops',
    email: 'marcus.vance@nexorina.internal',
    fullName: 'Marcus Vance (System Admin)',
  },
  'Finance': {
    id: 'adm-fin-1',
    username: 'david_treasury',
    email: 'david.k@nexorina.internal',
    fullName: 'David K. (Finance Lead)',
  },
  'Manager': {
    id: 'adm-mgr-1',
    username: 'olivia_growth',
    email: 'olivia.m@nexorina.internal',
    fullName: 'Olivia Martinez (Operations Manager)',
  },
  'Support': {
    id: 'adm-sup-1',
    username: 'liam_support',
    email: 'liam.s@nexorina.internal',
    fullName: 'Liam Chen (Support Specialist)',
  },
  'Moderator': {
    id: 'adm-mod-1',
    username: 'maya_mod',
    email: 'maya.r@nexorina.internal',
    fullName: 'Maya Rostova (Community Moderator)',
  },
  'Analyst': {
    id: 'adm-ana-1',
    username: 'noah_quant',
    email: 'noah.b@nexorina.internal',
    fullName: 'Noah Becker (Data Analyst)',
  },
  'User': {
    id: 'usr-regular-101',
    username: 'alex_trader',
    email: 'alex@nexorina.internal',
    fullName: 'Alex Morgan (Verified User)',
  },
};

export const INITIAL_SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: 'sec-1',
    eventType: 'LOGIN_SUCCESS',
    severity: 'low',
    details: 'Hardware key 2FA verified via YubiKey FIDO2',
    ipAddress: '185.191.171.42',
    timestamp: '2026-09-22 11:30 UTC',
  },
  {
    id: 'sec-2',
    eventType: 'LOGIN_FAILED',
    severity: 'medium',
    details: 'Invalid password attempt on operator account (marcus_ops)',
    ipAddress: '45.133.1.20',
    timestamp: '2026-09-21 22:15 UTC',
  },
  {
    id: 'sec-3',
    eventType: '2FA_CHALLENGE',
    severity: 'low',
    details: 'New browser fingerprint detected; TOTP code challenged and passed',
    ipAddress: '91.240.118.89',
    timestamp: '2026-09-20 18:25 UTC',
  },
];

class AuthService {
  private currentRole: SystemRole = 'Super Admin';
  private securityEvents: SecurityEvent[] = [...INITIAL_SECURITY_EVENTS];

  getCurrentRole(): SystemRole {
    return this.currentRole;
  }

  setRole(newRole: SystemRole) {
    this.currentRole = newRole;
  }

  getCurrentUser() {
    const operator = DEMO_OPERATORS[this.currentRole];
    return {
      ...operator,
      role: this.currentRole,
      twoFactorEnabled: true,
      registeredAt: '2026-08-01 00:00 UTC',
    };
  }

  getCurrentSession(): UserSession {
    const user = this.getCurrentUser();
    return {
      id: `sess-${user.id}`,
      userId: user.id,
      token: `jwt_simulated_${user.role.toLowerCase().replace(' ', '_')}_token`,
      role: user.role,
      device: 'MacBook Pro (Apple Silicon M3 Max)',
      browser: 'Chrome 128 / macOS 15.0',
      ipAddress: '185.191.171.42',
      location: 'London, United Kingdom',
      createdAt: '2026-09-22 08:00 UTC',
      lastActiveAt: 'Just now',
      isCurrent: true,
    };
  }

  getSecurityEvents(): SecurityEvent[] {
    return [...this.securityEvents];
  }

  registerWithInvitation(payload: {
    invitationCode: string;
    username: string;
    email: string;
    password: string;
  }): { success: boolean; error?: string; user?: any } {
    const validation = invitationService.validateCode(payload.invitationCode);
    if (!validation.valid) {
      return { success: false, error: validation.reason || 'Invalid invitation code' };
    }

    // Simulate account creation
    const newUserId = `usr-${Date.now()}`;
    invitationService.redeemCode(payload.invitationCode, {
      userId: newUserId,
      username: payload.username,
      email: payload.email,
      ipAddress: '127.0.0.1',
    });

    return {
      success: true,
      user: {
        id: newUserId,
        username: payload.username,
        email: payload.email,
        role: 'User' as SystemRole,
        invitationCodeUsed: payload.invitationCode,
        twoFactorEnabled: false,
        registeredAt: new Date().toISOString(),
      },
    };
  }
}

export const authService = new AuthService();
