import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Workspace } from '../../services/workspaceService';
import { workspaceService } from '../../services/workspaceService';
import { Plus, Users, ArrowRight, Link as LinkIcon, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

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
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Workspaces</h1>
                        <p className="mt-2 text-lg text-gray-600">Choose a workspace to start collaborating with your team.</p>
                    </div>
                    <div className="mt-6 md:mt-0 flex space-x-4">
                        <button
                            onClick={() => setIsJoinModalOpen(true)}
                            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-all active:scale-95"
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
                    <div className="bg-white rounded-4xl shadow-sm border border-gray-100 p-8">
                        <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-2xl mb-6">
                            <Briefcase className="h-12 w-12 text-indigo-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">No workspaces found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mb-8">
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
                                className="group bg-white rounded-3xl shadow-md hover:shadow-2xl border border-gray-100 p-8 cursor-pointer transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-indigo-50 p-2 rounded-full">
                                        <ArrowRight className="h-5 w-5 text-indigo-600" />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="h-16 w-16 bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-inner">
                                        {ws.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {ws.name}
                                        </h3>
                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                            <Users className="h-4 w-4 mr-1" />
                                            View Team Members
                                        </div>
                                    </div>
                                </div>
                                <p className="text-gray-600 line-clamp-2 min-h-12 mb-6">
                                    {ws.description || 'No description provided for this workspace.'}
                                </p>
                                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
                                        ACTIVE PROJECT SPACE
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Join Modal */}
            {isJoinModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Join a Workspace</h2>
                        <p className="text-gray-500 mb-6">Enter the invite token provided by your team lead.</p>

                        <form onSubmit={handleJoin}>
                            <input
                                type="text"
                                value={inviteToken}
                                onChange={(e) => setInviteToken(e.target.value)}
                                placeholder="Paste token here..."
                                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl mb-6 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none font-mono"
                                autoFocus
                            />
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsJoinModalOpen(false)}
                                    className="flex-1 px-6 py-4 border border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-all outline-none"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-4 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-all shadow-md active:scale-95 outline-none"
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
