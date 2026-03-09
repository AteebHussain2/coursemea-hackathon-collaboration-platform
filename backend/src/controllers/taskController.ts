import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Task from '../models/Task';
import Project from '../models/Project';
import { logActivity } from './commentController';
import { createNotification } from './notificationController';

// @desc    Create a new task
// @route   POST /api/v1/workspaces/:workspaceId/projects/:projectId/tasks
// @access  Private
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, priority, dueDate, assignedTo, status } = req.body;
        const { projectId } = req.params;

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            status,
            projectId: projectId as string,
            creatorId: req.user?._id as any,
        });

        // Log activity
        try {
            const project = await Project.findById(projectId as string);
            await logActivity(
                (project?.workspaceId as any).toString(),
                (req.user?._id as any).toString(),
                'Created task',
                (task._id as any).toString(),
                'Task',
                title
            );
        } catch (e) {
            console.error('Activity logging failed for task creation');
        }

        // Create notification for assigned user
        if (assignedTo && assignedTo.toString() !== (req.user?._id as any).toString()) {
            await createNotification(
                assignedTo,
                (req.user?._id as any).toString(),
                'TaskAssigned',
                `You have been assigned to task: ${title}`,
                `/workspaces/${req.params.workspaceId}/projects/${projectId}`
            );
        }

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Get all tasks for a project
// @route   GET /api/v1/workspaces/:workspaceId/projects/:projectId/tasks
// @access  Private
export const getProjectTasks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { projectId } = req.params;
        const tasks = await Task.find({ projectId: projectId as string }).populate('assignedTo', 'name email avatarUrl');

        res.status(200).json({
            success: true,
            data: tasks,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Get single task details
// @route   GET /api/v1/workspaces/:workspaceId/projects/:projectId/tasks/:id
// @access  Private
export const getTaskDetails = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const task = await Task.findById(req.params.id as string)
            .populate('assignedTo', 'name email avatarUrl')
            .populate('creatorId', 'name email avatarUrl');

        if (!task) {
            res.status(404).json({ success: false, message: 'Task not found' });
            return;
        }

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Update task
// @route   PUT /api/v1/workspaces/:workspaceId/projects/:projectId/tasks/:id
// @access  Private
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id as string, req.body, {
            returnDocument: 'after',
            runValidators: true,
        }).populate('assignedTo', 'name email avatarUrl');

        if (!task) {
            res.status(404).json({ success: false, message: 'Task not found' });
            return;
        }

        if (req.body.status && task.status !== req.body.status) {
            try {
                const project = await Project.findById(req.params.projectId as string);
                await logActivity(
                    (project?.workspaceId as any).toString(),
                    (req.user?._id as any).toString(),
                    `Moved task to ${req.body.status}`,
                    (task._id as any).toString(),
                    'Task',
                    task.title
                );
            } catch (e) {
                console.error('Activity logging failed for task update');
            }
        }

        // Create notification for assigned user if it's a new assignment
        if (req.body.assignedTo && req.body.assignedTo.toString() !== task.assignedTo?.toString()) {
            await createNotification(
                req.body.assignedTo,
                (req.user?._id as any).toString(),
                'TaskAssigned',
                `You have been assigned to task: ${task.title}`,
                `/workspaces/${req.params.workspaceId}/projects/${req.params.projectId}`
            );
        }

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: task,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Delete task
// @route   DELETE /api/v1/workspaces/:workspaceId/projects/:projectId/tasks/:id
// @access  Private
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id as string);

        if (!task) {
            res.status(404).json({ success: false, message: 'Task not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Upload attachment to task
// @route   POST /api/v1/workspaces/:workspaceId/projects/:projectId/tasks/:id/attachments
// @access  Private
export const uploadAttachment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ success: false, message: 'Please upload a file' });
            return;
        }

        const task = await Task.findById(req.params.id);
        if (!task) {
            res.status(404).json({ success: false, message: 'Task not found' });
            return;
        }

        const attachment = {
            name: req.file.originalname,
            url: `/uploads/${req.file.filename}`,
            fileType: req.file.mimetype,
        };

        task.attachments?.push(attachment);
        await task.save();

        res.status(200).json({
            success: true,
            message: 'Attachment uploaded successfully',
            data: attachment,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};
