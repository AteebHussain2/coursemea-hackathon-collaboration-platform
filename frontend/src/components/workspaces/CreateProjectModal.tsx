import React, { useState } from 'react';
import { X, Layout, Calendar, AlignLeft, Sparkles } from 'lucide-react';
import { projectService } from '../../services/projectService';
import toast from 'react-hot-toast';

interface CreateProjectModalProps {
    workspaceId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ workspaceId, isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return toast.error('Project name is required');

        try {
            setIsLoading(true);
            const res = await projectService.createProject(workspaceId, { name, description, deadline });
            if (res.success) {
                toast.success('Project created successfully!');
                onSuccess();
                onClose();
                setName('');
                setDescription('');
                setDeadline('');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create project');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-4xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-300 border border-transparent dark:border-gray-800">
                {/* Header */}
                <div className="bg-linear-to-br from-indigo-600 to-indigo-700 p-8 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <div className="inline-flex items-center justify-center p-3 bg-white/20 rounded-2xl mb-4">
                        <Sparkles className="h-6 w-6" />
                    </div>
                    <h2 className="text-3xl font-bold">New Project</h2>
                    <p className="text-indigo-100 mt-2">Create a workspace for your team tasks.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            <Layout className="h-4 w-4 mr-2 text-indigo-500" />
                            Project Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Website Redesign"
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
                            placeholder="What is this project about?"
                            rows={3}
                            className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        />
                    </div>

                    <div>
                        <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                            Deadline (Optional)
                        </label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full px-5 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-gray-900 dark:text-white"
                        />
                    </div>

                    <div className="flex space-x-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-6 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95 disabled:opacity-70"
                        >
                            {isLoading ? 'Creating...' : 'Launch Project'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;
