/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { InvitationRecord, AccessApplicationRequest } from '../shared/types/access';

export const MOCK_INVITATIONS: InvitationRecord[] = [
  {
    id: 'inv_nx_9281',
    token: 'nx-alpha-9281',
    recipientEmail: 'lead.trader@algotrend.io',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 22 * 3600 * 1000).toISOString(),
    status: 'unused',
    accessLevel: 1,
    inviterInfo: 'Nexorina Protocol Genesis Pool',
  },
  {
    id: 'inv_nx_0012',
    token: 'nx-expired-0012',
    recipientEmail: 'researcher@staledomain.org',
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    status: 'expired',
    accessLevel: 1,
    inviterInfo: 'Direct Review Allocation',
  },
  {
    id: 'inv_nx_4491',
    token: 'nx-used-4491',
    recipientEmail: 'alex.vance@nexorina.io',
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    status: 'used',
    accessLevel: 1,
    inviterInfo: 'Ecosystem Council Invite',
    usedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    registeredUsername: 'Alex_Vance',
  },
];

export const MOCK_APPLICATIONS: AccessApplicationRequest[] = [
  {
    id: 'app_7729',
    email: 'quant.lead@strata-sys.com',
    purpose: 'Deploying algorithmic market-making liquidity bots on high-frequency cryptocurrency orderbooks.',
    specialization: 'Quantitative Modeling & Automated Execution',
    status: 'Pending',
    submittedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
];
