import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { FileText, Plus, Trash2, Search, Printer } from 'lucide-react';
import { useState, FormEvent } from 'react';

interface Bill {
    id: number;
    billing_date: string;
    due_date: string;
    consumption: string;
    amount: string;
    status: string;
    customer: { full_name: string; meter_number: string };
}

interface PaginatedBills {
    data: Bill[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export default function AdminBillsIndex({
    bills,
    filters,
}: {
    bills: PaginatedBills;
    filters: { status?: string; search?: string };
}) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const applyFilters = (e: FormEvent) => {
        e.preventDefault();
        router.get('/admin/bills', { search, status }, { preserveState: true });
    };

    const handleDelete = (bill: Bill) => {
        if (confirm(`Delete Bill #${bill.id}? This cannot be undone.`)) {
            router.delete(`/admin/bills/${bill.id}`);
        }
    };

    const statusBadge = (s: string) => ({
        paid:    'bg-emerald-500/10 text-emerald-400',
        unpaid:  'bg-blue-500/10 text-blue-400',
        overdue: 'bg-red-500/10 text-red-400',
    }[s] || 'bg-slate-500/10 text-slate-400');

    return (
        <AdminLayout title="Billing Management">
            <Head title="Bills" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <FileText className="h-6 w-6 text-sky-700" /> All Bills
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">{bills.total} total bills</p>
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <form onSubmit={applyFilters} className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input type="text" placeholder="Search customer or meter..."
                                value={search} onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all" />
                        </div>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}
                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all appearance-none cursor-pointer">
                            <option value="">All Status</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                        </select>
                        <button type="submit"
                            className="rounded-xl bg-sky-700 hover:bg-sky-600 px-5 py-2 text-sm font-bold text-white transition-colors shadow-sm">
                            Filter
                        </button>
                    </form>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Billing Date</th>
                                    <th className="px-6 py-4">Due Date</th>
                                    <th className="px-6 py-4">Consumption</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {bills.data.length === 0 ? (
                                    <tr><td colSpan={7} className="px-6 py-10 text-center text-slate-400">No bills found.</td></tr>
                                ) : bills.data.map((bill) => (
                                    <tr key={bill.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">{bill.customer.full_name}</p>
                                            <p className="text-xs text-sky-700 font-mono">@{bill.customer.meter_number}</p>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">{new Date(bill.billing_date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-slate-500">{new Date(bill.due_date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">{bill.consumption} m³</td>
                                        <td className="px-6 py-4 font-bold text-slate-900">₱{parseFloat(bill.amount).toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider border ${
                                                bill.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                                bill.status === 'unpaid' ? 'bg-sky-50 text-sky-700 border-sky-200' :
                                                'bg-rose-50 text-rose-700 border-rose-200'
                                            }`}>
                                                {bill.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <Link href={`/admin/bills/${bill.id}`}
                                                className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-100 transition-colors"
                                                title="Print Bill">
                                                <Printer className="h-3 w-3" /> Print
                                            </Link>
                                            <button onClick={() => handleDelete(bill)}
                                                className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors">
                                                <Trash2 className="h-3 w-3" /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {bills.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
                            <p className="text-xs font-medium text-slate-500">Showing {bills.from}–{bills.to} of {bills.total}</p>
                            <div className="flex gap-1">
                                {bills.links.map((link, i) => (
                                    link.url ? (
                                        <Link key={i} href={link.url}
                                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${link.active ? 'bg-sky-700 text-white' : 'text-slate-600 hover:bg-white hover:text-sky-700 border border-slate-200'}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ) : (
                                        <span key={i} className="rounded-lg px-3 py-1.5 text-xs text-slate-400" dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
