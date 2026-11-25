import NotificationBell from '@/components/admin/notification-bell';
import AppLogo from '@/components/app-logo';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    BarChart3,
    CheckCircle2,
    ChevronRight,
    CreditCard,
    FileText,
    Gauge,
    LayoutDashboard,
    LogOut,
    Settings,
    Shield,
    Users,
    X,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';

interface AdminLayoutProps {
    children: ReactNode;
    title?: string;
    breadcrumbs?: BreadcrumbItem[];
}

const navigationGroups = [
    {
        title: 'Main',
        items: [
            { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
            { title: 'Customers', href: '/admin/customers', icon: Users },
            { title: 'Accounts', href: '/admin/users', icon: Shield },
            { title: 'Meter Readings', href: '/admin/meter-readings', icon: Gauge },
            { title: 'Bills', href: '/admin/bills', icon: FileText },
            { title: 'Payments', href: '/admin/payments', icon: CreditCard },
            { title: 'Reports', href: '/admin/reports', icon: BarChart3 },
            { title: 'Settings', href: '/admin/settings', icon: Settings },
        ],
    },
];

export default function AdminLayout({ children, title, breadcrumbs }: AdminLayoutProps) {
    const { auth, flash } = usePage<SharedData & { flash: { success?: string; error?: string | string[] } }>().props;
    const currentPath = window.location.pathname;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <div className="relative flex h-screen flex-col overflow-hidden bg-slate-100/60 font-sans selection:bg-sky-200 selection:text-sky-900">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Lora:ital@1&display=swap');
                body { font-family: 'DM Sans', sans-serif; }
                .font-lora { font-family: 'Lora', serif; }
            `}</style>

            {/* Top Header */}
            <header className="flex h-16 shrink-0 items-center justify-between border border-slate-200/80 bg-white px-6 shadow-sm">
                {/* Left: Hamburger + Logo */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/dashboard" className="flex items-center gap-2">
                        <AppLogo subtitle="Administrator" />
                    </Link>
                </div>

                {/* Right: Search, Lang, Bell, Profile */}
                <div className="flex items-center gap-3">
                    <NotificationBell />
                </div>
            </header>

            {/* Bottom Content Area: Sidebar + Content Panel */}
            <div className="relative flex flex-1 overflow-hidden">
                {/* Mobile Sidebar Backdrop */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={() => setIsSidebarOpen(false)} />
                )}

                {/* Sidebar */}
                <aside
                    className={`fixed top-0 bottom-0 left-0 z-50 flex w-72 shrink-0 flex-col border border-slate-200/80 bg-white shadow-sm transition-all duration-300 ease-in-out lg:relative ${
                        isSidebarOpen
                            ? 'translate-x-0 opacity-100'
                            : '-translate-x-[calc(100%+2rem)] lg:pointer-events-none lg:w-0 lg:translate-x-0 lg:overflow-hidden lg:opacity-0'
                    }`}
                >
                    {/* Sidebar Header with Close Button */}
                    <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
                        <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Navigation</span>
                        <button
                            type="button"
                            onClick={() => setIsSidebarOpen(false)}
                            className="cursor-pointer rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
                            title="Close Sidebar"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Main Nav */}
                    <div className="mt-4 flex-1 space-y-6 overflow-y-auto px-4">
                        {navigationGroups.map((group) => (
                            <div key={group.title}>
                                <nav className="space-y-1">
                                    {group.items.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = currentPath.startsWith(item.href);
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-all duration-200 ${
                                                    isActive
                                                        ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/10'
                                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                                }`}
                                            >
                                                <Icon
                                                    className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                                                />
                                                <span className="flex-1">{item.title}</span>
                                                {!isActive && (
                                                    <ChevronRight className="h-3 w-3 text-slate-300 opacity-0 transition-opacity group-hover:opacity-100" />
                                                )}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                        ))}
                    </div>

                    {/* User Footer */}
                    <div className="border-t border-slate-100 p-4">
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="group flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border border-rose-100/50 bg-rose-50/50 px-4 py-3 text-[13px] font-bold text-rose-600 transition-all outline-none hover:border-rose-200 hover:bg-rose-50"
                        >
                            <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                            Sign Out
                        </Link>
                    </div>
                </aside>

                {/* Main Content Card */}
                <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden border border-slate-200/80 bg-white shadow-sm">
                    {/* Alerts Area */}
                    {(flash?.success || flash?.error) && (
                        <div className="animate-in fade-in slide-in-from-top-4 mt-4 shrink-0 px-6 duration-500 sm:px-8">
                            <div
                                className={`flex gap-3 rounded-xl border px-4 py-3 text-xs font-bold ${
                                    flash.success
                                        ? 'items-center border-emerald-200 bg-emerald-50 text-emerald-700'
                                        : 'items-start border-rose-200 bg-rose-50 text-rose-700'
                                }`}
                            >
                                <div
                                    className={`flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-lg ${flash.success ? 'bg-emerald-100' : 'mt-0.5 bg-rose-100'}`}
                                >
                                    {flash.success ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertCircle className="h-3.5 w-3.5" />}
                                </div>
                                {flash.success ? (
                                    <span className="whitespace-pre-line">{flash.success}</span>
                                ) : Array.isArray(flash.error) ? (
                                    <ul className="list-disc space-y-0.5 pl-4">
                                        {flash.error.map((message, i) => (
                                            <li key={i}>{message}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <span>{flash.error}</span>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Main Content Scrollable Area */}
                    <main className="flex-1 overflow-y-auto scroll-smooth p-6">{children}</main>
                </div>
            </div>
        </div>
    );
}
