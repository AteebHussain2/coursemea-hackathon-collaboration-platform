import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { WorkspaceDetailsResponse } from '../../services/workspaceService';
import { workspaceService } from '../../services/workspaceService';
import { activityService } from '../../services/activityService';
import type { Activity } from '../../services/activityService';
import { analyticsService } from '../../services/analyticsService';
import type { WorkspaceStats } from '../../services/analyticsService';
import {
    Layout,
    Users,
    Plus,
    ArrowLeft,
    Copy,
    CheckCircle2,
    Zap,
    Crown,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Calendar as CalendarIcon,
    ChevronRight,
    Trash2,
    Share2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { projectService } from '../../services/projectService';
import type { Project } from '../../services/projectService';
import CreateProjectModal from '../../components/workspaces/CreateProjectModal';
import ShareWorkspaceModal from '../../components/workspaces/ShareWorkspaceModal';
import UserBadge from '../../components/UserBadge';
import NotificationCenter from '../../components/NotificationCenter';
import GlobalSearch from '../../components/GlobalSearch';
import { useAuth } from '../../context/AuthContext';

const WorkspaceDetails: React.FC = () => {
    const { id } = useParams();
    const [data, setData] = useState<WorkspaceDetailsResponse | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [stats, setStats] = useState<WorkspaceStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const currentUserMember = data?.members.find(m => m.userId._id === user?._id);
    const isAdmin = currentUserMember?.role === 'Admin';

    useEffect(() => {
        if (id) {
            fetchData();
            fetchProjects();
        }
    }, [id]);

    const fetchProjects = async () => {
        try {
            const res = await projectService.getWorkspaceProjects(id!);
            if (res.success) {
                setProjects(res.data);
            }
        } catch (error: any) {
            console.error('Failed to load projects', error);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const [wsRes, actRes, statsRes] = await Promise.all([
                workspaceService.getWorkspaceDetails(id!),
                activityService.getWorkspaceActivity(id!),
                analyticsService.getWorkspaceStats(id!)
            ]);

            if (wsRes.success) setData(wsRes.data);
            if (actRes.success) setActivities(actRes.data);
            if (statsRes.success) setStats(statsRes.data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to load workspace details');
            navigate('/workspaces');
        } finally {
            setLoading(false);
        }
    };

    const copyInviteLink = () => {
        if (!data?.workspace.inviteToken) return;
        navigator.clipboard.writeText(data.workspace.inviteToken);
        setCopied(true);
        toast.success('Invite token copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const handleUpdateRole = async (userId: string, newRole: string) => {
        try {
            const res = await workspaceService.updateMemberRole(id!, userId, newRole);
            if (res.success) {
                setData({
                    ...data!,
                    members: data!.members.map(m => m.userId._id === userId ? { ...m, role: newRole as any } : m)
                });
                toast.success('Member role updated');
            }
        } catch (error) {
            toast.error('Failed to update role');
        }
    };

    const handleRemoveMember = async (userId: string) => {
        if (!window.confirm('Are you sure you want to remove this member?')) return;
        try {
            const res = await workspaceService.removeMember(id!, userId);
            if (res.success) {
                setData({
                    ...data!,
                    members: data!.members.filter(m => m.userId._id !== userId)
                });
                toast.success('Member removed');
            }
        } catch (error) {
            toast.error('Failed to remove member');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">
            {/* Top Navigation Bar */}
            <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-50 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto min-h-20 py-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center w-full md:w-auto">
                        <button
                            onClick={() => navigate('/workspaces')}
                            className="mr-6 p-2 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100 dark:shadow-none uppercase">
                                {data.workspace.name.charAt(0)}
                            </div>
                            <h1 className="text-xl font-black text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-xs">{data.workspace.name}</h1>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-4 w-full md:w-auto">
                        <button
                            onClick={() => setIsShareModalOpen(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold hover:shadow-md hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all active:scale-95 group"
                        >
                            <Share2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Share</span>
                        </button>

                        <button
                            onClick={() => navigate(`/workspaces/${id}/dashboard`)}
                            className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all active:scale-95 group"
                        >
                            <TrendingUp className="h-4 w-4 group-hover:scale-110 transition-transform" />
                            <span>Dashboard</span>
                        </button>
                        <div className="hidden sm:block h-8 w-px bg-gray-100 dark:bg-gray-800 mx-2"></div>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <GlobalSearch />
                            <NotificationCenter />
                            <UserBadge />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-10">
                {/* Stats Summary Widgets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-4xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center space-x-4 hover:shadow-md transition-all group">
                        <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                            <Layout className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Projects</p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white">{projects.length}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-4xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center space-x-4 hover:shadow-md transition-all group">
                        <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Tasks</p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white">{stats?.totalTasks || 0}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-4xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center space-x-4 hover:shadow-md transition-all group sm:col-span-2 md:col-span-1">
                        <div className="h-12 w-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                            <TrendingUp className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Overdue Tasks</p>
                            <p className="text-2xl font-black text-gray-900 dark:text-white">{stats?.overdueCount || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Stats & Projects (Day 8 Placeholder) */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Summary Card */}
                        <div className="bg-white dark:bg-gray-900 rounded-4xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center">
                                    <Layout className="h-6 w-6 mr-3 text-indigo-600" />
                                    Active Projects
                                </h2>
                                <button
                                    onClick={() => setIsProjectModalOpen(true)}
                                    className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl hover:bg-indigo-100 transition-all active:scale-95"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>

                            {projects.length === 0 ? (
                                <div className="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl p-10 text-center border border-dashed border-indigo-200 dark:border-indigo-900/50">
                                    <div className="inline-flex items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm mb-4">
                                        <Sparkles className="h-8 w-8 text-indigo-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-200 mb-2">Kickstart your workspace!</h3>
                                    <p className="text-indigo-700/70 dark:text-indigo-400 max-w-sm mx-auto">
                                        No projects found in this workspace. Create one now to start tracking tasks and deadlines.
                                    </p>
                                    <button
                                        onClick={() => setIsProjectModalOpen(true)}
                                        className="mt-6 px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 active:scale-95"
                                    >
                                        Create First Project
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {projects.map((project) => (
                                        <div
                                            key={project._id}
                                            onClick={() => navigate(`/workspaces/${id}/projects/${project._id}`)}
                                            className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-transparent hover:border-indigo-200 dark:hover:border-indigo-900/50 hover:bg-white dark:hover:bg-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="p-3 bg-white dark:bg-gray-700 rounded-2xl shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                    <Layout className="h-5 w-5" />
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${project.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                                                    project.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {project.status}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                {project.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 line-clamp-2 mb-6">
                                                {project.description || 'No description provided.'}
                                            </p>
                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                                <div className="flex items-center text-xs text-gray-400 dark:text-gray-500">
                                                    <CalendarIcon className="h-3 w-3 mr-1" />
                                                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                                                </div>
                                                <div className="h-8 w-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-500 group-hover:text-indigo-600 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-all">
                                                    <ChevronRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Activity Card */}
                        <div className="bg-white dark:bg-gray-900 rounded-4xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center">
                                <Zap className="h-6 w-6 mr-3 text-amber-500" />
                                Recent Activity
                            </h2>
                            <div className="space-y-6">
                                {activities.length === 0 ? (
                                    <div className="text-center py-10 opacity-30 italic text-sm text-gray-400">
                                        No recent activity yet.
                                    </div>
                                ) : (
                                    activities.map((activity) => (
                                        <div key={activity._id} className="flex items-start space-x-4 group">
                                            <div className="h-10 w-10 bg-gray-100 dark:bg-gray-800 rounded-full shrink-0 flex items-center justify-center border-2 border-white dark:border-gray-700 shadow-sm overflow-hidden ring-2 ring-transparent group-hover:ring-indigo-100 transition-all">
                                                {activity.userId.avatarUrl ? (
                                                    <img src={activity.userId.avatarUrl} alt={activity.userId.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="text-xs font-black text-gray-400">{activity.userId.name.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm text-gray-900 dark:text-white leading-tight">
                                                    <span className="font-bold">{activity.userId.name}</span> {activity.action.toLowerCase()}
                                                    {activity.details && <span className="text-indigo-600 dark:text-indigo-400 font-medium italic"> "{activity.details}"</span>}
                                                </p>
                                                <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black">
                                                    {new Date(activity.createdAt).toLocaleDateString()} • {activity.entityType}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Member List & Invites */}
                    <div className="space-y-8">
                        {/* Invite Link Card */}
                        <div className="bg-linear-to-br from-indigo-600 to-indigo-700 rounded-4xl shadow-xl p-8 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <ArrowLeft className="h-20 w-20 rotate-180" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Invite Members</h3>
                            <p className="text-indigo-100 text-sm mb-6 opacity-80">
                                Share this token with your team so they can join this workspace.
                            </p>
                            <div className="flex items-center space-x-2 bg-indigo-500/30 p-2 rounded-2xl backdrop-blur-sm border border-white/20">
                                <code className="flex-1 bg-transparent border-none text-sm text-white font-mono px-3">
                                    {data.workspace.inviteToken.slice(0, 20)}...
                                </code>
                                <button
                                    onClick={copyInviteLink}
                                    className="p-3 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all active:scale-95"
                                >
                                    {copied ? <CheckCircle2 className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Members Card */}
                        <div className="bg-white dark:bg-gray-900 rounded-4xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center">
                                    <Users className="h-5 w-5 mr-2 text-indigo-600" />
                                    Team Members
                                </h3>
                                <span className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black px-2 py-0.5 rounded-full">
                                    {data.members.length}
                                </span>
                            </div>
                            <div className="space-y-4">
                                {data.members.map((member) => (
                                    <div key={member._id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group relative">
                                        <div className="flex items-center space-x-3 overflow-hidden">
                                            <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 font-bold border border-gray-200 dark:border-gray-700 overflow-hidden">
                                                {member.userId.avatarUrl ? (
                                                    <img src={member.userId.avatarUrl} alt={member.userId.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span>{member.userId.name.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-black text-gray-900 dark:text-white leading-none mb-1 group-hover:text-indigo-600 transition-colors truncate">
                                                    {member.userId.name} {member.userId._id === user?._id && '(You)'}
                                                </p>
                                                <div className="flex items-center text-[10px] text-gray-400 uppercase tracking-widest font-black">
                                                    {member.role === 'Admin' ? (
                                                        <Crown className="h-3 w-3 mr-1 text-amber-500" />
                                                    ) : (
                                                        <ShieldCheck className="h-3 w-3 mr-1 text-emerald-500" />
                                                    )}
                                                    {member.role}
                                                </div>
                                            </div>
                                        </div>

                                        {isAdmin && member.userId._id !== user?._id && (
                                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <select
                                                    value={member.role}
                                                    onChange={(e) => handleUpdateRole(member.userId._id, e.target.value)}
                                                    className="text-[10px] font-black uppercase tracking-widest bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-indigo-500"
                                                >
                                                    <option value="Admin">Admin</option>
                                                    <option value="Member">Member</option>
                                                    <option value="Guest">Guest</option>
                                                </select>
                                                <button
                                                    onClick={() => handleRemoveMember(member.userId._id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                    title="Remove Member"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => setIsShareModalOpen(true)}
                                className="w-full mt-6 py-4 px-6 border border-dashed border-gray-200 dark:border-gray-700 text-gray-400 font-bold rounded-2xl hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all flex items-center justify-center group"
                            >
                                <Plus className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                                Add More
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <CreateProjectModal
                workspaceId={id!}
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                onSuccess={fetchProjects}
            />
            <ShareWorkspaceModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                workspaceName={data.workspace.name}
                inviteToken={data.workspace.inviteToken}
            />
        </div>
    );
};

export default WorkspaceDetails;
