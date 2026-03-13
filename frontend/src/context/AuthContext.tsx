import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api.ts'; // Axios instance

export interface User {
    _id: string;
    name: string;
    email: string;
    avatarUrl: string;
    bio?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (userData: User, token: string) => void;
    logout: () => Promise<void>;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Check if we already have a session on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // The interceptor will handle silent refresh if the token is expired
                const response = await api.get('/users/me');
                setUser(response.data.data);
            } catch (error) {
                console.error('Failed to initialize session:', error);
                localStorage.removeItem('accessToken');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = (userData: User, token: string) => {
        localStorage.setItem('accessToken', token);
        setUser(userData);
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout'); // Clears the HttpOnly cookie on backend
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            localStorage.removeItem('accessToken');
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
