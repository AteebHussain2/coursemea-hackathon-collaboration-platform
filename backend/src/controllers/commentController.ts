import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Comment from '../models/Comment';
import Task from '../models/Task';
import Activity from '../models/Activity';

// Helper to log activity
const logActivity = async (workspaceId: string, userId: string, action: string, entityId: string, entityType: string, details?: string) => {
    try {
        await Activity.create({
            workspaceId,
            userId,
            action,
            entityId,
            entityType,
            details,
        });
    } catch (error) {
        console.error('Failed to log activity:', error);
    }
};

// @desc    Add a comment to a task
// @route   POST /api/v1/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/comments
// @access  Private
export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { content, mentions } = req.body;
        const { workspaceId, taskId } = req.params;

        const comment = await Comment.create({
            content,
            mentions,
            taskId: taskId as any,
            userId: req.user?._id as any,
        });

        const populatedComment = await Comment.findById(comment._id).populate('userId', 'name avatarUrl');

        // Log activity
        await logActivity(
            workspaceId as string,
            (req.user?._id as any).toString(),
            'Commented on task',
            taskId as string,
            'Task',
            content.substring(0, 50) + (content.length > 50 ? '...' : '')
        );

        res.status(201).json({
            success: true,
            data: populatedComment,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Get all comments for a task
// @route   GET /api/v1/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/comments
// @access  Private
export const getTaskComments = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { taskId } = req.params;
        const comments = await Comment.find({ taskId: taskId as any })
            .populate('userId', 'name avatarUrl')
            .sort({ createdAt: 1 });

        res.status(200).json({
            success: true,
            data: comments,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Delete a comment
// @route   DELETE /api/v1/workspaces/:workspaceId/projects/:projectId/tasks/:taskId/comments/:id
// @access  Private (Owner or Admin)
export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            res.status(404).json({ success: false, message: 'Comment not found' });
            return;
        }

        // Check ownership (simple check for now, roles could be more complex)
        if (comment.userId.toString() !== req.user?._id.toString()) {
            res.status(403).json({ success: false, message: 'Not authorized to delete this comment' });
            return;
        }

        await comment.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Comment deleted',
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// Activity logging logic will be integrated into other controllers too
export { logActivity };
