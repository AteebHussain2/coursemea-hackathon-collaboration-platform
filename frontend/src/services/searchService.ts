import api from './api';
import type { Project } from './projectService';
import type { Task } from './taskService';
import type { Workspace } from './workspaceService';

export interface SearchResults {
    workspaces: Workspace[];
    projects: Project[];
    tasks: (Task & { projectId: { _id: string; name: string }; workspaceId: string })[];
}

export interface SearchResponse {
    success: boolean;
    data: SearchResults;
}

export const searchService = {
    globalSearch: async (query: string) => {
        const response = await api.get<SearchResponse>(`/search?q=${encodeURIComponent(query)}`);
        return response.data;
    },
};
