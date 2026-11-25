import { useState, useEffect, useRef } from 'react';
import { Bell, Megaphone, CheckCircle2, Clock, X } from 'lucide-react';
import { Link, usePage, router } from '@inertiajs/react';
import { type SharedData } from '@/types';

export default function NotificationBell() {
    const { auth } = usePage<SharedData>().props;
    const [isOpen, setIsOpen] = useState(false);
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/announcements');
            const data = await res.json();
            setAnnouncements(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchAnnouncements();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id: number) => {
        try {
            await fetch(`/api/announcements/${id}/read`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                    'Content-Type': 'application/json',
                },
            });
            // Update local state or just refresh the page data
            router.reload({ only: ['auth'] });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 transition-colors rounded-xl ${
                    isOpen 
                        ? 'text-blue-600 bg-blue-50' 
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
            >
                <Bell className="w-5 h-5" />
                {auth.unreadAnnouncementsCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center bg-blue-500 rounded-full border-2 border-[#020617] text-[9px] font-black text-white animate-pulse">
                        {auth.unreadAnnouncementsCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-slate-200 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                            <Megaphone className="w-3.5 h-3.5 text-blue-600" /> Notifications
                        </h3>
                        {auth.unreadAnnouncementsCount > 0 && (
                            <span className="text-[10px] bg-blue-600/10 text-blue-600 px-2 py-0.5 rounded-full font-bold">
                                {auth.unreadAnnouncementsCount} NEW
                            </span>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                        {loading ? (
                            <div className="p-10 flex flex-col items-center justify-center gap-3">
                                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest">Checking updates...</p>
                            </div>
                        ) : announcements.length === 0 ? (
                            <div className="p-10 text-center">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle2 className="w-6 h-6 text-slate-300" />
                                </div>
                                <p className="text-sm font-bold text-slate-900">All caught up!</p>
                                <p className="text-[11px] text-slate-500 mt-1 uppercase tracking-widest">No new announcements</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {announcements.map((item) => (
                                    <div 
                                        key={item.id} 
                                        onClick={() => markAsRead(item.id)}
                                        className="p-4 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                                    >
                                        <div className="flex gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.is_pinned ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                                <Megaphone className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">{item.title}</h4>
                                                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
                                                        <Clock className="w-2.5 h-2.5" /> {item.created_at}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {auth.user.role === 'admin' && (
                        <Link 
                            href="/admin/announcements" 
                            onClick={() => setIsOpen(false)}
                            className="block p-3 text-center text-[11px] font-bold text-slate-400 hover:text-blue-600 bg-slate-50/50 hover:bg-slate-100/50 transition-all border-t border-slate-100 uppercase tracking-widest"
                        >
                            View All Announcements
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
