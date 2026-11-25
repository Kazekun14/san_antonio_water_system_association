import AdminLayout from '@/layouts/admin-layout';
import { Head, Link } from '@inertiajs/react';
import { Users, FileText, CreditCard, TrendingUp, AlertCircle, CheckCircle, Clock, DollarSign, ArrowRight, PieChart, Activity, ShieldCheck } from 'lucide-react';

interface Stats {
    totalCustomers: number;
    totalStaff: number;
    totalAccounts: number;
    totalRevenue: number;
    unpaidBills: number;
    overdueBills: number;
    pendingPayments: number;
}

interface Payment {
    id: number;
    method: string;
    status: string;
    created_at: string;
    customer: { full_name: string; meter_number: string };
    bill: { amount: string };
}

interface Bill {
    id: number;
    amount: string;
    status: string;
    billing_date: string;
    customer: { full_name: string; meter_number: string };
}

export default function AdminDashboard({
    stats,
    recentPayments,
    recentBills,
}: {
    stats: Stats;
    recentPayments: Payment[];
    recentBills: Bill[];
}) {
    const statCards = [
        {
            label: 'Total Accounts',
            value: stats.totalAccounts,
            icon: ShieldCheck,
            color: 'sky',
            href: '/admin/users',
            desc: 'System-wide users'
        },
        {
            label: 'Total Customers',
            value: stats.totalCustomers,
            icon: Users,
            color: 'blue',
            href: '/admin/customers',
            desc: 'Registered households'
        },
        {
            label: 'Total Revenue',
            value: `₱${parseFloat(stats.totalRevenue as any).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
            icon: DollarSign,
            color: 'emerald',
            href: '/admin/reports',
            desc: 'System-wide collections'
        },
        {
            label: 'Unpaid Statements',
            value: stats.unpaidBills + stats.overdueBills,
            icon: AlertCircle,
            color: 'rose',
            href: '/admin/bills?status=unpaid',
            desc: 'Pending settlement'
        },
        {
            label: 'Pending Approvals',
            value: stats.pendingPayments,
            icon: Clock,
            color: 'amber',
            href: '/admin/payments?status=pending',
            desc: 'Awaiting verification'
        },
    ];

    const colors: Record<string, { border: string, text: string, bg: string, iconBg: string, iconText: string }> = {
        sky: { border: 'border-slate-200 hover:border-sky-200', text: 'text-sky-700', bg: 'bg-sky-50', iconBg: 'bg-sky-50', iconText: 'text-sky-600' },
        blue: { border: 'border-slate-200 hover:border-blue-200', text: 'text-blue-700', bg: 'bg-blue-50', iconBg: 'bg-blue-50', iconText: 'text-blue-600' },
        emerald: { border: 'border-slate-200 hover:border-emerald-200', text: 'text-emerald-700', bg: 'bg-emerald-50', iconBg: 'bg-emerald-50', iconText: 'text-emerald-600' },
        rose: { border: 'border-slate-200 hover:border-rose-200', text: 'text-rose-700', bg: 'bg-rose-50', iconBg: 'bg-rose-50', iconText: 'text-rose-600' },
        amber: { border: 'border-slate-200 hover:border-amber-200', text: 'text-amber-700', bg: 'bg-amber-50', iconBg: 'bg-amber-50', iconText: 'text-amber-600' },
    };

    return (
        <AdminLayout title="System Overview">
            <Head title="Admin Dashboard" />

            <div className="space-y-10 pb-10">
                {/* ── Welcome Hero ── */}
                <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-sky-950 via-sky-900 to-sky-700 px-8 py-9 sm:px-10 sm:py-10">
                    {/* Blobs, matching the public hero */}
                    <div className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-sky-400/30 blur-[70px] pointer-events-none" />
                    <div className="absolute bottom-0 -left-10 w-56 h-56 rounded-full bg-sky-950/50 blur-[60px] pointer-events-none" />
                    <div
                        className="absolute inset-0 pointer-events-none opacity-60"
                        style={{
                            backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
                            backgroundSize: '26px 26px',
                        }}
                    />

                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 mb-4 bg-sky-400/20 border border-sky-400/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-300 shadow-[0_0_8px_rgba(125,211,252,0.8)]" />
                                <span className="text-[11px] font-bold uppercase tracking-widest text-sky-300">System Command Center</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight leading-tight">
                                System <span className="font-lora italic text-sky-300 font-normal">Oversight</span>
                            </h2>
                            <p className="text-sky-200/80 mt-2 text-sm font-light">Monitoring Barangay San Antonio's water utility operations.</p>
                        </div>

                        <div className="flex items-center gap-3 bg-white/[0.07] backdrop-blur-xl border border-white/[0.15] rounded-2xl px-5 py-3">
                            <ShieldCheck className="w-5 h-5 text-sky-300" />
                            <div>
                                <p className="text-[10px] text-sky-300/80 font-bold uppercase tracking-widest">Active Staff</p>
                                <p className="text-sm font-bold text-white">{stats.totalStaff} Personnel Online</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Stat cards ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                    {statCards.map((card) => {
                        const Icon = card.icon;
                        const cls = colors[card.color];
                        return (
                            <Link
                                key={card.label}
                                href={card.href}
                                className={`group relative overflow-hidden rounded-2xl border bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(14,165,233,0.10)] ${cls.border}`}
                            >
                                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${cls.iconBg} ${cls.iconText} mb-5 transition-transform duration-200 group-hover:scale-110`}>
                                    <Icon className="h-5 w-5" />
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{card.label}</p>
                                    <p className="text-[26px] font-bold text-slate-900 tracking-tight">{card.value}</p>
                                    <p className="text-[12px] text-slate-500">{card.desc}</p>
                                </div>

                                <div className={`mt-6 flex items-center gap-1.5 text-[11px] font-bold ${cls.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                                    Detailed Report <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* ── Operations Monitoring ── */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {/* Recent Payments Monitor */}
                    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between px-7 py-6 border-b border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                                    <Activity className="h-5 w-5 text-sky-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 tracking-tight">Financial Stream</h3>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">Live Transactions</p>
                                </div>
                            </div>
                            <Link href="/admin/payments" className="text-[11px] font-bold text-sky-700 hover:text-sky-500 uppercase tracking-widest transition-colors">Monitor All →</Link>
                        </div>
                        <div className="flex-1 divide-y divide-slate-100">
                            {recentPayments.length === 0 ? (
                                <div className="py-20 text-center text-slate-400 italic text-sm">No recent financial activity detected.</div>
                            ) : recentPayments.map((p) => (
                                <div key={p.id} className="group flex items-center justify-between px-7 py-4 hover:bg-slate-50/70 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-[11px] font-bold text-sky-700">
                                            {p.customer.full_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 group-hover:text-sky-700 transition-colors tracking-tight">{p.customer.full_name}</p>
                                            <p className="text-[11px] text-slate-400 font-medium">@{p.customer.meter_number} · {p.method}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        <p className="text-sm font-bold text-slate-900 tracking-tight">₱{parseFloat(p.bill.amount).toFixed(2)}</p>
                                        <span className={`text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border ${p.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                            p.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                'bg-rose-50 text-rose-700 border-rose-200'
                                            }`}>
                                            {p.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Billing Monitor */}
                    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between px-7 py-6 border-b border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center">
                                    <PieChart className="h-5 w-5 text-sky-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 tracking-tight">Billing Cycles</h3>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">Latest Statements</p>
                                </div>
                            </div>
                            <Link href="/admin/bills" className="text-[11px] font-bold text-sky-700 hover:text-sky-500 uppercase tracking-widest transition-colors">Archive View →</Link>
                        </div>
                        <div className="flex-1 divide-y divide-slate-100">
                            {recentBills.length === 0 ? (
                                <div className="py-20 text-center text-slate-400 italic text-sm">No billing records found for this period.</div>
                            ) : recentBills.map((b) => (
                                <div key={b.id} className="group flex items-center justify-between px-7 py-4 hover:bg-slate-50/70 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                                            <FileText className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 group-hover:text-sky-700 transition-colors tracking-tight">{b.customer.full_name}</p>
                                            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">@{b.customer.meter_number} · {new Date(b.billing_date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1.5">
                                        <p className="text-sm font-bold text-slate-900 tracking-tight">₱{parseFloat(b.amount).toFixed(2)}</p>
                                        <span className={`text-[9px] font-bold uppercase tracking-[0.15em] px-2.5 py-1 rounded-full border ${b.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                            b.status === 'unpaid' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                                                'bg-rose-50 text-rose-700 border-rose-200'
                                            }`}>{b.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── System Actions ── */}
                <div className="bg-white border border-slate-200 rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-[0.15em]">Admin Shortcuts</h3>
                            <p className="text-[11px] text-slate-400 font-medium mt-1">Management overrides and system tools</p>
                        </div>
                        <div className="h-px flex-1 bg-slate-200 mx-8" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        <Link href="/admin/users/create" className="group flex flex-col items-center gap-4 p-6 rounded-2xl border border-slate-200 bg-white hover:border-sky-200 hover:shadow-[0_8px_32px_rgba(14,165,233,0.10)] transition-all duration-200">
                            <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center group-hover:bg-sky-700 transition-all duration-200 group-hover:scale-110">
                                <Users className="w-6 h-6 text-sky-600 group-hover:text-white" />
                            </div>
                            <span className="text-[13px] font-semibold text-slate-600 group-hover:text-sky-700">Add User</span>
                        </Link>
                        <Link href="/admin/bills/generate" className="group flex flex-col items-center gap-4 p-6 rounded-2xl border border-slate-200 bg-white hover:border-sky-200 hover:shadow-[0_8px_32px_rgba(14,165,233,0.10)] transition-all duration-200">
                            <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center group-hover:bg-sky-700 transition-all duration-200 group-hover:scale-110">
                                <FileText className="w-6 h-6 text-sky-600 group-hover:text-white" />
                            </div>
                            <span className="text-[13px] font-semibold text-slate-600 group-hover:text-sky-700">Batch Billing</span>
                        </Link>
                        <Link href="/admin/payments" className="group flex flex-col items-center gap-4 p-6 rounded-2xl border border-slate-200 bg-white hover:border-sky-200 hover:shadow-[0_8px_32px_rgba(14,165,233,0.10)] transition-all duration-200">
                            <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center group-hover:bg-sky-700 transition-all duration-200 group-hover:scale-110">
                                <CreditCard className="w-6 h-6 text-sky-600 group-hover:text-white" />
                            </div>
                            <span className="text-[13px] font-semibold text-slate-600 group-hover:text-sky-700">Audit Ledger</span>
                        </Link>
                        <Link href="/admin/reports" className="group flex flex-col items-center gap-4 p-6 rounded-2xl border border-slate-200 bg-white hover:border-sky-200 hover:shadow-[0_8px_32px_rgba(14,165,233,0.10)] transition-all duration-200">
                            <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center group-hover:bg-sky-700 transition-all duration-200 group-hover:scale-110">
                                <TrendingUp className="w-6 h-6 text-sky-600 group-hover:text-white" />
                            </div>
                            <span className="text-[13px] font-semibold text-slate-600 group-hover:text-sky-700">Analytics</span>
                        </Link>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}