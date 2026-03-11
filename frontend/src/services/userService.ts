import api from './api';

export interface UserProfile {
    _id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    bio?: string;
}

export const userService = {
    getMe: async () => {
        const response = await api.get('/users/me');
        return response.data;
    },
    updateProfile: async (data: Partial<UserProfile>) => {
        const response = await api.put('/users/profile', data);
        return response.data;
    }
};
