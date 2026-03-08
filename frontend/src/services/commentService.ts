import api from './api';

export interface Comment {
    _id: string;
    taskId: string;
    userId: {
        _id: string;
        name: string;
        avatarUrl?: string;
    };
    content: string;
    createdAt: string;
}

export const commentService = {
    // Get all comments for a task
    getTaskComments: async (workspaceId: string, projectId: string, taskId: string) => {
        const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments`);
        return response.data;
    },

    // Add a comment to a task
    addComment: async (workspaceId: string, projectId: string, taskId: string, content: string) => {
        const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments`, { content });
        return response.data;
    },

    // Delete a comment
    deleteComment: async (workspaceId: string, projectId: string, taskId: string, commentId: string) => {
        const response = await api.delete(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`);
        return response.data;
    }
};
