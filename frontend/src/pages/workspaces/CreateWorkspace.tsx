import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { workspaceService } from '../../services/workspaceService';
import { Layout, ArrowLeft, Send, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateWorkspace: React.FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        setLoading(true);
        try {
            const res = await workspaceService.createWorkspace({ name, description });
            if (res.success) {
                toast.success('Workspace created successfully!');
                navigate(`/workspaces/${res.data._id}`);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create workspace');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
            <div className="absolute top-8 left-8">
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                    <div className="p-2 rounded-xl group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors mr-2">
                        <ArrowLeft className="h-5 w-5" />
                    </div>
                    <span className="font-bold uppercase tracking-widest text-[10px]">Back</span>
                </button>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="p-5 bg-indigo-600 rounded-4xl shadow-2xl shadow-indigo-200 dark:shadow-none">
                        <Layout className="h-10 w-10 text-white" />
                    </div>
                </div>
                <h2 className="mt-8 text-center text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                    Start Something Great
                </h2>
                <p className="mt-4 text-center text-sm font-bold text-gray-400">
                    Create a workspace to organize your team's projects.
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-xl px-4">
                <div className="bg-white dark:bg-gray-900 py-10 px-6 shadow-2xl rounded-5xl border border-gray-100 dark:border-gray-800 sm:px-12 relative overflow-hidden">
                    {/* Decorative element */}
                    <div className="absolute top-0 right-0 p-2 transform rotate-12 -mr-4 -mt-4 opacity-10">
                        <Sparkles className="h-24 w-24 text-indigo-600" />
                    </div>

                    <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">
                                Workspace Name
                            </label>
                            <div className="relative">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Design Team, Product Launch"
                                    className="appearance-none block w-full px-6 py-5 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-800 transition-all sm:text-base font-bold text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">
                                Description (Optional)
                            </label>
                            <div className="relative">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What is this workspace for?"
                                    className="appearance-none block w-full px-6 py-5 bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-gray-800 transition-all sm:text-base font-bold text-gray-900 dark:text-white resize-none"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center items-center py-5 px-6 border border-transparent rounded-4xl shadow-xl shadow-indigo-100 dark:shadow-none text-sm font-black uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98] ${loading ? 'opacity-70 cursor-not-allowed shadow-none' : ''
                                    }`}
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                                ) : (
                                    <Send className="h-4 w-4 mr-3" />
                                )}
                                {loading ? 'Launching...' : 'Launch Workspace'}
                            </button>
                        </div>
                    </form>
                </div>

                <p className="mt-8 text-center text-sm text-gray-400">
                    Trusted by developers worldwide for CourseMea Hackathon 2026.
                </p>
            </div>
        </div>
    );
};

export default CreateWorkspace;
