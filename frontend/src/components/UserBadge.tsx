import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, ChevronDown, Sparkles, Settings, Moon, Sun } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProfileSettingsModal from './ProfileSettingsModal';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const UserBadge: React.FC = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Signed out successfully');
            navigate('/login');
        } catch (error) {
            toast.error('Failed to sign out');
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all active:scale-95 group border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            >
                <div className="h-10 w-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-100 overflow-hidden">
                    {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                        <span>{user.name.charAt(0).toUpperCase()}</span>
                    )}
                </div>
                <div className="hidden md:block text-left">
                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">{user.name}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest mt-1">Logged In</p>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 py-3 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800 mb-2">
                            <p className="text-xs text-gray-400 font-black uppercase tracking-widest mb-1">Account</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.email}</p>
                        </div>

                        <button
                            onClick={() => {
                                setIsOpen(false);
                                setIsProfileModalOpen(true);
                            }}
                            className="w-full flex items-center space-x-3 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                        >
                            <Settings className="h-4 w-4" />
                            <span className="text-sm font-bold">Profile Settings</span>
                        </button>

                        <div className="px-4 mt-2 mb-2">
                            <div className="bg-linear-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-2xl p-4 flex items-center space-x-3 border border-indigo-100/50 dark:border-indigo-500/20">
                                <Sparkles className="h-5 w-5 text-indigo-500" />
                                <div>
                                    <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest leading-none mb-1">Pro Plan</p>
                                    <p className="text-[8px] text-indigo-400 dark:text-indigo-500 font-bold leading-none">Trial active for 14 days</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                toggleTheme();
                            }}
                            className="w-full flex items-center space-x-3 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
                        >
                            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                            <span className="text-sm font-bold">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                        </button>

                        <div className="border-t border-gray-50 dark:border-gray-800 mt-2 pt-2 px-2">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                <span className="text-sm font-bold">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </>
            )}

            <ProfileSettingsModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />
        </div>
    );
};

export default UserBadge;
