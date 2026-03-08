import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import WorkspaceMember from '../models/WorkspaceMember';

// Middleware to check if user has a specific role in a workspace
export const checkWorkspaceRole = (allowedRoles: string[]) => {
    return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const workspaceId = req.params.workspaceId || req.params.id;
            const userId = req.user?._id;

            if (!workspaceId || !userId) {
                res.status(400).json({ success: false, message: 'Workspace ID or User ID missing' });
                return;
            }

            const member = await WorkspaceMember.findOne({ workspaceId, userId });

            if (!member) {
                res.status(403).json({ success: false, message: 'You are not a member of this workspace' });
                return;
            }

            if (!allowedRoles.includes(member.role)) {
                res.status(403).json({ success: false, message: `Access denied. Requires one of: ${allowedRoles.join(', ')}` });
                return;
            }

            next();
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message || 'Role middleware error' });
        }
    };
};
