import { SystemRole, SystemResource, PermissionAction, RoleDefinition } from '../../shared/types/rbac';

export const SYSTEM_ROLES_CONFIG: Record<SystemRole, RoleDefinition> = {
  'Super Admin': {
    id: 'role-super-admin',
    role: 'Super Admin',
    titleFa: 'مدیر ارشد کل (سوپر ادمین)',
    descriptionFa: 'بالاترین سطح دسترسی؛ کنترل کامل سیستم، مدیریت مدیران، تنظیمات زیرساخت و تایید نهایی.',
    isSystemProtected: true,
    permissions: [
      { resource: 'dashboard', actions: ['read', 'write', 'audit'] },
      { resource: 'users', actions: ['read', 'write', 'delete', 'audit', 'approve'] },
      { resource: 'invitations', actions: ['read', 'write', 'delete', 'audit'] },
      { resource: 'mining', actions: ['read', 'write', 'delete', 'audit'] },
      { resource: 'casino', actions: ['read', 'write', 'delete', 'audit'] },
      { resource: 'trader', actions: ['read', 'write', 'delete', 'audit'] },
      { resource: 'ai_trading', actions: ['read', 'write', 'delete', 'audit'] },
      { resource: 'ai_bots', actions: ['read', 'write', 'delete', 'audit'] },
      { resource: 'campaigns', actions: ['read', 'write', 'delete', 'audit'] },
      { resource: 'social_growth', actions: ['read', 'write', 'delete', 'audit'] },
      { resource: 'wallet', actions: ['read', 'write', 'approve', 'audit'] },
      { resource: 'rewards', actions: ['read', 'write', 'approve', 'audit'] },
      { resource: 'transactions', actions: ['read', 'audit'] },
      { resource: 'reports', actions: ['read', 'audit'] },
      { resource: 'logs', actions: ['read', 'audit'] },
      { resource: 'audit', actions: ['read', 'audit'] },
      { resource: 'settings', actions: ['read', 'write', 'audit', 'approve'] },
      { resource: 'rbac', actions: ['read', 'write', 'delete', 'audit'] },
    ],
  },
  'Admin': {
    id: 'role-admin',
    role: 'Admin',
    titleFa: 'مدیر سیستم',
    descriptionFa: 'مدیریت کاربران، کمپین‌ها، ماژول‌های فعال و نظارت کلی بر عملیات روزانه پلتفرم.',
    isSystemProtected: true,
    permissions: [
      { resource: 'dashboard', actions: ['read'] },
      { resource: 'users', actions: ['read', 'write'] },
      { resource: 'invitations', actions: ['read', 'write'] },
      { resource: 'mining', actions: ['read', 'write'] },
      { resource: 'casino', actions: ['read', 'write'] },
      { resource: 'trader', actions: ['read', 'write'] },
      { resource: 'ai_trading', actions: ['read', 'write'] },
      { resource: 'ai_bots', actions: ['read', 'write'] },
      { resource: 'campaigns', actions: ['read', 'write'] },
      { resource: 'social_growth', actions: ['read', 'write'] },
      { resource: 'wallet', actions: ['read'] },
      { resource: 'rewards', actions: ['read', 'write'] },
      { resource: 'transactions', actions: ['read'] },
      { resource: 'reports', actions: ['read'] },
      { resource: 'logs', actions: ['read'] },
      { resource: 'audit', actions: ['read'] },
      { resource: 'settings', actions: ['read'] },
      { resource: 'rbac', actions: ['read'] },
    ],
  },
  'Manager': {
    id: 'role-manager',
    role: 'Manager',
    titleFa: 'مدیر عملیات و کمپین‌ها',
    descriptionFa: 'مدیریت کمپین‌های تبلیغاتی، تسک‌های معاملاتی و هدایت رشد شبکه‌های اجتماعی.',
    permissions: [
      { resource: 'dashboard', actions: ['read'] },
      { resource: 'users', actions: ['read'] },
      { resource: 'campaigns', actions: ['read', 'write'] },
      { resource: 'social_growth', actions: ['read', 'write'] },
      { resource: 'trader', actions: ['read'] },
      { resource: 'reports', actions: ['read'] },
    ],
  },
  'Finance': {
    id: 'role-finance',
    role: 'Finance',
    titleFa: 'مدیر امور مالی و خزانه‌داری',
    descriptionFa: 'بررسی تسویه‌حساب‌ها، موجودی کیف‌پول‌ها، پاداش‌های ماینینگ و بررسی تراکنش‌های ارزی.',
    permissions: [
      { resource: 'dashboard', actions: ['read'] },
      { resource: 'wallet', actions: ['read', 'write', 'approve'] },
      { resource: 'rewards', actions: ['read', 'write', 'approve'] },
      { resource: 'transactions', actions: ['read'] },
      { resource: 'reports', actions: ['read'] },
      { resource: 'audit', actions: ['read'] },
    ],
  },
  'Support': {
    id: 'role-support',
    role: 'Support',
    titleFa: 'کارشناس پشتیبانی',
    descriptionFa: 'مشاهده اطلاعات حساب کاربران، پیگیری تیکت‌های پشتیبانی و ثبت گزارش‌های اولیه.',
    permissions: [
      { resource: 'dashboard', actions: ['read'] },
      { resource: 'users', actions: ['read'] },
      { resource: 'transactions', actions: ['read'] },
    ],
  },
  'Moderator': {
    id: 'role-moderator',
    role: 'Moderator',
    titleFa: 'ناظر محتوا و کامیونیتی',
    descriptionFa: 'بررسی فعالیت‌های شبکه‌های اجتماعی، نظارت بر کمپین‌ها و تایید مشارکت‌های مردمی.',
    permissions: [
      { resource: 'dashboard', actions: ['read'] },
      { resource: 'campaigns', actions: ['read'] },
      { resource: 'social_growth', actions: ['read', 'write'] },
    ],
  },
  'Analyst': {
    id: 'role-analyst',
    role: 'Analyst',
    titleFa: 'تحلیل‌گر داده و هوش تجاری',
    descriptionFa: 'دسترسی فقط‌خواندنی به گزارش‌ها، شاخص‌های عملکرد مالی و روندهای رشد پلتفرم.',
    permissions: [
      { resource: 'dashboard', actions: ['read'] },
      { resource: 'reports', actions: ['read'] },
      { resource: 'logs', actions: ['read'] },
    ],
  },
  'User': {
    id: 'role-user',
    role: 'User',
    titleFa: 'کاربر عادی پلتفرم',
    descriptionFa: 'کاربر نهایی با دسترسی انحصاری به پنل کاربری انگلیسی و امکانات تعاملی استاندارد.',
    permissions: [],
  },
};

/**
 * Server-side RBAC validation function
 */
export function hasPermission(
  role: SystemRole,
  resource: SystemResource,
  action: PermissionAction = 'read'
): boolean {
  if (role === 'Super Admin') return true;
  if (role === 'User') return false; // Users have ZERO access to admin resources

  const roleDef = SYSTEM_ROLES_CONFIG[role];
  if (!roleDef) return false;

  const resPermission = roleDef.permissions.find((p) => p.resource === resource);
  if (!resPermission) return false;

  return resPermission.actions.includes(action);
}

/**
 * Validates whether a given role is allowed to access the Admin Application.
 * Strictest security check: if role === 'User', strictly throws 403 Forbidden.
 */
export function validateAdminPanelAccess(role: SystemRole): {
  allowed: boolean;
  errorCode?: 401 | 403;
  errorMessageFa?: string;
  errorMessageEn?: string;
} {
  if (role === 'User') {
    return {
      allowed: false,
      errorCode: 403,
      errorMessageFa: 'دسترسی غیرمجاز: حساب کاربری شما فاقد مجوزهای مدیریتی است.',
      errorMessageEn: 'Access Denied: Your account does not possess administrative privileges.',
    };
  }

  return { allowed: true };
}
