import api from './api';

export interface Project {
    _id: string;
    workspaceId: string;
    name: string;
    description: string;
    status: 'Active' | 'On Hold' | 'Completed' | 'Archived';
    deadline?: string;
    members: string[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateProjectData {
    name: string;
    description?: string;
    deadline?: string;
}

export const projectService = {
    // Get projects for a workspace
    getWorkspaceProjects: async (workspaceId: string) => {
        const response = await api.get(`/workspaces/${workspaceId}/projects`);
        return response.data;
    },

    // Create a new project
    createProject: async (workspaceId: string, data: CreateProjectData) => {
        const response = await api.post(`/workspaces/${workspaceId}/projects`, data);
        return response.data;
    },

    // Get single project details
    getProjectDetails: async (workspaceId: string, projectId: string) => {
        const response = await api.get(`/workspaces/${workspaceId}/projects/${projectId}`);
        return response.data;
    },

    // Update project
    updateProject: async (workspaceId: string, projectId: string, data: Partial<Project>) => {
        const response = await api.put(`/workspaces/${workspaceId}/projects/${projectId}`, data);
        return response.data;
    },

    // Delete project
    deleteProject: async (workspaceId: string, projectId: string) => {
        const response = await api.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
        return response.data;
    }
};
