import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { workspaceService } from '../../services/workspaceService';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, XCircle, ArrowRight, Home } from 'lucide-react';
import toast from 'react-hot-toast';

const JoinWorkspace: React.FC = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const [joining, setJoining] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [workspace, setWorkspace] = useState<any>(null);

    useEffect(() => {
        const join = async () => {
            if (authLoading) return;

            if (!user) {
                // Store current path to redirect back after login
                localStorage.setItem('redirectPath', window.location.pathname);
                navigate('/login');
                return;
            }

            if (!token) {
                setError('Invalid invite token');
                setJoining(false);
                return;
            }

            try {
                const res = await workspaceService.joinWorkspace(token);
                if (res.success) {
                    setWorkspace(res.data);
                    toast.success(`Joined ${res.data.name}!`);
                } else {
                    setError(res.message || 'Failed to join workspace');
                }
            } catch (err: any) {
                setError(err.response?.data?.message || 'Something went wrong');
            } finally {
                setJoining(false);
            }
        };

        join();
    }, [token, user, authLoading, navigate]);

    if (joining || authLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mb-6"></div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Joining workspace...</h2>
                <p className="text-gray-400 font-medium">Please wait a moment</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl p-10 text-center border border-gray-100 dark:border-gray-700">
                {error ? (
                    <>
                        <div className="inline-flex items-center justify-center h-20 w-20 bg-red-50 dark:bg-red-900/20 rounded-3xl text-red-500 mb-8">
                            <XCircle className="h-10 w-10" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Oops!</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-bold mb-10 leading-relaxed">
                            {error}
                        </p>
                        <button
                            onClick={() => navigate('/workspaces')}
                            className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-2xl hover:scale-105 transition-all active:scale-95"
                        >
                            <Home className="h-5 w-5" />
                            <span>Go to My Workspaces</span>
                        </button>
                    </>
                ) : (
                    <>
                        <div className="inline-flex items-center justify-center h-20 w-20 bg-green-50 dark:bg-green-900/20 rounded-3xl text-green-500 mb-8">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Success!</h2>
                        <p className="text-gray-500 dark:text-gray-400 font-bold mb-10 leading-relaxed">
                            You've successfully joined <span className="text-indigo-600 dark:text-indigo-400">{workspace?.name}</span>.
                        </p>
                        <button
                            onClick={() => navigate(`/workspaces/${workspace?._id}`)}
                            className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none hover:scale-105 transition-all active:scale-95"
                        >
                            <span>Enter Workspace</span>
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default JoinWorkspace;
