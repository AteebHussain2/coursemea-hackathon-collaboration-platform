import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Briefcase, Layout, CheckSquare, ChevronRight } from 'lucide-react';
import { searchService, type SearchResults } from '../services/searchService';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';

const GlobalSearch: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResults | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const debouncedQuery = useDebounce(query, 300);
    const navigate = useNavigate();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (debouncedQuery.length > 1) {
            handleSearch();
        } else {
            setResults(null);
        }
    }, [debouncedQuery]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSearch = async () => {
        try {
            setIsLoading(true);
            const res = await searchService.globalSearch(debouncedQuery);
            if (res.success) {
                setResults(res.data);
            }
        } catch (error) {
            console.error('Search failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        setIsOpen(false);
        setQuery('');
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="hidden md:flex items-center space-x-3 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-750 transition-all w-64 group"
            >
                <Search className="h-4 w-4 group-hover:text-indigo-600 transition-colors" />
                <span className="text-xs font-bold">Search everything...</span>
                <span className="text-[10px] font-black bg-white dark:bg-gray-900 px-1.5 py-0.5 rounded-lg border border-gray-100 dark:border-gray-800 shadow-sm ml-auto">⌘K</span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-100 flex items-start justify-center pt-24 p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in slide-in-from-top-4 duration-300 border border-gray-100 dark:border-gray-800"
            >
                <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex items-center space-x-4">
                    <Search className="h-6 w-6 text-indigo-500" />
                    <input
                        autoFocus
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for tasks, projects, workspaces..."
                        className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-gray-600"
                    />
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-full text-gray-400 transition-colors">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
                    {isLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center space-y-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Searching the hub...</p>
                        </div>
                    ) : results ? (
                        <div className="space-y-8 p-2">
                            {/* Workspaces */}
                            {results.workspaces.length > 0 && (
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 ml-2">Workspaces</h3>
                                    <div className="space-y-1">
                                        {results.workspaces.map(ws => (
                                            <button
                                                key={ws._id}
                                                onClick={() => handleNavigate(`/workspaces/${ws._id}`)}
                                                className="w-full flex items-center p-3 rounded-2xl hover:bg-indigo-50 dark:hover:bg-indigo-900/30 group transition-all text-left"
                                            >
                                                <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors border border-transparent group-hover:border-indigo-100 dark:group-hover:border-indigo-900/50">
                                                    <Briefcase className="h-5 w-5" />
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{ws.name}</div>
                                                    <div className="text-[10px] text-gray-400 dark:text-gray-500 truncate max-w-sm">{ws.description}</div>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Projects */}
                            {results.projects.length > 0 && (
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 ml-2">Projects</h3>
                                    <div className="space-y-1">
                                        {results.projects.map(p => (
                                            <button
                                                key={p._id}
                                                onClick={() => handleNavigate(`/workspaces/${p.workspaceId}/projects/${p._id}`)}
                                                className="w-full flex items-center p-3 rounded-2xl hover:bg-emerald-50 dark:hover:bg-emerald-900/30 group transition-all text-left"
                                            >
                                                <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors border border-transparent group-hover:border-emerald-100 dark:group-hover:border-emerald-900/50">
                                                    <Layout className="h-5 w-5" />
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">{p.name}</div>
                                                    <div className="text-[10px] text-gray-400 dark:text-gray-500">Active Project</div>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tasks */}
                            {results.tasks.length > 0 && (
                                <div>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 ml-2">Tasks</h3>
                                    <div className="space-y-1">
                                        {results.tasks.map(t => (
                                            <button
                                                key={t._id}
                                                onClick={() => handleNavigate(`/workspaces/${t.workspaceId}/projects/${t.projectId._id}`)}
                                                className="w-full flex items-center p-3 rounded-2xl hover:bg-amber-50 dark:hover:bg-amber-900/30 group transition-all text-left"
                                            >
                                                <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 group-hover:bg-white dark:group-hover:bg-gray-800 transition-colors border border-transparent group-hover:border-amber-100 dark:group-hover:border-amber-900/50">
                                                    <CheckSquare className="h-5 w-5" />
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <div className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">{t.title}</div>
                                                    <div className="text-[10px] text-gray-400 dark:text-gray-500">In project: {t.projectId.name}</div>
                                                </div>
                                                <div className="flex flex-col items-end">
                                                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg border mb-1 ${t.priority === 'High' ? 'bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 border-red-100 dark:border-red-900/50' :
                                                        t.priority === 'Medium' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-500 dark:text-amber-400 border-amber-100 dark:border-amber-900/50' :
                                                            'bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 border-blue-100 dark:border-blue-900/50'
                                                        }`}>
                                                        {t.priority}
                                                    </span>
                                                    <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {results.workspaces.length === 0 && results.projects.length === 0 && results.tasks.length === 0 && (
                                <div className="py-20 text-center space-y-4 opacity-30">
                                    <Search className="h-12 w-12 mx-auto text-gray-400" />
                                    <p className="text-sm font-bold italic text-gray-600">No results found for "{query}"</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="py-20 text-center space-y-4 opacity-30">
                            <Search className="h-12 w-12 mx-auto text-gray-400" />
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Start typing to search...</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center"><span className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-1 py-0.5 rounded shadow-sm mr-2 text-gray-600 dark:text-gray-400 font-black">↑↓</span> Navigate</span>
                        <span className="flex items-center"><span className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-1 py-0.5 rounded shadow-sm mr-2 text-gray-600 dark:text-gray-400 font-black">Enter</span> Select</span>
                    </div>
                    <div>
                        <span className="flex items-center"><span className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 px-1 py-0.5 rounded shadow-sm mr-2 text-gray-600 dark:text-gray-400 font-black">Esc</span> Close</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalSearch;
