import React, { useState, useEffect } from 'react';
import {
    X,
    MessageSquare,
    Send,
    Calendar,
    Flag,
    User,
    Trash2,
    Clock,
    CheckCircle2,
    Paperclip,
    Download,
    FileText
} from 'lucide-react';
import { commentService } from '../../services/commentService';
import type { Comment } from '../../services/commentService';
import { taskService } from '../../services/taskService';
import type { Task } from '../../services/taskService';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface TaskDetailModalProps {
    workspaceId: string;
    projectId: string;
    taskId: string;
    isOpen: boolean;
    onClose: () => void;
    onStatusChange: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
    workspaceId,
    projectId,
    taskId,
    isOpen,
    onClose,
    onStatusChange
}) => {
    const [task, setTask] = useState<Task | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (isOpen && taskId) {
            fetchTaskDetails();
        }
    }, [isOpen, taskId]);

    const fetchTaskDetails = async () => {
        try {
            setIsLoading(true);
            const [taskRes, commentsRes] = await Promise.all([
                taskService.getTaskDetails(workspaceId, projectId, taskId),
                commentService.getTaskComments(workspaceId, projectId, taskId)
            ]);

            if (taskRes.success) setTask(taskRes.data);
            if (commentsRes.success) setComments(commentsRes.data);
        } catch (error) {
            toast.error('Failed to load task details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setIsSending(true);
            const res = await commentService.addComment(workspaceId, projectId, taskId, newComment);
            if (res.success) {
                setComments([...comments, res.data]);
                setNewComment('');
                toast.success('Comment added');
            }
        } catch (error) {
            toast.error('Failed to add comment');
        } finally {
            setIsSending(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            const res = await commentService.deleteComment(workspaceId, projectId, taskId, commentId);
            if (res.success) {
                setComments(comments.filter(c => c._id !== commentId));
                toast.success('Comment deleted');
            }
        } catch (error) {
            toast.error('Failed to delete comment');
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        try {
            const res = await taskService.updateTask(workspaceId, projectId, taskId, { status: newStatus as any });
            if (res.success) {
                setTask({ ...task!, status: newStatus as any });
                onStatusChange();
                toast.success(`Moved to ${newStatus}`);
            }
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const res = await projectService.uploadAttachment(workspaceId, projectId, taskId, file);
            if (res.success) {
                setTask({
                    ...task!,
                    attachments: [...(task?.attachments || []), res.data]
                });
                toast.success('File uploaded');
            }
        } catch (error) {
            toast.error('Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in duration-300">
                {/* Header */}
                <div className="p-8 border-b border-gray-50 flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-widest text-indigo-500">
                            <Clock className="h-3 w-3" />
                            <span>Task Details</span>
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 leading-tight">
                            {isLoading ? 'Loading...' : task?.title}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-6 w-6 text-gray-400" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center p-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto flex">
                        {/* Left Side: Details */}
                        <div className="flex-[1.5] p-8 border-r border-gray-50 space-y-8">
                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center">
                                    <Clock className="h-3 w-3 mr-2 text-indigo-500" />
                                    Description
                                </h3>
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                    {task?.description || 'No description provided for this task.'}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center">
                                        <Flag className="h-3 w-3 mr-2 text-indigo-500" />
                                        Priority
                                    </h3>
                                    <span className={`px-4 py-2 rounded-2xl text-xs font-bold ${task?.priority === 'High' ? 'bg-red-50 text-red-600 border border-red-100' :
                                        task?.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                            'bg-blue-50 text-blue-600 border border-blue-100'
                                        }`}>
                                        {task?.priority} Priority
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center">
                                        <Calendar className="h-3 w-3 mr-2 text-indigo-500" />
                                        Due Date
                                    </h3>
                                    <div className="flex items-center text-sm font-bold text-gray-700">
                                        {task?.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'No due date'}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center">
                                    <CheckCircle2 className="h-3 w-3 mr-2 text-indigo-500" />
                                    Move to Status
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Todo', 'In Progress', 'Review', 'Done'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusUpdate(status)}
                                            className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${task?.status === status
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-50">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center">
                                    <User className="h-3 w-3 mr-2 text-indigo-500" />
                                    Assigned To
                                </h3>
                                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-3xl">
                                    {task?.assignedTo ? (
                                        <>
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden shadow-sm">
                                                {task.assignedTo.avatarUrl ? <img src={task.assignedTo.avatarUrl} className="h-full w-full object-cover" /> : task.assignedTo.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-900">{task.assignedTo.name}</div>
                                                <div className="text-xs text-gray-400">{task.assignedTo.email}</div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-sm font-bold text-gray-400 italic">Unassigned</div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-8 border-t border-gray-50">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center">
                                        <Paperclip className="h-3 w-3 mr-2 text-indigo-500" />
                                        Attachments ({task?.attachments?.length || 0})
                                    </h3>
                                    <label className={`cursor-pointer text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                        {isUploading ? 'Uploading...' : '+ Upload File'}
                                        <input type="file" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                                    </label>
                                </div>
                                <div className="space-y-2">
                                    {task?.attachments && task.attachments.length > 0 ? (
                                        task.attachments.map((file: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl group hover:bg-gray-100 transition-all">
                                                <div className="flex items-center space-x-3 overflow-hidden">
                                                    <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                                                    <span className="text-xs font-bold text-gray-900 truncate">{file.name}</span>
                                                </div>
                                                <a
                                                    href={`${import.meta.env.VITE_API_URL?.replace('/api/v1', '')}${file.url}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-1.5 bg-white rounded-lg shadow-sm text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <Download className="h-3 w-3" />
                                                </a>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-xs text-gray-400 italic bg-gray-50/50 rounded-2xl">
                                            No attachments yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Comments */}
                        <div className="flex-1 bg-gray-50/50 p-8 flex flex-col">
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center">
                                <MessageSquare className="h-3 w-3 mr-2 text-indigo-500" />
                                Discussions ({comments.length})
                            </h3>

                            <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar mb-6">
                                {comments.length === 0 ? (
                                    <div className="text-center py-10 opacity-30 italic text-sm text-gray-400">
                                        No comments yet. Start the conversation!
                                    </div>
                                ) : (
                                    comments.map(comment => (
                                        <div key={comment._id} className="group italic-reset">
                                            <div className="flex items-start space-x-3">
                                                <div className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[10px] font-bold text-indigo-600 border border-gray-100 overflow-hidden ring-2 ring-transparent group-hover:ring-indigo-100 transition-all">
                                                    {comment.userId.avatarUrl ? <img src={comment.userId.avatarUrl} className="h-full w-full object-cover" /> : comment.userId.name.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="text-xs font-bold text-gray-900 truncate">{comment.userId.name}</span>
                                                        <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm text-xs text-gray-600 leading-relaxed wrap-break-word relative group">
                                                        {comment.content}
                                                        {comment.userId._id === user?._id && (
                                                            <button
                                                                onClick={() => handleDeleteComment(comment._id)}
                                                                className="absolute -right-2 -top-2 p-1 bg-red-50 text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600 border border-red-100"
                                                            >
                                                                <Trash2 className="h-3 w-3" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Add Comment */}
                            <form onSubmit={handleAddComment} className="relative">
                                <textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="w-full bg-white border border-gray-100 rounded-3xl p-4 pr-12 text-xs focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm resize-none"
                                    rows={3}
                                />
                                <button
                                    type="submit"
                                    disabled={isSending || !newComment.trim()}
                                    className="absolute right-3 bottom-4 p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskDetailModal;
