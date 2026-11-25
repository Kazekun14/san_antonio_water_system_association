import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Info, AlertTriangle, CheckCircle, Settings } from 'lucide-react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { Link } from '@inertiajs/react';

interface NotificationData {
    id: string;
    data: {
        type: string;
        title: string;
        message: string;
        metadata: any;
    };
    read_at: string | null;
    created_at: string;
}

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/api/admin/notifications');
            setNotifications(response.data.notifications);
            setUnreadCount(response.data.unreadCount);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Simple polling every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await axios.post(`/api/admin/notifications/${id}/read`);
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, read_at: new Date().toISOString() } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post('/api/admin/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString() })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'payment': return <CheckCircle className="w-4 h-4 text-emerald-600" />;
            case 'billing': return <Info className="w-4 h-4 text-sky-600" />;
            case 'alert': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
            case 'system': return <Settings className="w-4 h-4 text-indigo-600" />;
            default: return <Bell className="w-4 h-4 text-slate-400" />;
        }
    };

    const getIconBg = (type: string) => {
        switch (type) {
            case 'payment': return 'bg-emerald-50';
            case 'billing': return 'bg-sky-50';
            case 'alert': return 'bg-amber-50';
            case 'system': return 'bg-indigo-50';
            default: return 'bg-slate-100';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative cursor-pointer p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-sky-700 hover:border-sky-200 hover:bg-sky-50 transition-all duration-200"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-96 bg-white border border-slate-200 rounded-2xl shadow-[0_16px_48px_rgba(15,23,42,0.12)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 tracking-tight">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-[11px] font-bold text-sky-700 hover:text-sky-500 transition-colors uppercase tracking-wider"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-[450px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`px-6 py-5 hover:bg-slate-50 transition-colors relative group ${!notification.read_at ? 'bg-sky-50/50' : ''}`}
                                    >
                                        <div className="flex gap-4">
                                            <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${getIconBg(notification.data.type)}`}>
                                                {getIcon(notification.data.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <p className={`text-[13px] font-bold leading-tight truncate ${!notification.read_at ? 'text-slate-900' : 'text-slate-500'}`}>
                                                        {notification.data.title}
                                                    </p>
                                                    <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap mt-0.5">
                                                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                                    </span>
                                                </div>
                                                <p className="text-[12px] text-slate-500 leading-relaxed mb-3">
                                                    {notification.data.message}
                                                </p>
                                                {!notification.read_at && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        className="flex items-center gap-1.5 text-[11px] font-bold text-sky-700 hover:text-sky-500 transition-colors"
                                                    >
                                                        <Check className="w-3 h-3" />
                                                        Mark as read
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {!notification.read_at && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-600" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-16 flex flex-col items-center justify-center text-slate-400">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 border border-slate-200">
                                    <Bell className="w-8 h-8 opacity-30" />
                                </div>
                                <p className="text-sm font-semibold text-slate-500">All caught up!</p>
                                <p className="text-xs opacity-70 mt-1">No new notifications</p>
                            </div>
                        )}
                    </div>

                    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                        <Link
                            href="/admin/activity-log"
                            className="block w-full py-2.5 rounded-xl bg-white hover:bg-sky-50 text-[11px] font-bold text-slate-600 hover:text-sky-700 transition-all uppercase tracking-[0.1em] border border-slate-200 hover:border-sky-200 text-center"
                        >
                            View Activity Log
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}