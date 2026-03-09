import api from './api';

export interface Task {
    _id: string;
    projectId: string;
    title: string;
    description: string;
    status: 'Todo' | 'In Progress' | 'Review' | 'Done';
    priority: 'Low' | 'Medium' | 'High';
    dueDate?: string;
    assignedTo?: {
        _id: string;
        name: string;
        email: string;
        avatarUrl?: string;
    };
    creatorId: string;
    attachments?: Array<{
        name: string;
        url: string;
        fileType: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTaskData {
    title: string;
    description?: string;
    priority?: 'Low' | 'Medium' | 'High';
    dueDate?: string;
    assignedTo?: string;
    status?: string;
}

export const taskService = {
    // Get tasks for a project
    getProjectTasks: async (workspaceId: string, projectId: string) => {
        const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}/tasks`);
        return response.data;
    },

    // Create a new task
    createTask: async (workspaceId: string, projectId: string, data: CreateTaskData) => {
        const response = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/tasks`, data);
        return response.data;
    },

    // Get single task details
    getTaskDetails: async (workspaceId: string, projectId: string, taskId: string) => {
        const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`);
        return response.data;
    },

    // Update task
    updateTask: async (workspaceId: string, projectId: string, taskId: string, data: Partial<Task>) => {
        const response = await api.put(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`, data);
        return response.data;
    },

    // Delete task
    deleteTask: async (workspaceId: string, projectId: string, taskId: string) => {
        const response = await api.delete(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`);
        return response.data;
    }
};
