import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, ArrowRight, CheckCircle2, Clock, CreditCard, Droplets, FileText, History, Zap } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Bill {
    id: number;
    amount: string;
    due_date: string;
    status: string;
}

interface Payment {
    id: number;
    amount: string;
    created_at: string;
    method: string;
    status: string;
}

interface Props {
    currentBill: Bill | null;
    totalUnpaidAmount: string;
    totalUnpaidBills: number;
    lastPayment: Payment | null;
}

// ─── Breadcrumbs ──────────────────────────────────────────────────────────────

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Dashboard({ currentBill, totalUnpaidAmount, totalUnpaidBills, lastPayment }: Props) {
    const unpaid = parseFloat(totalUnpaidAmount);
    const hasUnpaid = unpaid > 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            {/* Google Fonts — DM Sans + Lora */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Lora:ital@1&display=swap');
                .dash-root { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
                .font-lora { font-family: 'Lora', serif; }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fade-in-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
                .delay-1 { animation-delay: 0.1s; }
                .delay-2 { animation-delay: 0.2s; }
                .delay-3 { animation-delay: 0.3s; }
            `}</style>

            <div className="dash-root flex flex-col flex-1 gap-8 p-6 lg:p-10 bg-slate-50 dark:bg-[#0a0a0a] min-h-[calc(100vh-80px)]">

                {/* ── Page header ── */}
                <div className="fade-in-up flex items-end justify-between gap-6 flex-wrap">
                    <div className="flex-1 min-w-[300px]">

                        <h1 className="text-4xl lg:text-5xl font-light text-slate-900 dark:text-white tracking-tight leading-none">
                            Welcome back,<br />
                            <span className="font-lora italic text-sky-700 dark:text-sky-400 font-normal">
                                customer
                            </span>
                        </h1>
                    </div>

                    {/* Quick Stats Overlay */}
                    <div className="flex items-center gap-4 bg-white dark:bg-neutral-900 p-2 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm">
                        <div className="px-5 py-2 border-r border-slate-200 dark:border-neutral-800">
                            <p className="text-[10px] text-slate-500 dark:text-neutral-400 uppercase font-bold tracking-wider mb-0.5">Outstanding Balance</p>
                            <p className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">₱{unpaid.toFixed(2)}</p>
                        </div>
                        <div className="px-3 py-1 flex items-center gap-2">
                            {currentBill && (
                                <Link
                                    href={route('bills.show', currentBill.id)}
                                    className="bg-sky-700 hover:bg-sky-800 text-white text-[13px] font-bold px-5 py-2.5 rounded-xl transition-all"
                                >
                                    Quick Pay
                                </Link>
                            )}
                            <Link
                                href={route('bills.index')}
                                className="p-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors text-slate-500"
                            >
                                <History className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── Alert banner — overdue ── */}
                {hasUnpaid && (
                    <div className="fade-in-up delay-1 flex items-center gap-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl p-5">
                        <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center shrink-0">
                            <AlertCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-rose-900 dark:text-rose-200 font-bold tracking-tight">
                                Account Notification
                            </p>
                            <p className="text-[13px] text-rose-800/80 dark:text-rose-300/70 leading-relaxed mt-0.5">
                                You have <span className="font-bold text-rose-900 dark:text-rose-200">{totalUnpaidBills} unpaid bill{totalUnpaidBills > 1 ? 's' : ''}</span> pending. Please settle to avoid service interruption.
                            </p>
                        </div>
                        <Link
                            href={route('bills.index')}
                            className="text-[13px] font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors px-5 py-2.5 rounded-xl flex items-center gap-2"
                        >
                            Review Bills
                        </Link>
                    </div>
                )}

                {/* ── Stat cards ── */}
                <div className="fade-in-up delay-2 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {/* Current Bill */}
                    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 transition-all duration-200 hover:border-sky-200 hover:shadow-[0_8px_32px_rgba(14,165,233,0.05)]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center text-sky-600 dark:text-sky-400">
                                <FileText className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Current Statement</h3>
                        </div>
                        <p className="text-4xl font-bold text-slate-900 dark:text-neutral-100 tracking-tight mb-3">
                            ₱{currentBill ? parseFloat(currentBill.amount).toFixed(2) : '0.00'}
                        </p>
                        <div className="flex items-center gap-2 text-[13px] text-slate-500 mb-6">
                            {currentBill ? (
                                <>
                                    <Clock className="w-4 h-4 text-amber-500" />
                                    <span>Due by <span className="font-bold text-slate-700 dark:text-slate-300">{currentBill.due_date}</span></span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>No active bill for this month</span>
                                </>
                            )}
                        </div>
                        {currentBill ? (
                            <Link href={route('bills.show', currentBill.id)} className="inline-flex w-full justify-center items-center gap-2 text-sm font-bold bg-sky-50 hover:bg-sky-100 text-sky-700 py-3 rounded-xl transition-colors">
                                View Detailed Statement <ArrowRight className="w-4 h-4" />
                            </Link>
                        ) : (
                            <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-50 text-slate-400 text-sm font-medium border border-dashed border-slate-200">
                                All clear for now
                            </div>
                        )}
                    </div>

                    {/* Total Unpaid */}
                    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 transition-all duration-200 hover:border-rose-200 hover:shadow-[0_8px_32px_rgba(244,63,94,0.05)]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center text-rose-500 dark:text-rose-400">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Outstanding Balance</h3>
                        </div>
                        <p className="text-4xl font-bold text-slate-900 dark:text-neutral-100 tracking-tight mb-3">
                            ₱{unpaid.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 text-[13px] text-slate-500 mb-6">
                            {hasUnpaid ? (
                                <>
                                    <Zap className="w-4 h-4 text-rose-500" />
                                    <span>Total from <span className="font-bold text-slate-700">{totalUnpaidBills}</span> pending bill(s)</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4 text-slate-400" />
                                    <span>Your account is fully paid</span>
                                </>
                            )}
                        </div>
                        <Link href={route('bills.index')} className="inline-flex w-full justify-center items-center gap-2 text-sm font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 py-3 rounded-xl transition-colors">
                            View All Pending <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Last Payment */}
                    <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 transition-all duration-200 hover:border-emerald-200 hover:shadow-[0_8px_32px_rgba(16,185,129,0.05)]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                <CreditCard className="w-5 h-5" />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Last Transaction</h3>
                        </div>
                        <p className="text-4xl font-bold text-slate-900 dark:text-neutral-100 tracking-tight mb-3">
                            {lastPayment ? `₱${parseFloat(lastPayment.amount).toFixed(2)}` : 'None'}
                        </p>
                        <div className="flex items-center gap-2 text-[13px] text-slate-500 mb-6">
                            {lastPayment ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span>Paid via <span className="font-bold text-slate-700">{lastPayment.method}</span></span>
                                </>
                            ) : (
                                <>
                                    <Clock className="w-4 h-4 text-slate-400" />
                                    <span>No recent activity detected</span>
                                </>
                            )}
                        </div>
                        <Link href={route('payments.index')} className="inline-flex w-full justify-center items-center gap-2 text-sm font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 py-3 rounded-xl transition-colors border border-slate-200">
                            Transaction History <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* ── Quick Links ── */}
                <div className="fade-in-up delay-3 mt-4">
                    <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                        Portal Navigation
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Link href={route('bills.index')} className="group flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 transition-all hover:border-sky-200 hover:shadow-[0_4px_20px_rgba(14,165,233,0.05)]">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-sky-50 transition-colors">
                                <FileText className="w-5 h-5 text-slate-500 group-hover:text-sky-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900">Billing Archive</p>
                                <p className="text-[13px] text-slate-500">Access your complete history of water statements</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
                        </Link>
                        <Link href={route('payments.index')} className="group flex items-center gap-4 bg-white border border-slate-200 rounded-2xl p-4 transition-all hover:border-sky-200 hover:shadow-[0_4px_20px_rgba(14,165,233,0.05)]">
                            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-sky-50 transition-colors">
                                <CreditCard className="w-5 h-5 text-slate-500 group-hover:text-sky-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900">Payment Logs</p>
                                <p className="text-[13px] text-slate-500">Track your payments, receipts, and status</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
                        </Link>
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="mt-auto pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-slate-500 font-medium">
                    <div className="flex items-center gap-2">
                        <span>Barangay San Antonio Water Billing System</span>
                    </div>
                    <span>Siquijor, PH</span>
                </div>

            </div>
        </AppLayout>
    );
}