import { SystemRole } from './rbac';

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  role: SystemRole;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  createdAt: string;
  lastActiveAt: string;
  isCurrent: boolean;
}

export interface SecurityEvent {
  id: string;
  userId?: string;
  eventType: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'PASSWORD_CHANGE' | '2FA_CHALLENGE' | 'SUSPICIOUS_IP';
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: {
    id: string;
    username: string;
    email: string;
    role: SystemRole;
    invitationCodeUsed?: string;
    twoFactorEnabled: boolean;
    registeredAt: string;
  } | null;
  currentSession: UserSession | null;
}
