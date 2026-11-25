import StaffLayout from '@/layouts/staff-layout';
import { Head, Link, router } from '@inertiajs/react';
import { CreditCard, CheckCircle, XCircle, Search, Eye, Printer } from 'lucide-react';
import { useState, FormEvent } from 'react';

interface Payment {
    id: number;
    method: string;
    status: string;
    proof_image: string | null;
    created_at: string;
    customer: { full_name: string; meter_number: string };
    bill: { id: number; amount: string; billing_date: string };
}

interface PaginatedPayments {
    data: Payment[];
    from: number; to: number; total: number; last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export default function StaffPaymentsIndex({ payments, filters }: { payments: PaginatedPayments; filters: any }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [previewImg, setPreviewImg] = useState<string | null>(null);

    const applyFilters = (e: FormEvent) => {
        e.preventDefault();
        router.get('/staff/payments', { search, status }, { preserveState: true });
    };

    const verify = (payment: Payment, action: 'paid' | 'failed') => {
        if (confirm(`${action === 'paid' ? 'Confirm' : 'Mark as Failed'} this payment?`)) {
            router.patch(`/staff/payments/${payment.id}/verify`, { action });
        }
    };

    const statusBadge = (s: string) => ({
        paid: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        pending:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
        failed:  'bg-red-500/10 text-red-400 border-red-500/20',
        pending_cash: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    }[s] || '');

    return (
        <StaffLayout title="Payment Processing">
            <Head title="Payments" />

            {/* Image preview modal */}
            {previewImg && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setPreviewImg(null)}>
                    <img src={`/storage/${previewImg}`} alt="Proof" className="max-h-full max-w-full rounded-xl shadow-2xl" />
                </div>
            )}

            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <CreditCard className="h-6 w-6 text-teal-400" /> Payment Queue
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Review and verify customer payment submissions.</p>
                </div>

                <form onSubmit={applyFilters} className="flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <input type="text" placeholder="Search customer or meter..." value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 pl-9 pr-4 py-2 text-sm text-white focus:border-teal-500 focus:outline-none" />
                    </div>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none">
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="pending_cash">Pending Cash</option>
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
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Method</th>
                                    <th className="px-6 py-4 text-center">Proof</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {payments.data.length === 0 ? (
                                    <tr><td colSpan={6} className="px-6 py-10 text-center text-slate-500">No payments found.</td></tr>
                                ) : payments.data.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-white">{p.customer.full_name}</p>
                                            <p className="text-[10px] text-blue-400 font-mono tracking-tighter">@{p.customer.meter_number}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-white font-bold">₱{parseFloat(p.bill.amount).toFixed(2)}</p>
                                            <p className="text-[10px] text-slate-500">Bill ID: #{p.bill.id}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${
                                                p.method === 'cash' ? 'border-teal-500/30 text-teal-400 bg-teal-500/5' : 'border-blue-500/30 text-blue-400 bg-blue-500/5'
                                            }`}>
                                                {p.method}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {p.proof_image ? (
                                                <button onClick={() => setPreviewImg(p.proof_image)} className="text-teal-400 hover:text-white transition-colors" title="View Proof">
                                                    <Eye className="h-4 w-4 mx-auto" />
                                                </button>
                                            ) : <span className="text-[10px] text-slate-600">—</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border capitalize ${statusBadge(p.status)}`}>
                                                {p.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {p.status === 'pending' && (
                                                    <>
                                                        <button onClick={() => verify(p, 'paid')} className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all">
                                                            <CheckCircle className="h-3 w-3" />
                                                        </button>
                                                        <button onClick={() => verify(p, 'failed')} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
                                                            <XCircle className="h-3 w-3" />
                                                        </button>
                                                    </>
                                                )}
                                                {p.status === 'paid' && (
                                                    <Link href={`/staff/receipts/${p.id}`} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-all">
                                                        <Printer className="h-3 w-3" />
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {payments.last_page > 1 && (
                         <div className="flex justify-center p-4 border-t border-slate-800">
                            <div className="flex gap-1">
                                {payments.links.map((link, i) => (
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
