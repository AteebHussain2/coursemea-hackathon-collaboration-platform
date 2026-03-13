import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Plus,
    ArrowLeft,
    Calendar,
    MoreVertical,
    ChevronRight,
    Users
} from 'lucide-react';
import { taskService } from '../../services/taskService';
import type { Task } from '../../services/taskService';
import { projectService } from '../../services/projectService';
import type { Project } from '../../services/projectService';
import { workspaceService } from '../../services/workspaceService';
import type { WorkspaceDetailsResponse } from '../../services/workspaceService';
import toast from 'react-hot-toast';
import CreateTaskModal from '../../components/projects/CreateTaskModal';
import TaskDetailModal from '../../components/projects/TaskDetailModal';
import UserBadge from '../../components/UserBadge';
import NotificationCenter from '../../components/NotificationCenter';
import GlobalSearch from '../../components/GlobalSearch';

const ProjectDetails: React.FC = () => {
    const { id: workspaceId, projectId } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [workspace, setWorkspace] = useState<WorkspaceDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [activeStatus, setActiveStatus] = useState('Todo');
    const navigate = useNavigate();

    const statuses = ['Todo', 'In Progress', 'Review', 'Done'];

    useEffect(() => {
        if (workspaceId && projectId) {
            fetchData();
        }
    }, [workspaceId, projectId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [projRes, tasksRes, wsRes] = await Promise.all([
                projectService.getProjectDetails(workspaceId!, projectId!),
                taskService.getProjectTasks(workspaceId!, projectId!),
                workspaceService.getWorkspaceDetails(workspaceId!)
            ]);

            if (projRes.success) setProject(projRes.data);
            if (tasksRes.success) setTasks(tasksRes.data);
            if (wsRes.success) setWorkspace(wsRes.data);
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to load project details');
            navigate(`/workspaces/${workspaceId}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = (status: string) => {
        setActiveStatus(status);
        setIsTaskModalOpen(true);
    };

    const handleOpenDetail = (taskId: string) => {
        setSelectedTaskId(taskId);
        setIsDetailModalOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!project) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">
            {/* Nav */}
            <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm sticky top-0 z-50 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto min-h-20 py-4 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center w-full md:w-auto">
                        <button
                            onClick={() => navigate(`/workspaces/${workspaceId}`)}
                            className="mr-6 p-2 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                        <div className="min-w-0">
                            <div className="flex items-center space-x-2 text-[10px] text-gray-400 uppercase tracking-widest font-black mb-1 truncate">
                                <span>{workspace?.workspace.name}</span>
                                <ChevronRight className="h-3 w-3" />
                                <span className="text-indigo-500">Project Details</span>
                            </div>
                            <h1 className="text-xl font-black text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-xs">{project.name}</h1>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <GlobalSearch />
                        <NotificationCenter />
                        <UserBadge />
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {/* Board */}
                <div className="flex space-x-6 overflow-x-auto pb-10 px-4 sm:px-0 -mx-4 sm:mx-0 custom-scrollbar-premium">
                    {statuses.map((status) => (
                        <div key={status} className="shrink-0 w-[280px] sm:w-80">
                            <div className="flex items-center justify-between mb-6 px-2">
                                <div className="flex items-center space-x-3">
                                    <div className={`h-2.5 w-2.5 rounded-full shadow-sm ${status === 'Todo' ? 'bg-gray-400' :
                                        status === 'In Progress' ? 'bg-blue-500' :
                                            status === 'Review' ? 'bg-purple-500' :
                                                'bg-emerald-500'
                                        }`}></div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-600 dark:text-gray-400">{status}</h3>
                                    <span className="bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-black px-2 py-0.5 rounded-full">
                                        {tasks.filter(t => t.status === status).length}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleAddTask(status)}
                                    className="p-1.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {tasks.filter(t => t.status === status).map((task) => (
                                    <div
                                        key={task._id}
                                        onClick={() => handleOpenDetail(task._id)}
                                        className="group bg-white dark:bg-gray-900 p-5 rounded-4xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-2xl hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all duration-300 cursor-pointer relative overflow-hidden"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-xs ${task.priority === 'High' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                                                task.priority === 'Medium' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' :
                                                    'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                }`}>
                                                {task.priority} Priority
                                            </span>
                                            <button className="text-gray-300 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <h4 className="font-black text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {task.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-2 mb-4 leading-relaxed">
                                            {task.description || 'No description provided.'}
                                        </p>

                                        <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-gray-800">
                                            <div className="flex items-center text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest">
                                                <Calendar className="h-3 w-3 mr-1.5" />
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                                            </div>
                                            <div className="flex -space-x-2">
                                                {task.assignedTo ? (
                                                    <div className="h-8 w-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 border-2 border-white dark:border-gray-900 flex items-center justify-center overflow-hidden shadow-sm" title={task.assignedTo.name}>
                                                        {task.assignedTo.avatarUrl ? (
                                                            <img src={task.assignedTo.avatarUrl} alt={task.assignedTo.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">{task.assignedTo.name.charAt(0)}</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="h-8 w-8 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-white dark:border-gray-900 flex items-center justify-center text-gray-300 dark:text-gray-600 shadow-sm">
                                                        <Users className="h-4 w-4" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={() => handleAddTask(status)}
                                    className="w-full py-5 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-4xl text-gray-400 dark:text-gray-500 text-xs font-black uppercase tracking-widest hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all flex items-center justify-center group"
                                >
                                    <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                                    Add Task
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {workspace && (
                <CreateTaskModal
                    workspaceId={workspaceId!}
                    projectId={projectId!}
                    initialStatus={activeStatus}
                    isOpen={isTaskModalOpen}
                    onClose={() => setIsTaskModalOpen(false)}
                    onSuccess={fetchData}
                    members={workspace.members}
                />
            )}

            {selectedTaskId && (
                <TaskDetailModal
                    workspaceId={workspaceId!}
                    projectId={projectId!}
                    taskId={selectedTaskId}
                    isOpen={isDetailModalOpen}
                    onClose={() => setIsDetailModalOpen(false)}
                    onStatusChange={fetchData}
                />
            )}
        </div>
    );
};

export default ProjectDetails;
