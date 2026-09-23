// Role-Based Access Control (RBAC) Types
export type SystemRole =
  | 'Super Admin'
  | 'Admin'
  | 'Manager'
  | 'Support'
  | 'Finance'
  | 'Moderator'
  | 'Analyst'
  | 'User';

export type PermissionAction = 'read' | 'write' | 'delete' | 'audit' | 'approve' | 'execute';

export type SystemResource =
  | 'dashboard'
  | 'users'
  | 'invitations'
  | 'mining'
  | 'casino'
  | 'trader'
  | 'ai_trading'
  | 'ai_bots'
  | 'campaigns'
  | 'social_growth'
  | 'wallet'
  | 'rewards'
  | 'transactions'
  | 'reports'
  | 'logs'
  | 'audit'
  | 'settings'
  | 'rbac';

export interface RoleDefinition {
  id: string;
  role: SystemRole;
  titleFa: string;
  descriptionFa: string;
  permissions: {
    resource: SystemResource;
    actions: PermissionAction[];
  }[];
  isSystemProtected?: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: SystemRole;
  fullName: string;
  avatar?: string;
  status: 'active' | 'suspended' | 'deactivated';
  lastLoginAt: string;
  lastLoginIp: string;
  twoFactorEnabled: boolean;
  department: string;
}
