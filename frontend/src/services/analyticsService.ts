import api from './api';

export interface StatusDistribution {
    _id: string;
    count: number;
}

export interface PriorityDistribution {
    _id: string;
    count: number;
}

export interface WorkspaceStats {
    totalTasks: number;
    overdueCount: number;
    statusDistribution: StatusDistribution[];
    priorityDistribution: PriorityDistribution[];
}

export interface TeamPerformance {
    name: string;
    avatarUrl?: string;
    totalAssigned: number;
    completed: number;
    completionRate: number;
}

export const analyticsService = {
    // Get general workspace stats
    getWorkspaceStats: async (workspaceId: string) => {
        const response = await api.get(`/workspaces/${workspaceId}/analytics/stats`);
        return response.data;
    },

    // Get team performance data
    getTeamPerformance: async (workspaceId: string) => {
        const response = await api.get(`/workspaces/${workspaceId}/analytics/performance`);
        return response.data;
    }
};
