import React from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';
import { Bell, CheckCircle, Info, AlertTriangle, Settings, Clock, User, CreditCard, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
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

interface Props {
    notifications: {
        data: Notification[];
        links: any[];
    };
}

export default function ActivityLog({ notifications }: Props) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'payment': return <CreditCard className="w-5 h-5 text-emerald-600" />;
            case 'billing': return <FileText className="w-5 h-5 text-sky-700" />;
            case 'alert': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
            case 'system': return <Settings className="w-5 h-5 text-indigo-600" />;
            default: return <Bell className="w-5 h-5 text-slate-500" />;
        }
    };

    const getIconBg = (type: string) => {
        switch (type) {
            case 'payment': return 'bg-emerald-50 border-emerald-100';
            case 'billing': return 'bg-sky-50 border-sky-100';
            case 'alert': return 'bg-amber-50 border-amber-100';
            case 'system': return 'bg-indigo-50 border-indigo-100';
            default: return 'bg-slate-50 border-slate-100';
        }
    };

    return (
        <AdminLayout title="System Activity Log">
            <Head title="Activity Log" />
            
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Clock className="h-6 w-6 text-sky-700" /> Recent Activity
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">History of all system notifications and events.</p>
                </div>

                {/* Activity list card */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="divide-y divide-slate-100">
                        {notifications.data.length > 0 ? (
                            notifications.data.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`flex gap-5 p-6 transition-colors hover:bg-slate-50/70 ${!notification.read_at ? 'bg-sky-50/40' : ''}`}
                                >
                                    <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center border ${getIconBg(notification.data.type)}`}>
                                        {getIcon(notification.data.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-1">
                                            <h3 className={`font-bold text-base leading-tight ${!notification.read_at ? 'text-slate-900' : 'text-slate-600'}`}>
                                                {notification.data.title}
                                            </h3>
                                            {!notification.read_at && (
                                                <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[10px] font-bold uppercase tracking-wider border border-sky-200">
                                                    Unread
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-500 text-sm leading-relaxed">
                                            {notification.data.message}
                                        </p>
                                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-2">
                                            <Clock className="w-3 h-3" />
                                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 flex flex-col items-center justify-center">
                                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                                    <Bell className="w-8 h-8 text-slate-300" />
                                </div>
                                <p className="text-base font-bold text-slate-500">No activity recorded yet</p>
                                <p className="text-sm text-slate-400 mt-1">System events and notifications will appear here.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {notifications.links.length > 3 && (
                        <div className="mt-0 px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-center gap-2">
                            {/* Pagination links would go here */}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
