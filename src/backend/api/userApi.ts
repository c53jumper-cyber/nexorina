/**
 * Decoupled User Application API Interface
 * Strict Isolation: Only provides resources authorized for the active user session.
 * Error Responses: Friendly English Messages.
 */

import { authService } from '../auth/authService';
import { invitationService } from '../invitations/invitationService';
import {
  MOCK_USER_METRICS,
  INITIAL_ACTIVITIES,
  MINERS_LIST,
  SUPPORTED_CRYPTO_ASSETS,
  CASINO_GAMES,
  TRADER_DAILY_TASKS,
  CAMPAIGNS_LIST,
  TRANSACTIONS_LIST,
  NOTIFICATIONS_LIST,
} from '../../data/mockData';

export interface UserApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export const userApi = {
  getProfile() {
    const user = authService.getCurrentUser();
    return {
      success: true,
      data: user,
    };
  },

  getMetrics() {
    return {
      success: true,
      data: MOCK_USER_METRICS,
    };
  },

  getActivities() {
    return {
      success: true,
      data: INITIAL_ACTIVITIES,
    };
  },

  getMiners() {
    return {
      success: true,
      data: MINERS_LIST,
    };
  },

  getAssets() {
    return {
      success: true,
      data: SUPPORTED_CRYPTO_ASSETS,
    };
  },

  getTraderTasks() {
    return {
      success: true,
      data: TRADER_DAILY_TASKS,
    };
  },

  getCampaigns() {
    return {
      success: true,
      data: CAMPAIGNS_LIST,
    };
  },

  getTransactions() {
    return {
      success: true,
      data: TRANSACTIONS_LIST,
    };
  },

  getNotifications() {
    return {
      success: true,
      data: NOTIFICATIONS_LIST,
    };
  },

  register(payload: { invitationCode: string; username: string; email: string; password: string }) {
    const res = authService.registerWithInvitation(payload);
    if (!res.success) {
      return {
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message: res.error || 'Failed to complete registration. Please check your invitation code.',
        },
      };
    }
    return {
      success: true,
      data: res.user,
    };
  },
};
