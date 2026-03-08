import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Workspace from '../models/Workspace';
import WorkspaceMember from '../models/WorkspaceMember';
import crypto from 'crypto';

// @desc    Create a new workspace
// @route   POST /api/v1/workspaces
// @access  Private
export const createWorkspace = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, description } = req.body;
        const ownerId = req.user?._id;

        if (!ownerId) {
            res.status(401).json({ success: false, message: 'Not authorized' });
            return;
        }

        // Generate a unique invite token
        const inviteToken = crypto.randomBytes(16).toString('hex');

        // Create workspace
        const workspace = await Workspace.create({
            name,
            description,
            ownerId,
            inviteToken,
        });

        // Add creator as Admin member
        await WorkspaceMember.create({
            workspaceId: workspace._id,
            userId: ownerId,
            role: 'Admin',
        });

        res.status(201).json({
            success: true,
            message: 'Workspace created successfully',
            data: workspace,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Get all workspaces the user belongs to
// @route   GET /api/v1/workspaces
// @access  Private
export const getMyWorkspaces = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;

        // Find all memberships
        const memberships = await WorkspaceMember.find({ userId }).populate('workspaceId');
        const workspaces = memberships.map((m) => m.workspaceId);

        res.status(200).json({
            success: true,
            data: workspaces,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Get workspace details (members, projects, etc.)
// @route   GET /api/v1/workspaces/:id
// @access  Private
export const getWorkspaceDetails = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const workspace = await Workspace.findById(req.params.id);
        if (!workspace) {
            res.status(404).json({ success: false, message: 'Workspace not found' });
            return;
        }

        const members = await WorkspaceMember.find({ workspaceId: workspace._id }).populate('userId', 'name email avatarUrl');

        res.status(200).json({
            success: true,
            data: {
                workspace,
                members,
            },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Update workspace info
// @route   PUT /api/v1/workspaces/:id
// @access  Private (Admin only)
export const updateWorkspace = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const workspace = await Workspace.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            success: true,
            message: 'Workspace updated',
            data: workspace,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Join workspace via invite token
// @route   POST /api/v1/workspaces/join/:token
// @access  Private
export const joinWorkspace = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { token } = req.params;
        const userId = req.user?._id;

        const workspace = await Workspace.findOne({ inviteToken: token });
        if (!workspace) {
            res.status(404).json({ success: false, message: 'Invalid invite link' });
            return;
        }

        // Check if already a member
        const isMember = await WorkspaceMember.findOne({ workspaceId: workspace._id, userId });
        if (isMember) {
            res.status(400).json({ success: false, message: 'You are already a member of this workspace' });
            return;
        }

        await WorkspaceMember.create({
            workspaceId: workspace._id,
            userId,
            role: 'Member',
        });

        res.status(200).json({
            success: true,
            message: `Joined ${workspace.name} successfully`,
            data: workspace,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
