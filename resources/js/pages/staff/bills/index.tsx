import StaffLayout from '@/layouts/staff-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { FileText, Search, Plus, Printer, CheckCircle } from 'lucide-react';
import { useState, FormEvent } from 'react';

interface Bill {
    id: number;
    billing_date: string;
    due_date: string;
    consumption: string;
    amount: string;
    status: string;
    customer: { full_name: string; meter_number: string };
    payments?: { id: number; status: string }[];
}

interface PaginatedBills {
    data: Bill[];
    from: number; to: number; total: number; last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export default function StaffBillsIndex({ bills, filters }: { bills: PaginatedBills; filters: any }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const { data, setData, post, processing } = useForm({
        bill_id: '',
    });

    const applyFilters = (e: FormEvent) => {
        e.preventDefault();
        router.get('/staff/bills', { search, status }, { preserveState: true });
    };

    const recordCashPayment = (billId: number) => {
        if (confirm('Record cash payment for this bill? It will be marked as PAID immediately.')) {
            router.post('/staff/payments/cash', { bill_id: billId });
        }
    };

    const statusBadge = (s: string) => ({
        paid:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        unpaid:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
        overdue: 'bg-red-500/10 text-red-400 border-red-500/20',
    }[s] || '');

    return (
        <StaffLayout title="Billing Operations">
            <Head title="Bills" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <FileText className="h-6 w-6 text-teal-400" /> Billing Management
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">{bills.total} total bills found</p>
                    </div>
                </div>

                <form onSubmit={applyFilters} className="flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input type="text" placeholder="Search customer or meter..."
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 pl-9 pr-4 py-2 text-sm text-white focus:border-teal-500 focus:outline-none" />
                    </div>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none">
                        <option value="">All Status</option>
                        <option value="unpaid">Unpaid</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                    </select>
                    <button type="submit" className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white hover:bg-slate-600 transition-colors">
                        Filter
                    </button>
                </form>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-800/50 text-xs uppercase text-slate-400">
                                <tr>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Billing Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {bills.data.length === 0 ? (
                                    <tr><td colSpan={5} className="px-6 py-10 text-center text-slate-500">No bills found.</td></tr>
                                ) : bills.data.map((bill) => (
                                    <tr key={bill.id} className="hover:bg-slate-800/40 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-white">{bill.customer.full_name}</p>
                                            <p className="text-xs text-blue-400 font-mono">@{bill.customer.meter_number}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-white text-xs">{new Date(bill.billing_date).toLocaleDateString()}</p>
                                            <p className="text-[10px] text-slate-500">Due: {new Date(bill.due_date).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-white">₱{parseFloat(bill.amount).toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border capitalize ${statusBadge(bill.status)}`}>
                                                {bill.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            {bill.status !== 'paid' ? (
                                                <button
                                                    onClick={() => recordCashPayment(bill.id)}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-teal-700 transition-colors"
                                                >
                                                    <CheckCircle className="h-3 w-3" /> Record Cash
                                                </button>
                                            ) : (
                                                <Link
                                                    href={bill.payments && bill.payments.length > 0 ? `/staff/receipts/${bill.payments[0].id}` : '#'}
                                                    className="text-slate-500 hover:text-white transition-colors" title="Print Receipt">
                                                    <Printer className="h-4 w-4" />
                                                </Link>
                                            )}
                                            <Link
                                                href={`/staff/bills/${bill.id}`}
                                                className="text-teal-500 hover:text-teal-400 transition-colors" title="Print Bill Statement">
                                                <FileText className="h-4 w-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {bills.last_page > 1 && (
                         <div className="flex justify-center p-4 border-t border-slate-800">
                            <div className="flex gap-1">
                                {bills.links.map((link, i) => (
                                    <Link key={i} href={link.url || '#'}
                                        className={`px-3 py-1 text-xs rounded ${link.active ? 'bg-teal-600 text-white' : 'text-slate-500 hover:text-white border border-slate-700'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </StaffLayout>
    );
}
