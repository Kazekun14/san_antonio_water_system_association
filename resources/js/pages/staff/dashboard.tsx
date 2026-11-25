import StaffLayout from '@/layouts/staff-layout';
import { Head, Link } from '@inertiajs/react';
import { Users, Gauge, FileText, CreditCard, AlertCircle, Clock, CheckCircle, Plus, ArrowRight, Zap, TrendingUp, Search } from 'lucide-react';

interface Stats {
    totalCustomers: number;
    todayReadings: number;
    pendingPayments: number;
    unpaidBills: number;
}

interface Reading {
    id: number;
    meter_reading: string;
    reading_date: string;
    customer: { full_name: string; meter_number: string };
}

interface Payment {
    id: number;
    status: string;
    created_at: string;
    customer: { full_name: string; meter_number: string };
    bill: { amount: string };
}

export default function StaffDashboard({
    stats,
    recentReadings,
    pendingPaymentsList,
}: {
    stats: Stats;
    recentReadings: Reading[];
    pendingPaymentsList: Payment[];
}) {
    const statCards = [
        { label: 'Active Customers', value: stats.totalCustomers, icon: Users, color: 'blue', href: '/staff/customers', desc: 'Managed households' },
        { label: 'Meter Readings', value: stats.todayReadings, icon: Gauge, color: 'teal', href: '/staff/meter-readings', desc: 'Recorded today' },
        { label: 'Pending Verification', value: stats.pendingPayments, icon: Clock, color: 'amber', href: '/staff/payments?status=pending', desc: 'In processing queue' },
        { label: 'Unpaid Statements', value: stats.unpaidBills, icon: AlertCircle, color: 'rose', href: '/staff/bills?status=unpaid', desc: 'Overdue accounts' },
    ];

    const colors: Record<string, { border: string, text: string, bg: string, icon: string, shadow: string }> = {
        blue: { border: 'border-blue-500/20', text: 'text-blue-400', bg: 'bg-blue-500/5', icon: 'bg-blue-500', shadow: 'shadow-blue-500/10' },
        teal: { border: 'border-teal-500/20', text: 'text-teal-400', bg: 'bg-teal-500/5', icon: 'bg-teal-500', shadow: 'shadow-teal-500/10' },
        amber: { border: 'border-amber-500/20', text: 'text-amber-400', bg: 'bg-amber-500/5', icon: 'bg-amber-500', shadow: 'shadow-amber-500/10' },
        rose: { border: 'border-rose-500/20', text: 'text-rose-400', bg: 'bg-rose-500/5', icon: 'bg-rose-500', shadow: 'shadow-rose-500/10' },
    };

    return (
        <StaffLayout title="Dashboard">
            <Head title="Staff Dashboard" />

            <div className="space-y-10 pb-10">
                {/* ── Welcome Banner ── */}
                <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-900 to-[#020617] border border-slate-800/50 p-8 lg:p-10">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <TrendingUp className="w-40 h-40 text-teal-500" />
                    </div>
                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                            <p className="text-[10px] font-bold text-teal-400 uppercase tracking-[0.2em]">System Status: Online</p>
                        </div>
                        <h2 className="text-4xl font-bold text-white tracking-tight leading-tight">
                            Ready for today's <span className="text-teal-400 italic">operations?</span>
                        </h2>
                        <p className="text-slate-400 mt-3 text-sm leading-relaxed font-medium">
                            Manage meter readings, process bill payments, and oversee customer accounts from your central command.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 mt-8">
                            <Link href="/staff/meter-readings/create" className="bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-6 py-3 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-teal-600/20">
                                Record New Reading
                            </Link>
                            <Link href="/staff/payments" className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-6 py-3 rounded-2xl transition-all border border-slate-700/50">
                                View Payment Queue
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── Stats Grid ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                    {statCards.map((card) => {
                        const Icon = card.icon;
                        const cls = colors[card.color];
                        return (
                            <Link
                                key={card.label}
                                href={card.href}
                                className={`group relative overflow-hidden rounded-3xl border bg-slate-950 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${cls.border} ${cls.shadow}`}
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                                    <Icon className="w-16 h-16" />
                                </div>

                                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${cls.bg} ${cls.text} mb-5 shadow-sm border ${cls.border}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{card.label}</p>
                                    <p className="text-3xl font-black text-white tracking-tighter">{card.value}</p>
                                    <p className="text-[11px] text-slate-500 font-medium">{card.desc}</p>
                                </div>

                                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors">
                                    Manage Records <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* ── Operations Sections ── */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Recent Readings */}
                    <div className="rounded-[32px] border border-slate-800/50 bg-[#020617] overflow-hidden flex flex-col shadow-sm">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800/50">
                            <div>
                                <h3 className="font-bold text-white flex items-center gap-2 tracking-tight">
                                    <Gauge className="h-4 w-4 text-teal-400" /> Recent Meter Activity
                                </h3>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">LATEST RECORDINGS</p>
                            </div>
                            <Link href="/staff/meter-readings/create" className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center hover:bg-teal-500 hover:text-white transition-all shadow-sm">
                                <Plus className="h-5 w-5" />
                            </Link>
                        </div>
                        <div className="flex-1 divide-y divide-slate-800/50">
                            {recentReadings.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center mb-4">
                                        <Gauge className="w-6 h-6 text-slate-700" />
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium">No recent readings to display.</p>
                                </div>
                            ) : recentReadings.map((r) => (
                                <div key={r.id} className="group flex items-center justify-between px-8 py-4 hover:bg-slate-900/40 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                            {r.customer.full_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors tracking-tight">{r.customer.full_name}</p>
                                            <p className="text-[11px] text-slate-500 font-medium">@{r.customer.meter_number} · {new Date(r.reading_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-black text-white font-mono">{r.meter_reading} <span className="text-[10px] text-slate-500 font-sans uppercase">m³</span></p>
                                        <p className="text-[10px] text-teal-500/70 font-bold uppercase tracking-widest mt-0.5">Recorded</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-slate-800/50 bg-slate-900/20 text-center">
                            <Link href="/staff/meter-readings" className="text-[11px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
                                View Full Log →
                            </Link>
                        </div>
                    </div>

                    {/* Pending Payments Queue */}
                    <div className="rounded-[32px] border border-slate-800/50 bg-[#020617] overflow-hidden flex flex-col shadow-sm">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-800/50">
                            <div>
                                <h3 className="font-bold text-white flex items-center gap-2 tracking-tight">
                                    <Clock className="h-4 w-4 text-amber-400" /> Payment Validation Queue
                                </h3>
                                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">PENDING VERIFICATION</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shadow-sm">
                                <Zap className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="flex-1 divide-y divide-slate-800/50">
                            {pendingPaymentsList.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center mb-4">
                                        <CheckCircle className="w-6 h-6 text-emerald-500/50" />
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium italic">Your queue is empty. Great job!</p>
                                </div>
                            ) : pendingPaymentsList.map((p) => (
                                <div key={p.id} className="group flex items-center justify-between px-8 py-4 hover:bg-slate-900/40 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 text-amber-500/50" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors tracking-tight">{p.customer.full_name}</p>
                                            <p className="text-[11px] text-slate-500 font-medium uppercase tracking-tighter">Submitted {new Date(p.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-black text-white tracking-tighter">₱{parseFloat(p.bill.amount).toFixed(2)}</p>
                                        <Link href={`/staff/payments?status=pending`} className="text-[10px] font-bold text-amber-500 hover:underline uppercase tracking-widest mt-1">Review Now →</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-slate-800/50 bg-slate-900/20 text-center">
                            <Link href="/staff/payments?status=pending" className="text-[11px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
                                Open Process Queue →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── Action Grid ── */}
                <div className="bg-slate-900/40 border border-slate-800/50 rounded-[32px] p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-sm font-bold text-white uppercase tracking-[0.1em]">Quick Actions</h3>
                            <p className="text-[11px] text-slate-500 font-medium mt-1">Operational shortcuts for common tasks</p>
                        </div>
                        <div className="h-px flex-1 bg-slate-800 mx-6 opacity-50" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <QuickAction
                            href="/staff/meter-readings/create"
                            icon={Gauge}
                            label="New Reading"
                            color="teal"
                        />
                        <QuickAction
                            href="/staff/payments"
                            icon={CreditCard}
                            label="Accept Payment"
                            color="blue"
                        />
                        <QuickAction
                            href="/staff/bills"
                            icon={FileText}
                            label="Generate Bills"
                            color="amber"
                        />
                        <QuickAction
                            href="/staff/customers"
                            icon={Users}
                            label="Manage Clients"
                            color="indigo"
                        />
                    </div>
                </div>
            </div>
        </StaffLayout>
    );
}

function QuickAction({ href, icon: Icon, label, color }: { href: string, icon: any, label: string, color: string }) {
    const colors: Record<string, string> = {
        teal: 'text-teal-400 group-hover:bg-teal-500',
        blue: 'text-blue-400 group-hover:bg-blue-50',
        amber: 'text-amber-400 group-hover:bg-amber-500',
        indigo: 'text-indigo-400 group-hover:bg-indigo-500',
    };

    return (
        <Link href={href} className="group relative flex flex-col items-center gap-4 p-6 rounded-3xl border border-slate-800 bg-[#020617] hover:border-slate-600 hover:shadow-xl transition-all duration-300">
            <div className={`w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${colors[color]} group-hover:text-white`}>
                <Icon className="w-6 h-6" />
            </div>
            <span className="text-[13px] font-bold text-slate-400 group-hover:text-white transition-colors">{label}</span>
        </Link>
    );
}
