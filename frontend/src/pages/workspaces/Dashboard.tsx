import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Layout,
    TrendingUp,
    CheckCircle2,
    Clock,
    AlertCircle,
    ArrowLeft,
    Users,
    PieChart as PieChartIcon,
    BarChart as BarChartIcon
} from 'lucide-react';
import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer
} from 'recharts';
import { analyticsService } from '../../services/analyticsService';
import type { WorkspaceStats, TeamPerformance } from '../../services/analyticsService';
import { workspaceService } from '../../services/workspaceService';
import type { WorkspaceDetailsResponse } from '../../services/workspaceService';
import UserBadge from '../../components/UserBadge';
import NotificationCenter from '../../components/NotificationCenter';
import toast from 'react-hot-toast';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [stats, setStats] = useState<WorkspaceStats | null>(null);
    const [performance, setPerformance] = useState<TeamPerformance[]>([]);
    const [workspace, setWorkspace] = useState<WorkspaceDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [statsRes, perfRes, wsRes] = await Promise.all([
                analyticsService.getWorkspaceStats(id!),
                analyticsService.getTeamPerformance(id!),
                workspaceService.getWorkspaceDetails(id!)
            ]);

            if (statsRes.success) setStats(statsRes.data);
            if (perfRes.success) setPerformance(perfRes.data);
            if (wsRes.success) setWorkspace(wsRes.data);
        } catch (error) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    const statusData = stats?.statusDistribution.map(s => ({ name: s._id, value: s.count })) || [];
    const priorityData = stats?.priorityDistribution.map(p => ({ name: p._id, count: p.count })) || [];

    return (
        <div className="min-h-screen bg-gray-50/50 flex flex-col">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 px-8 py-4">
                <div className="flex items-center justify-between max-w-7xl mx-auto w-full">
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => navigate(`/workspaces/${id}`)}
                            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all group"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        </button>
                        <div className="space-y-1">
                            <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-indigo-500">
                                <TrendingUp className="h-3 w-3" />
                                <span>Analytics Hub</span>
                            </div>
                            <h1 className="text-2xl font-black text-gray-900 leading-tight">
                                {workspace?.workspace.name} Dashboard
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <NotificationCenter />
                        <UserBadge />
                    </div>
                </div>
            </header>

            <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                            <Layout className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Total Tasks</p>
                            <p className="text-4xl font-black text-gray-900">{stats?.totalTasks || 0}</p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Completed</p>
                            <p className="text-4xl font-black text-gray-900">
                                {stats?.statusDistribution.find(s => s._id === 'Done')?.count || 0}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">In Progress</p>
                            <p className="text-4xl font-black text-gray-900">
                                {stats?.statusDistribution.find(s => s._id === 'In Progress')?.count || 0}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="h-12 w-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6">
                            <AlertCircle className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Overdue</p>
                            <p className="text-4xl font-black text-gray-900">{stats?.overdueCount || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Status Distribution */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 h-[500px] flex flex-col">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-10 flex items-center">
                            <PieChartIcon className="h-5 w-5 mr-3 text-indigo-500" />
                            Task Status Breakdown
                        </h3>
                        <div className="flex-1 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={100}
                                        outerRadius={160}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontWeight: 'bold' }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        formatter={(value: string) => <span className="text-xs font-bold text-gray-600 ml-2 uppercase tracking-widest">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Team Leaderboard */}
                    <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 h-[500px] flex flex-col">
                        <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-10 flex items-center">
                            <Users className="h-5 w-5 mr-3 text-indigo-500" />
                            Team Performance
                        </h3>
                        <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar space-y-6">
                            {performance.map((member, index) => (
                                <div key={index} className="group">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold overflow-hidden shadow-sm">
                                                {member.avatarUrl ? <img src={member.avatarUrl} className="h-full w-full object-cover" /> : member.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{member.name}</p>
                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{member.completed} / {member.totalAssigned} Tasks</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-gray-900">{member.completionRate}%</p>
                                            <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Efficiency</p>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-linear-to-r from-indigo-500 to-indigo-600 transition-all duration-1000 shadow-sm"
                                            style={{ width: `${member.completionRate}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Priority Distribution */}
                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 h-[400px]">
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-10 flex items-center">
                        <BarChartIcon className="h-5 w-5 mr-3 text-indigo-500" />
                        Priority Distribution
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={priorityData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="name"
                                    stroke="#9ca3af"
                                    fontSize={10}
                                    fontWeight="bold"
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    stroke="#9ca3af"
                                    fontSize={10}
                                    fontWeight="bold"
                                    tickLine={false}
                                    axisLine={false}
                                    dx={-10}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', fontWeight: 'bold' }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="#6366f1"
                                    radius={[10, 10, 0, 0]}
                                    barSize={60}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
