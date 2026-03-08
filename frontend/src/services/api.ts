import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    withCredentials: true, // Important for sending/receiving HttpOnly cookies
});

// Request interceptor to attach access token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: any) => {
        const originalRequest = error.config;

        // If error is 401 Unauthorized and we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token using the HttpOnly cookie
                const res = await axios.post(
                    `${originalRequest.baseURL}/auth/refresh`,
                    {},
                    { withCredentials: true }
                );

                if (res.data?.data?.token) {
                    const newAccessToken = res.data.data.token;
                    localStorage.setItem('accessToken', newAccessToken);

                    // Update header and retry original request
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed (cookie expired or invalid) -> force logout
                localStorage.removeItem('accessToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
