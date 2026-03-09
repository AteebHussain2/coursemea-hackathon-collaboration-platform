import api from './api';

export interface Notification {
    _id: string;
    recipient: string;
    sender: {
        _id: string;
        name: string;
        avatarUrl?: string;
    };
    type: 'TaskAssigned' | 'CommentAdded' | 'ProjectCreated' | 'Mentioned';
    message: string;
    link?: string;
    read: boolean;
    createdAt: string;
}

export interface NotificationResponse {
    success: boolean;
    data: Notification[];
}

export const notificationService = {
    getMyNotifications: async () => {
        const response = await api.get<NotificationResponse>('/notifications');
        return response.data;
    },

    markAsRead: async (id: string) => {
        const response = await api.put<{ success: boolean; data: Notification }>(`/notifications/${id}/read`);
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await api.put<{ success: boolean; message: string }>('/notifications/read-all');
        return response.data;
    },
};
