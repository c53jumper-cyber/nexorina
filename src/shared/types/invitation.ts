export type InvitationStatus = 'Active' | 'Expired' | 'Disabled' | 'Used Up';

export interface InvitationCode {
  id: string;
  code: string;
  creatorAdminId: string;
  creatorAdminName: string;
  creationDate: string;
  expiresAt: string;
  usageLimit: number;
  usedCount: number;
  remainingCount: number;
  status: InvitationStatus;
  notes?: string;
  usedByUsers: {
    userId: string;
    username: string;
    email: string;
    registeredAt: string;
    ipAddress: string;
  }[];
}

export interface RegisterWithInvitationPayload {
  invitationCode: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}
