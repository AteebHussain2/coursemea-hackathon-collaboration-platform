import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Task from '../models/Task';
import Project from '../models/Project';
import mongoose from 'mongoose';

// @desc    Get dashboard statistics for a workspace
// @route   GET /api/v1/workspaces/:workspaceId/analytics/stats
// @access  Private
export const getWorkspaceStats = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { workspaceId } = req.params;

        // 1. Find all projects in the workspace
        const projects = await Project.find({ workspaceId: workspaceId as any });
        const projectIds = projects.map(p => p._id);

        // 2. Aggregate task counts by status
        const statusStats = await Task.aggregate([
            { $match: { projectId: { $in: projectIds } } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // 3. Aggregate task counts by priority
        const priorityStats = await Task.aggregate([
            { $match: { projectId: { $in: projectIds } } },
            { $group: { _id: '$priority', count: { $sum: 1 } } }
        ]);

        // 4. Overdue tasks count
        const overdueCount = await Task.countDocuments({
            projectId: { $in: projectIds },
            status: { $ne: 'Done' },
            dueDate: { $lt: new Date() }
        });

        // 5. Total task count
        const totalTasks = await Task.countDocuments({ projectId: { $in: projectIds } });

        res.status(200).json({
            success: true,
            data: {
                totalTasks,
                overdueCount,
                statusDistribution: statusStats,
                priorityDistribution: priorityStats
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Get team performance for a workspace
// @route   GET /api/v1/workspaces/:workspaceId/analytics/performance
// @access  Private
export const getTeamPerformance = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { workspaceId } = req.params;

        // 1. Find all projects in the workspace
        const projects = await Project.find({ workspaceId: workspaceId as any });
        const projectIds = projects.map(p => p._id);

        // 2. Aggregate performance by assigned user
        const performance = await Task.aggregate([
            { $match: { projectId: { $in: projectIds }, assignedTo: { $exists: true, $ne: null } } },
            {
                $group: {
                    _id: '$assignedTo',
                    totalAssigned: { $sum: 1 },
                    completed: {
                        $sum: { $cond: [{ $eq: ['$status', 'Done'] }, 1, 0] }
                    }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    name: '$user.name',
                    avatarUrl: '$user.avatarUrl',
                    totalAssigned: 1,
                    completed: 1,
                    completionRate: {
                        $round: [{ $multiply: [{ $divide: ['$completed', '$totalAssigned'] }, 100] }, 1]
                    }
                }
            },
            { $sort: { completed: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: performance
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
