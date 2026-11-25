import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { CreditCard, CheckCircle2, XCircle, Clock, User, FileText, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Payment {
    id: number;
    customer: {
        full_name: string;
        meter_number?: string;
    };
    bill: {
        id: number;
        billing_date: string;
    };
    payment_method: string;
    amount: string;
    status: string;
    reference_number?: string;
    transaction_id?: string;
    created_at: string;
}

interface PageProps extends InertiaPageProps {
    cashPayments: Payment[];
    allPayments: {
        data: Payment[];
        links: any;
    };
    flash: {
        success?: string;
        error?: string;
    };
    [key: string]: any;
}

export default function AdminPayments() {
    const { cashPayments, allPayments, flash } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState('');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin/dashboard' },
        { title: 'Payments', href: '/admin/payments' },
    ];

    const { post, processing } = useForm();

    const handleConfirm = (id: number) => {
        if (confirm('Are you sure you want to confirm this cash payment?')) {
            post(route('admin.payments.confirm-cash', id));
        }
    };

    const handleReject = (id: number) => {
        if (confirm('Are you sure you want to reject this cash payment?')) {
            post(route('admin.payments.reject-cash', id));
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'paid':
                return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">PAID</span>;
            case 'pending':
                return <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">PENDING</span>;
            case 'pending_cash':
                return <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">PENDING CASH</span>;
            case 'failed':
                return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">FAILED</span>;
            default:
                return <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-400">{status.toUpperCase()}</span>;
        }
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs} title="Payment Management">
            <Head title="Payment Management" />
            
            <div className="space-y-8">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                            <CreditCard className="h-6 w-6 text-sky-700" /> Payment Management
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">Manage and verify resident payments & cash collections.</p>
                    </div>
                </div>

                {flash?.success && (
                    <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200 text-emerald-800 flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span className="text-sm font-semibold">{flash.success}</span>
                    </div>
                )}

                {/* Pending Cash Payments */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sky-700">
                        <Clock className="w-5 h-5" />
                        <h2 className="text-lg font-bold text-slate-900">Pending Cash Payments</h2>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {cashPayments.length === 0 ? (
                            <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center shadow-sm">
                                <p className="text-slate-400 font-medium">No pending cash payments found.</p>
                            </div>
                        ) : (
                            cashPayments.map((payment) => (
                                <div key={payment.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md">
                                    <div className="p-5 border-b border-slate-100 flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-xl bg-sky-50 p-2.5 border border-sky-100">
                                                <User className="w-5 h-5 text-sky-700" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900">{payment.customer.full_name}</p>
                                                <p className="text-xs text-sky-700 font-mono">@{payment.customer.meter_number}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-slate-900">₱{parseFloat(payment.amount).toFixed(2)}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Ref: {payment.reference_number || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-slate-50/70 space-y-3">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500 font-medium">Bill Date:</span>
                                            <span className="font-semibold text-slate-700">
                                                {new Date(payment.bill.billing_date).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500 font-medium">Submitted:</span>
                                            <span className="font-semibold text-slate-700">
                                                {new Date(payment.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <button 
                                                onClick={() => handleConfirm(payment.id)} 
                                                disabled={processing}
                                                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                Confirm
                                            </button>
                                            <button 
                                                onClick={() => handleReject(payment.id)} 
                                                disabled={processing}
                                                className="flex-1 text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* All Transactions Table */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-900">
                            <FileText className="w-5 h-5 text-sky-700" />
                            <h2 className="text-lg font-bold">Transaction History</h2>
                        </div>
                        
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search meter or ref..."
                                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs font-medium text-slate-900 outline-none transition-all focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Resident</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Method</th>
                                    <th className="px-6 py-4">Reference/ID</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {allPayments.data.length === 0 ? (
                                    <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-400">No payment transactions found.</td></tr>
                                ) : (
                                    allPayments.data.map((payment) => (
                                        <tr key={payment.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{payment.customer.full_name}</div>
                                                <div className="text-xs text-sky-700 font-mono">@{payment.customer.meter_number}</div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-900">
                                                ₱{parseFloat(payment.amount).toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="capitalize text-slate-700 font-medium">{payment.payment_method}</span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                                {payment.reference_number || payment.transaction_id || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {payment.status === 'paid' ? (
                                                    <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">PAID</span>
                                                ) : payment.status === 'pending' ? (
                                                    <span className="inline-flex items-center rounded-full bg-amber-50 text-amber-700 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-amber-200">PENDING</span>
                                                ) : payment.status === 'pending_cash' ? (
                                                    <span className="inline-flex items-center rounded-full bg-sky-50 text-sky-700 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-sky-200">PENDING CASH</span>
                                                ) : payment.status === 'failed' ? (
                                                    <span className="inline-flex items-center rounded-full bg-rose-50 text-rose-700 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-rose-200">FAILED</span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-slate-200">{payment.status}</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 text-xs">
                                                {new Date(payment.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
