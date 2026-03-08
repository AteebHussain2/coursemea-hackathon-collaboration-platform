import api from './api';

export interface Activity {
    _id: string;
    workspaceId: string;
    userId: {
        _id: string;
        name: string;
        avatarUrl?: string;
    };
    action: string;
    entityId: string;
    entityType: 'Workspace' | 'Project' | 'Task' | 'Comment' | 'Member';
    details?: string;
    createdAt: string;
}

export const activityService = {
    // Get activity logs for a workspace
    getWorkspaceActivity: async (workspaceId: string) => {
        const response = await api.get(`/workspaces/${workspaceId}/activity`);
        return response.data;
    }
};
