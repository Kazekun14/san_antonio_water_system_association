import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CreditCard, Hash, Calendar, ArrowRightLeft, CheckCircle2, Clock, AlertCircle, Receipt, ArrowRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Payment History', href: '/payments' },
];

interface Bill {
    id: number;
    amount: string;
    billing_date: string;
}

interface Payment {
    id: number;
    payment_method: string;
    status: string;
    reference_number: string | null;
    transaction_id: string | null;
    amount: string;
    created_at: string;
    bill: Bill;
}

export default function PaymentsIndex({ payments, balance }: { payments: Payment[]; balance: number }) {
    const getStatusBadge = (status: string) => {
        const baseCls = "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm";
        switch (status) {
            case 'paid':
                return (
                    <span className={`${baseCls} bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400`}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Success
                    </span>
                );
            case 'pending':
            case 'processing':
                return (
                    <span className={`${baseCls} bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400`}>
                        <Clock className="w-3.5 h-3.5" /> Processing
                    </span>
                );
            case 'pending_cash':
                return (
                    <span className={`${baseCls} bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400`}>
                        <Hash className="w-3.5 h-3.5" /> Pending Cash
                    </span>
                );
            case 'failed':
                return (
                    <span className={`${baseCls} bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400`}>
                        <AlertCircle className="w-3.5 h-3.5" /> Failed
                    </span>
                );
            default:
                return <span className={`${baseCls} bg-slate-100 text-slate-600 dark:bg-neutral-800 dark:text-neutral-400`}>{status}</span>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payment History" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Lora:ital@1&display=swap');
                .payments-root { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
                .font-lora { font-family: 'Lora', serif; }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fade-in { animation: fadeUp 0.5s ease both; }
            `}</style>
            
            <div className="payments-root flex h-full flex-1 flex-col gap-8 p-6 lg:p-8 bg-slate-50/50 dark:bg-neutral-950 rounded-xl">
                
                {/* Header Section */}
                <div className="fade-in flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                                <ArrowRightLeft className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] leading-none">
                                Ledger History
                            </p>
                        </div>
                        <h1 className="text-4xl font-light text-slate-900 dark:text-neutral-100 tracking-tight leading-tight">
                            Your transaction{' '}
                            <span className="font-lora italic text-indigo-700 dark:text-indigo-400 font-normal">log</span>
                        </h1>
                        <p className="text-sm text-slate-400 dark:text-neutral-500 mt-2 font-light">
                            A comprehensive record of all your payments, including online transactions and over-the-counter payments.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-white dark:bg-neutral-900 px-6 py-4 rounded-3xl border border-slate-100 dark:border-neutral-800 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Current Balance</p>
                            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight">
                                ₱{parseFloat(balance.toString()).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="fade-in delay-100 overflow-hidden rounded-[24px] border border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-neutral-950/50 border-b border-slate-100 dark:border-neutral-800">
                                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">Transaction Ref</th>
                                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">For Statement</th>
                                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">Method</th>
                                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">Amount Paid</th>
                                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                                {payments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-neutral-800 flex items-center justify-center">
                                                    <CreditCard className="w-6 h-6 text-slate-300" />
                                                </div>
                                                <p className="text-slate-400 font-medium italic">No payment history found. Start by settling your bills.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((payment) => (
                                        <tr key={payment.id} className="group transition-all hover:bg-slate-50/50 dark:hover:bg-neutral-800/30">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                                                        <Hash className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-white uppercase">
                                                            {payment.reference_number || (payment.transaction_id ? payment.transaction_id.substring(0, 15) : '-')}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-medium">Ref Number</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-slate-700 dark:text-neutral-200">Bill #{payment.bill.id}</span>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase tracking-wide">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(payment.bill.billing_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-neutral-800 flex items-center justify-center">
                                                        <CreditCard className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                    <span className="text-slate-600 dark:text-neutral-400 font-medium capitalize">{payment.payment_method}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-lg font-bold text-slate-900 dark:text-neutral-100 tracking-tight">₱{parseFloat(payment.amount).toFixed(2)}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                {getStatusBadge(payment.status)}
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col text-right md:text-left">
                                                    <span className="text-[13px] font-medium text-slate-700 dark:text-neutral-300">
                                                        {new Date(payment.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400 font-medium">
                                                        {new Date(payment.created_at).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Info Note */}
                <div className="mt-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        <span>All timestamps are in PHT (Philippine Time).</span>
                    </div>
                    <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Data Active</span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
