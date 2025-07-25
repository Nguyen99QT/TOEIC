/**
 * ================================================================
 * MEMBERSHIP SERVICE
 * ================================================================
 */

import apiClient from './apiRequest';

export interface MembershipStatus {
  membershipType: 'FREE' | 'PREMIUM';
  expiresAt: string | null;
  isExpired: boolean;
  daysRemaining: number | null;
}

/**
 * Get current user's membership status
 */
export const getMembershipStatus = async (): Promise<MembershipStatus> => {
  const response = await apiClient.get('/api/membership/status');
  return response.data;
};

/**
 * Format remaining time for display
 */
export const formatRemainingTime = (daysRemaining: number | null): string => {
  if (daysRemaining === null) return 'Unlimited';
  if (daysRemaining <= 0) return 'Expired';
  if (daysRemaining === 1) return '1 day remaining';
  return `${daysRemaining} days remaining`;
};

/**
 * Format expiry date for display
 */
export const formatExpiryDate = (expiresAt: string | null): string => {
  if (!expiresAt) return 'Never expires';
  const date = new Date(expiresAt);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
