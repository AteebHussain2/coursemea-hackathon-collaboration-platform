import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { WorkspaceDetailsResponse } from '../../services/workspaceService';
import { workspaceService } from '../../services/workspaceService';
import { activityService } from '../../services/activityService';
import type { Activity } from '../../services/activityService';
import {
    Layout,
    Users,
    Settings,
    Plus,
    ArrowLeft,
    Copy,
    CheckCircle2,
    Info,
    Crown,
    ShieldCheck,
    Sparkles,
    Calendar as CalendarIcon,
    ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { projectService } from '../../services/projectService';
import type { Project } from '../../services/projectService';
import CreateProjectModal from '../../components/workspaces/CreateProjectModal';
import UserBadge from '../../components/UserBadge';

const WorkspaceDetails: React.FC = () => {
    const { id } = useParams();
    const [data, setData] = useState<WorkspaceDetailsResponse | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();

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
            const [wsRes, actRes] = await Promise.all([
                workspaceService.getWorkspaceDetails(id!),
                activityService.getWorkspaceActivity(id!)
            ]);

            if (wsRes.success) setData(wsRes.data);
            if (actRes.success) setActivities(actRes.data);
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Top Navigation Bar */}
            <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate('/workspaces')}
                            className="mr-6 p-2 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                        <div>
                            <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100">
                                    {data.workspace.name.charAt(0).toUpperCase()}
                                </div>
                                <h1 className="text-xl font-bold text-gray-900">{data.workspace.name}</h1>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <button className="p-3 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all">
                            <Settings className="h-5 w-5" />
                        </button>
                        <div className="h-8 w-px bg-gray-100"></div>
                        <UserBadge />
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Stats & Projects (Day 8 Placeholder) */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Summary Card */}
                        <div className="bg-white rounded-4xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                    <Layout className="h-6 w-6 mr-3 text-indigo-600" />
                                    Active Projects
                                </h2>
                                <button
                                    onClick={() => setIsProjectModalOpen(true)}
                                    className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all active:scale-95"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>

                            {projects.length === 0 ? (
                                <div className="bg-indigo-50/50 rounded-3xl p-10 text-center border border-dashed border-indigo-200">
                                    <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm mb-4">
                                        <Sparkles className="h-8 w-8 text-indigo-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-indigo-900 mb-2">Kickstart your workspace!</h3>
                                    <p className="text-indigo-700/70 max-w-sm mx-auto">
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
                                            className="group p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-indigo-200 hover:bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                    <Layout className="h-5 w-5" />
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${project.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                                                    project.status === 'Completed' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {project.status}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                                {project.name}
                                            </h3>
                                            <p className="text-sm text-gray-500 line-clamp-2 mb-6">
                                                {project.description || 'No description provided.'}
                                            </p>
                                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                                                <div className="flex items-center text-xs text-gray-400">
                                                    <CalendarIcon className="h-3 w-3 mr-1" />
                                                    {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                                                </div>
                                                <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-gray-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                                                    <ChevronRight className="h-4 w-4" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-4xl shadow-sm border border-gray-100 p-8">
                            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                                <Info className="h-5 w-5 mr-2 text-indigo-600" />
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
                                            <div className="h-10 w-10 bg-gray-100 rounded-full shrink-0 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden ring-2 ring-transparent group-hover:ring-indigo-100 transition-all">
                                                {activity.userId.avatarUrl ? (
                                                    <img src={activity.userId.avatarUrl} alt={activity.userId.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="text-xs font-bold text-gray-400">{activity.userId.name.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm text-gray-900 leading-tight">
                                                    <span className="font-bold">{activity.userId.name}</span> {activity.action.toLowerCase()}
                                                    {activity.details && <span className="text-indigo-600 font-medium italic"> "{activity.details}"</span>}
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
                        <div className="bg-white rounded-4xl shadow-sm border border-gray-100 p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                    <Users className="h-5 w-5 mr-2 text-indigo-600" />
                                    Team Members
                                </h3>
                                <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-2 py-0.5 rounded-full">
                                    {data.members.length}
                                </span>
                            </div>
                            <div className="space-y-4">
                                {data.members.map((member) => (
                                    <div key={member._id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors group">
                                        <div className="flex items-center space-x-3">
                                            <div className="h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold border border-gray-200 overflow-hidden">
                                                {member.userId.avatarUrl ? (
                                                    <img src={member.userId.avatarUrl} alt={member.userId.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span>{member.userId.name.charAt(0)}</span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 leading-none mb-1 group-hover:text-indigo-600 transition-colors">
                                                    {member.userId.name}
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
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-6 py-4 px-6 border border-dashed border-gray-200 text-gray-400 font-bold rounded-2xl hover:border-indigo-300 hover:text-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center group">
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
        </div>
    );
};

export default WorkspaceDetails;
