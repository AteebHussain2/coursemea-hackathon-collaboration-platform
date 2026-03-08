import crypto from 'crypto';

/**
 * Generates a unique invite token for workspace invitations
 */
export const generateInviteToken = (): string => {
    return crypto.randomBytes(16).toString('hex');
};
