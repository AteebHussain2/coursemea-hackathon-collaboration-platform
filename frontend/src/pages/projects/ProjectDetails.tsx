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
import UserBadge from '../../components/UserBadge';

const ProjectDetails: React.FC = () => {
    const { id: workspaceId, projectId } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [workspace, setWorkspace] = useState<WorkspaceDetailsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!project) return null;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Nav */}
            <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate(`/workspaces/${workspaceId}`)}
                            className="mr-6 p-2 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                        <div>
                            <div className="flex items-center space-x-2 text-xs text-gray-400 uppercase tracking-widest font-black mb-1">
                                <span>{workspace?.workspace.name}</span>
                                <ChevronRight className="h-3 w-3" />
                                <span className="text-indigo-500">Project Details</span>
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">{project.name}</h1>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <UserBadge />
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                {/* Board */}
                <div className="flex space-x-6 overflow-x-auto pb-8 scrollbar-hide">
                    {statuses.map((status) => (
                        <div key={status} className="shrink-0 w-80">
                            <div className="flex items-center justify-between mb-6 px-2">
                                <div className="flex items-center space-x-2">
                                    <div className={`h-2 w-2 rounded-full ${status === 'Todo' ? 'bg-gray-400' :
                                        status === 'In Progress' ? 'bg-blue-500' :
                                            status === 'Review' ? 'bg-purple-500' :
                                                'bg-emerald-500'
                                        }`}></div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-600">{status}</h3>
                                    <span className="bg-gray-200/50 text-gray-500 text-[10px] font-black px-2 py-0.5 rounded-full">
                                        {tasks.filter(t => t.status === status).length}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleAddTask(status)}
                                    className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-indigo-600 transition-all"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {tasks.filter(t => t.status === status).map((task) => (
                                    <div
                                        key={task._id}
                                        className="group bg-white p-5 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${task.priority === 'High' ? 'bg-red-50 text-red-600' :
                                                task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' :
                                                    'bg-blue-50 text-blue-600'
                                                }`}>
                                                {task.priority} Priority
                                            </span>
                                            <button className="text-gray-300 hover:text-gray-600">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <h4 className="font-bold text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                                            {task.title}
                                        </h4>
                                        <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                                            {task.description || 'No description provided.'}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                            <div className="flex items-center text-[10px] text-gray-400 font-bold">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                                            </div>
                                            <div className="flex -space-x-2">
                                                {task.assignedTo ? (
                                                    <div className="h-6 w-6 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center overflow-hidden" title={task.assignedTo.name}>
                                                        {task.assignedTo.avatarUrl ? (
                                                            <img src={task.assignedTo.avatarUrl} alt={task.assignedTo.name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <span className="text-[8px] font-bold text-indigo-600">{task.assignedTo.name.charAt(0)}</span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="h-6 w-6 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-gray-300">
                                                        <Users className="h-3 w-3" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={() => handleAddTask(status)}
                                    className="w-full py-4 border-2 border-dashed border-gray-100 rounded-3xl text-gray-400 text-xs font-bold hover:border-indigo-200 hover:text-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center group"
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
        </div>
    );
};

export default ProjectDetails;
