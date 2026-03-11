import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Workspace from '../models/Workspace';
import Project from '../models/Project';
import Task from '../models/Task';

export const globalSearch = async (req: AuthRequest, res: Response) => {
    try {
        const query = req.query.q as string;
        const userId = req.user?._id;

        if (!query) {
            return res.status(400).json({ success: false, message: 'Search query is required' });
        }

        const regex = new RegExp(query, 'i');

        // 1. Search Workspaces where user is a member
        const workspaces = await Workspace.find({
            'members.user': userId,
            $or: [
                { name: regex },
                { description: regex }
            ]
        }).limit(5);

        // 2. Search Projects in workspaces where user is a member
        // First get all workspace IDs for the user
        const memberWorkspaces = await Workspace.find({ 'members.user': userId }).select('_id');
        const wsIds = memberWorkspaces.map(ws => ws._id);

        const projects = await Project.find({
            workspaceId: { $in: wsIds },
            $or: [
                { name: regex },
                { description: regex }
            ]
        }).limit(5);

        // 3. Search Tasks in those projects
        const tasks = await Task.find({
            workspaceId: { $in: wsIds },
            $or: [
                { title: regex },
                { description: regex }
            ]
        })
            .populate('projectId', 'name')
            .limit(10);

        res.status(200).json({
            success: true,
            data: {
                workspaces,
                projects,
                tasks
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
