import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Workspace } from '../../services/workspaceService';
import { workspaceService } from '../../services/workspaceService';
import { Plus, Users, ArrowRight, Link as LinkIcon, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import UserBadge from '../../components/UserBadge';
import GlobalSearch from '../../components/GlobalSearch';

const WorkspaceList: React.FC = () => {
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [loading, setLoading] = useState(true);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
    const [inviteToken, setInviteToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    const fetchWorkspaces = async () => {
        try {
            const res = await workspaceService.getMyWorkspaces();
            if (res.success) {
                setWorkspaces(res.data);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to load workspaces');
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteToken) return;

        try {
            const res = await workspaceService.joinWorkspace(inviteToken);
            if (res.success) {
                toast.success(res.message);
                setIsJoinModalOpen(false);
                setInviteToken('');
                fetchWorkspaces();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to join workspace');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-end space-y-4 sm:space-y-0 sm:space-x-6 mb-8">
                <div className="w-full sm:w-auto order-2 sm:order-1">
                    <GlobalSearch />
                </div>
                <div className="order-1 sm:order-2">
                    <UserBadge />
                </div>
            </div>
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 space-y-6 md:space-y-0">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight leading-tight">Your Workspaces</h1>
                        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 font-medium">Choose a workspace to start collaborating with your team.</p>
                    </div>
                    <div className="mt-6 md:mt-0 flex space-x-4">
                        <button
                            onClick={() => setIsJoinModalOpen(true)}
                            className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-700 shadow-sm text-base font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95"
                        >
                            <LinkIcon className="mr-2 h-5 w-5" />
                            Join Team
                        </button>
                        <button
                            onClick={() => navigate('/workspaces/create')}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-95"
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            New Workspace
                        </button>
                    </div>
                </div>

                {workspaces.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 rounded-4xl shadow-sm border border-gray-100 dark:border-gray-800 p-12 text-center">
                        <div className="inline-flex items-center justify-center p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl mb-8">
                            <Briefcase className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3">No workspaces found</h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-10 font-bold leading-relaxed">
                            You haven't joined any workspaces yet. Create a new one or join an existing team to get started.
                        </p>
                        <button
                            onClick={() => navigate('/workspaces/create')}
                            className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                        >
                            Create Your First Workspace
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {workspaces.map((ws) => (
                            <div
                                key={ws._id}
                                onClick={() => navigate(`/workspaces/${ws._id}`)}
                                className="group bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-800 p-8 cursor-pointer transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-indigo-50 dark:bg-indigo-900/40 p-3 rounded-2xl">
                                        <ArrowRight className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-5 mb-8">
                                    <div className="h-16 w-16 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-100 dark:shadow-none">
                                        {ws.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                                            {ws.name}
                                        </h3>
                                        <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">
                                            <Users className="h-3 w-3 mr-1" />
                                            Team Members
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 font-medium line-clamp-2 min-h-12 mb-8 leading-relaxed">
                                    {ws.description || 'Collaborate together in this premium workspace.'}
                                </p>
                                <div className="pt-8 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between">
                                    <span className="text-[10px] font-black text-indigo-600/50 dark:text-indigo-400/50 tracking-widest uppercase">
                                        Active Workspace
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Join Modal */}
            {isJoinModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-gray-800">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 leading-none">Join a Workspace</h2>
                        <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-8">Enter your invite token</p>

                        <form onSubmit={handleJoin}>
                            <input
                                type="text"
                                value={inviteToken}
                                onChange={(e) => setInviteToken(e.target.value)}
                                placeholder="Paste token here..."
                                className="w-full px-6 py-5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-2xl mb-8 focus:bg-white dark:focus:bg-gray-800 focus:border-indigo-100 dark:focus:border-indigo-900/50 outline-none transition-all font-mono font-bold text-gray-900 dark:text-white"
                                autoFocus
                            />
                            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsJoinModalOpen(false)}
                                    className="flex-1 px-8 py-4 bg-white dark:bg-gray-800 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none active:scale-95"
                                >
                                    Join Now
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkspaceList;
