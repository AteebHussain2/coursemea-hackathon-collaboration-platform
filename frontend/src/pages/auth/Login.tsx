import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, type User } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            return toast.error('Please fill in all fields');
        }

        try {
            setIsLoading(true);
            console.log('[Login] Attempting login for:', email);
            const res = await api.post('/auth/login', { email, password });
            console.log('[Login] API Response received:', res.data);

            const { token, ...userData } = res.data.data;
            console.log('[Login] Storing user data and token...');
            login(userData as User, token);

            toast.success('Welcome back!');
            console.log('[Login] Redirection to /workspaces...');
            navigate('/workspaces');
        } catch (err: any) {
            console.error('[Login] Error caught in handleSubmit:', {
                message: err.message,
                response: err.response?.data,
                status: err.response?.status
            });
            toast.error(err.response?.data?.message || 'Failed to login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-4xl font-black tracking-tight text-gray-900 dark:text-white">
                    Sign in to your account
                </h2>
                <p className="mt-4 text-center text-sm font-bold text-gray-500 dark:text-gray-400">
                    Or{' '}
                    <Link to="/register" className="font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors underline decoration-2 underline-offset-4">
                        create a new workspace
                    </Link>
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white dark:bg-gray-900 py-10 px-6 sm:px-10 rounded-4xl shadow-2xl border border-gray-100 dark:border-gray-800">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                                Email address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-12 h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-gray-800 transition-all font-bold text-gray-900 dark:text-white"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-12 h-14 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-gray-800 transition-all font-bold text-gray-900 dark:text-white"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none text-sm font-black uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
