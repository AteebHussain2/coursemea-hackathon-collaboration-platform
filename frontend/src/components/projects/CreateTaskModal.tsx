import React, { useState } from 'react';
import { X, Type, AlignLeft, Flag, Calendar, UserPlus } from 'lucide-react';
import { taskService } from '../../services/taskService';
import toast from 'react-hot-toast';

interface CreateTaskModalProps {
    workspaceId: string;
    projectId: string;
    initialStatus?: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    members: any[]; // Workspace members for assignment
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
    workspaceId,
    projectId,
    initialStatus = 'Todo',
    isOpen,
    onClose,
    onSuccess,
    members
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
    const [dueDate, setDueDate] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return toast.error('Task title is required');

        try {
            setIsLoading(true);
            const res = await taskService.createTask(workspaceId, projectId, {
                title,
                description,
                priority,
                dueDate: dueDate || undefined,
                assignedTo: assignedTo || undefined,
                status: initialStatus
            });

            if (res.success) {
                toast.success('Task created successfully!');
                onSuccess();
                onClose();
                setTitle('');
                setDescription('');
                setPriority('Medium');
                setDueDate('');
                setAssignedTo('');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create task');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300 border border-transparent dark:border-gray-800">
                <div className="p-8 pb-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Task</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <X className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            <Type className="h-4 w-4 mr-2 text-indigo-500" />
                            Task Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            <AlignLeft className="h-4 w-4 mr-2 text-indigo-500" />
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add more details..."
                            rows={3}
                            className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <Flag className="h-4 w-4 mr-2 text-indigo-500" />
                                Priority
                            </label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as any)}
                                className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none appearance-none text-gray-900 dark:text-white"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            <UserPlus className="h-4 w-4 mr-2 text-indigo-500" />
                            Assign To
                        </label>
                        <select
                            value={assignedTo}
                            onChange={(e) => setAssignedTo(e.target.value)}
                            className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none appearance-none text-gray-900 dark:text-white"
                        >
                            <option value="">Unassigned</option>
                            {members.map((member) => (
                                <option key={member._id} value={member.userId._id}>
                                    {member.userId.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-6 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95 disabled:opacity-70"
                        >
                            {isLoading ? 'Creating...' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;
