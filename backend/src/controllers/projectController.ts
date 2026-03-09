import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Project from '../models/Project';
import WorkspaceMember from '../models/WorkspaceMember';
import { logActivity } from './commentController';

// @desc    Create a new project
// @route   POST /api/v1/workspaces/:workspaceId/projects
// @access  Private (Admin/Member only)
export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, description, deadline } = req.body;
        const { workspaceId } = req.params;

        const project = await Project.create({
            name,
            description,
            deadline,
            workspaceId: workspaceId as string,
            creatorId: req.user?._id as any,
        });

        // Log activity
        await logActivity(
            workspaceId as string,
            (req.user?._id as any).toString(),
            'Created project',
            (project as any)._id.toString(),
            'Project',
            name
        );

        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: project,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Get all projects in a workspace
// @route   GET /api/v1/workspaces/:workspaceId/projects
// @access  Private (Workspace members only)
export const getWorkspaceProjects = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { workspaceId } = req.params;
        const projects = await Project.find({ workspaceId: workspaceId as string });

        res.status(200).json({
            success: true,
            data: projects,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Get single project details
// @route   GET /api/v1/workspaces/:workspaceId/projects/:id
// @access  Private (Workspace members only)
export const getProjectDetails = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const project = await Project.findById(req.params.id as string).populate('members', 'name email avatarUrl');

        if (!project) {
            res.status(404).json({ success: false, message: 'Project not found' });
            return;
        }

        res.status(200).json({
            success: true,
            data: project,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Update project
// @route   PUT /api/v1/workspaces/:workspaceId/projects/:id
// @access  Private (Admin/Member only)
export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id as string, req.body, {
            returnDocument: 'after',
            runValidators: true,
        });

        if (!project) {
            res.status(404).json({ success: false, message: 'Project not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Project updated',
            data: project,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Delete project
// @route   DELETE /api/v1/workspaces/:workspaceId/projects/:id
// @access  Private (Admin only)
export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id as string);

        if (!project) {
            res.status(404).json({ success: false, message: 'Project not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Project deleted successfully',
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
