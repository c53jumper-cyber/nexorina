/**
 * Decoupled Admin Application API Interface
 * Enforces role authorization and records administrative operations in the Audit Log.
 * Error Responses: Detailed Persian Messages with technical error codes.
 */

import { authService } from '../auth/authService';
import { auditLogger } from '../audit/auditLogger';
import { invitationService } from '../invitations/invitationService';
import { hasPermission, validateAdminPanelAccess } from '../permissions/rbac';
import { AuditActionType } from '../../shared/types/audit';

export interface AdminApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    messageFa: string;
    messageEn: string;
    details?: string;
  };
}

export const adminApi = {
  checkAdminAccess() {
    const role = authService.getCurrentRole();
    const validation = validateAdminPanelAccess(role);
    if (!validation.allowed) {
      return {
        success: false,
        error: {
          code: 'ERR_FORBIDDEN_403',
          messageFa: validation.errorMessageFa || 'دسترسی غیرمجاز به کنترل پنل مدیریت.',
          messageEn: validation.errorMessageEn || 'Access Denied: Administrative role required.',
        },
      };
    }
    return {
      success: true,
      data: {
        operator: authService.getCurrentUser(),
        role,
      },
    };
  },

  getAuditLogs() {
    const role = authService.getCurrentRole();
    if (!hasPermission(role, 'audit', 'read')) {
      return {
        success: false,
        error: {
          code: 'ERR_PERMISSION_DENIED',
          messageFa: 'شما دسترسی لازم برای مشاهده لاگ‌های حسابرسی سیستم را ندارید.',
          messageEn: 'Permission denied: Cannot read audit logs.',
        },
      };
    }
    return {
      success: true,
      data: auditLogger.getLogs(),
    };
  },

  getInvitations() {
    const role = authService.getCurrentRole();
    if (!hasPermission(role, 'invitations', 'read')) {
      return {
        success: false,
        error: {
          code: 'ERR_PERMISSION_DENIED',
          messageFa: 'شما مجوز مشاهده و مدیریت کدهای دعوت سیستم را ندارید.',
          messageEn: 'Permission denied: Cannot read invitations.',
        },
      };
    }
    return {
      success: true,
      data: invitationService.getAll(),
    };
  },

  createInvitation(payload: {
    code?: string;
    usageLimit: number;
    expiresAt: string;
    notes?: string;
  }) {
    const role = authService.getCurrentRole();
    if (!hasPermission(role, 'invitations', 'write')) {
      return {
        success: false,
        error: {
          code: 'ERR_PERMISSION_DENIED',
          messageFa: 'عدم دسترسی: ثبت کد دعوت جدید نیازمند نقش‌های ارشد مدیریتی است.',
          messageEn: 'Permission denied: Cannot issue invitations.',
        },
      };
    }

    const operator = authService.getCurrentUser();
    const newInv = invitationService.createInvitation({
      ...payload,
      creatorAdminId: operator.id,
      creatorAdminName: operator.fullName,
    });

    // Record in Audit Log
    auditLogger.logAction({
      adminId: operator.id,
      adminName: operator.fullName,
      adminRole: operator.role,
      action: 'INVITATION_GENERATED',
      actionTitleFa: 'تولید کد دعوت جدید برای کاربران',
      target: `کد دعوت: ${newInv.code}`,
      previousValue: 'None',
      newValue: `سقف استفاده: ${newInv.usageLimit} نفر | انقضا: ${newInv.expiresAt}`,
    });

    return {
      success: true,
      data: newInv,
    };
  },

  updateInvitationStatus(id: string, status: any) {
    const role = authService.getCurrentRole();
    if (!hasPermission(role, 'invitations', 'write')) {
      return {
        success: false,
        error: {
          code: 'ERR_PERMISSION_DENIED',
          messageFa: 'عدم دسترسی: تغییر وضعیت کد دعوت مجاز نمی‌باشد.',
          messageEn: 'Permission denied: Cannot modify invitation status.',
        },
      };
    }

    const inv = invitationService.getById(id);
    if (!inv) {
      return {
        success: false,
        error: {
          code: 'ERR_NOT_FOUND',
          messageFa: 'کد دعوت موردنظر در پایگاه داده یافت نشد.',
          messageEn: 'Invitation not found.',
        },
      };
    }

    const prev = inv.status;
    invitationService.updateStatus(id, status);

    const operator = authService.getCurrentUser();
    auditLogger.logAction({
      adminId: operator.id,
      adminName: operator.fullName,
      adminRole: operator.role,
      action: 'INVITATION_REVOKED',
      actionTitleFa: 'تغییر وضعیت یا ابطال کد دعوت',
      target: `کد دعوت: ${inv.code}`,
      previousValue: `وضعیت قبلی: ${prev}`,
      newValue: `وضعیت جدید: ${status}`,
    });

    return {
      success: true,
      data: inv,
    };
  },

  recordSensitiveAction(payload: {
    action: AuditActionType;
    actionTitleFa: string;
    target: string;
    previousValue: string;
    newValue: string;
  }) {
    const operator = authService.getCurrentUser();
    const entry = auditLogger.logAction({
      adminId: operator.id,
      adminName: operator.fullName,
      adminRole: operator.role,
      ...payload,
    });
    return {
      success: true,
      data: entry,
    };
  },
};
