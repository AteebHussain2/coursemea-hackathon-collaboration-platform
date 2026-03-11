import api from './api';

export interface Workspace {
    _id: string;
    name: string;
    description: string;
    logoUrl?: string;
    ownerId: string;
    inviteToken: string;
    createdAt: string;
    updatedAt: string;
}

export interface WorkspaceMember {
    _id: string;
    workspaceId: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        avatarUrl?: string;
    };
    role: 'Admin' | 'Member' | 'Guest';
    joinedAt: string;
}

export interface WorkspaceDetailsResponse {
    workspace: Workspace;
    members: WorkspaceMember[];
}

export const workspaceService = {
    // Create a new workspace
    createWorkspace: async (data: { name: string; description?: string }) => {
        const response = await api.post('/workspaces', data);
        return response.data;
    },

    // Get all my workspaces
    getMyWorkspaces: async () => {
        const response = await api.get('/workspaces');
        return response.data;
    },

    // Get single workspace details
    getWorkspaceDetails: async (id: string) => {
        const response = await api.get(`/workspaces/${id}`);
        return response.data as { success: boolean; data: WorkspaceDetailsResponse };
    },

    // Join workspace via token
    joinWorkspace: async (token: string) => {
        const response = await api.post(`/workspaces/join/${token}`);
        return response.data;
    },

    // Update workspace (Admin only)
    updateWorkspace: async (id: string, data: Partial<Workspace>) => {
        const response = await api.put(`/workspaces/${id}`, data);
        return response.data;
    },

    // Update member role (Admin only)
    updateMemberRole: async (workspaceId: string, userId: string, role: string) => {
        const response = await api.put(`/workspaces/${workspaceId}/members/${userId}/role`, { role });
        return response.data;
    },

    // Remove member (Admin only)
    removeMember: async (workspaceId: string, userId: string) => {
        const response = await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
        return response.data;
    },
};
