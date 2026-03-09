import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Notification from '../models/Notification';

// @desc    Get user notifications
// @route   GET /api/v1/notifications
// @access  Private
export const getMyNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const notifications = await Notification.find({ recipient: req.user?._id as any })
            .populate('sender', 'name avatarUrl')
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            data: notifications,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/v1/notifications/:id/read
// @access  Private
export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user?._id as any },
            { read: true },
            { returnDocument: 'after' }
        );

        if (!notification) {
            res.status(404).json({ success: false, message: 'Notification not found' });
            return;
        }

        res.status(200).json({
            success: true,
            data: notification,
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/v1/notifications/read-all
// @access  Private
export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await Notification.updateMany(
            { recipient: req.user?._id as any, read: false },
            { read: true }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message || 'Server Error' });
    }
};

// Helper for other controllers to create notifications
export const createNotification = async (
    recipient: string,
    sender: string,
    type: string,
    message: string,
    link?: string
) => {
    try {
        await Notification.create({
            recipient,
            sender,
            type,
            message,
            link,
        });
    } catch (error) {
        console.error('Notification creation failed', error);
    }
};
