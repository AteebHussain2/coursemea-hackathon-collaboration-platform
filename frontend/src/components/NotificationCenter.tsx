import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { notificationService, type Notification } from '../services/notificationService';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const NotificationCenter: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await notificationService.getMyNotifications();
            if (res.success) {
                setNotifications(res.data);
                setUnreadCount(res.data.filter(n => !n.read).length);
            }
        } catch (error) {
            console.error('Failed to fetch notifications');
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            const res = await notificationService.markAsRead(id);
            if (res.success) {
                setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const res = await notificationService.markAllAsRead();
            if (res.success) {
                setNotifications(notifications.map(n => ({ ...n, read: true })));
                setUnreadCount(0);
                toast.success('All marked as read');
            }
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-indigo-600 transition-colors bg-white rounded-xl shadow-sm border border-gray-50"
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-gray-50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 italic text-sm">
                                All caught up! 🎉
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification._id}
                                    className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors relative group ${!notification.read ? 'bg-indigo-50/30' : ''}`}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[10px] font-bold text-indigo-600 shrink-0 border border-gray-100 overflow-hidden">
                                            {notification.sender.avatarUrl ? (
                                                <img src={notification.sender.avatarUrl} className="h-full w-full object-cover" />
                                            ) : (
                                                notification.sender.name.charAt(0)
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-900 leading-relaxed mb-1">
                                                <span className="font-bold">{notification.sender.name}</span> {notification.message}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-gray-400">{new Date(notification.createdAt).toLocaleDateString()}</span>
                                                {notification.link && (
                                                    <Link
                                                        to={notification.link}
                                                        onClick={() => {
                                                            setIsOpen(false);
                                                            handleMarkAsRead(notification._id);
                                                        }}
                                                        className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 flex items-center"
                                                    >
                                                        View <ExternalLink className="h-2 w-2 ml-1" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                        {!notification.read && (
                                            <button
                                                onClick={() => handleMarkAsRead(notification._id)}
                                                className="absolute right-2 top-2 p-1 bg-white text-indigo-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:text-indigo-600 border border-gray-100 shadow-sm"
                                            >
                                                <Check className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
