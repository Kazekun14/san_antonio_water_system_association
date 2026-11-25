import NotificationBell from '@/components/admin/notification-bell';
import AppLogo from '@/components/app-logo';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, CreditCard, FileText, Gauge, LayoutDashboard, LogOut, Users } from 'lucide-react';
import { type ReactNode } from 'react';

interface StaffLayoutProps {
    children: ReactNode;
    title?: string;
}

const navItems = [
    { title: 'Dashboard', href: '/staff/dashboard', icon: LayoutDashboard },
    { title: 'Customers', href: '/staff/customers', icon: Users },
    { title: 'Meter Readings', href: '/staff/meter-readings', icon: Gauge },
    { title: 'Bills', href: '/staff/bills', icon: FileText },
    { title: 'Payments', href: '/staff/payments', icon: CreditCard },
];

export default function StaffLayout({ children, title }: StaffLayoutProps) {
    const { auth, flash } = usePage<SharedData & { flash: { success?: string; error?: string | string[] } }>().props;
    const currentPath = window.location.pathname;

    return (
        <div className="dark flex min-h-screen bg-[#020617] font-sans selection:bg-teal-500/30 selection:text-teal-200">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
                body { font-family: 'DM Sans', sans-serif; }
            `}</style>

            {/* Sidebar */}
            <aside className="sticky top-0 z-40 flex h-screen w-72 shrink-0 flex-col border-r border-slate-800/50 bg-[#020617]">
                {/* Logo Section */}
                <div className="border-b border-slate-800/50 px-6 py-6">
                    <Link href="/staff/dashboard" className="flex items-center gap-3">
                        <AppLogo subtitle="Operations" />
                    </Link>
                </div>

                {/* Main Nav */}
                <div className="mt-4 flex-1 space-y-8 px-4">
                    <div>
                        <p className="mb-4 px-4 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase">Main Menu</p>
                        <nav className="space-y-1.5">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = currentPath.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`group flex items-center gap-3.5 rounded-2xl px-4 py-3 text-[13px] font-semibold transition-all duration-300 ${
                                            isActive
                                                ? 'bg-teal-500/10 text-teal-400 shadow-[inset_0_0_12px_rgba(20,184,166,0.05)]'
                                                : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
                                        }`}
                                    >
                                        <Icon
                                            className={`h-[18px] w-[18px] shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
                                        />
                                        {item.title}
                                        {isActive && (
                                            <div className="ml-auto h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Secondary Section could go here */}
                </div>

                {/* User Footer */}
                <div className="p-6">
                    <div className="rounded-3xl border border-slate-800/50 bg-slate-900/40 p-4 transition-all hover:border-slate-700/50">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="relative">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-sm font-bold text-white shadow-lg shadow-teal-500/20">
                                    {auth.user?.full_name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2 border-[#020617] bg-emerald-500" />
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-[13px] leading-tight font-bold text-white">{auth.user?.full_name}</p>
                                <p className="mt-0.5 text-[10px] font-semibold tracking-wider text-slate-500">
                                    {auth.user?.position_label || 'Staff'}
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-transparent px-3 py-2 text-xs font-bold text-slate-400 transition-all hover:border-rose-500/20 hover:bg-rose-500/10 hover:text-rose-400"
                        >
                            <LogOut className="h-3.5 w-3.5" />
                            Sign Out
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex min-w-0 flex-1 flex-col">
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-800/50 bg-[#020617]/80 px-10 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <h1 className="text-sm font-bold tracking-[0.05em] tracking-tight text-white uppercase">
                            {title || 'Operational Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-5">
                        <NotificationBell />
                    </div>
                </header>

                {/* Alerts Area */}
                {(flash?.success || flash?.error) && (
                    <div className="animate-in fade-in slide-in-from-top-4 mt-6 px-10 duration-500">
                        <div
                            className={`flex gap-3 rounded-2xl border px-5 py-4 text-[13px] font-bold ${
                                flash.success
                                    ? 'items-center border-emerald-500/20 bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/5'
                                    : 'items-start border-rose-500/20 bg-rose-500/10 text-rose-400 shadow-lg shadow-rose-500/5'
                            }`}
                        >
                            <div
                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${flash.success ? 'bg-emerald-500/20' : 'mt-0.5 bg-rose-500/20'}`}
                            >
                                {flash.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
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

                {/* Main Content */}
                <main className="flex-1 overflow-auto scroll-smooth p-10">
                    <div className="mx-auto max-w-[1400px]">{children}</div>
                </main>
            </div>
        </div>
    );
}
