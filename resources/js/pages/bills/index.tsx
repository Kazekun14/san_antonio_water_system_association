import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FileText, ExternalLink, Calendar, Droplets, ArrowRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Bills', href: '/bills' },
];

interface Bill {
    id: number;
    billing_date: string;
    consumption: string;
    amount: string;
    status: string;
    due_date: string;
}

export default function BillsIndex({ bills }: { bills: Bill[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="My Bills" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Lora:ital@1&display=swap');
                .bills-root { font-family: 'DM Sans', sans-serif; -webkit-font-smoothing: antialiased; }
                .font-lora { font-family: 'Lora', serif; }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .fade-in { animation: fadeUp 0.5s ease both; }
            `}</style>
            
            <div className="bills-root flex h-full flex-1 flex-col gap-8 p-6 lg:p-8 bg-slate-50/50 dark:bg-neutral-950 rounded-xl">
                
                {/* Header Section */}
                <div className="fade-in flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-sky-600 flex items-center justify-center shadow-lg shadow-sky-600/20">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-[0.2em] leading-none">
                                Financial Center
                            </p>
                        </div>
                        <h1 className="text-4xl font-light text-slate-900 dark:text-neutral-100 tracking-tight leading-tight">
                            Your billing{' '}
                            <span className="font-lora italic text-sky-700 dark:text-sky-400 font-normal">archive</span>
                        </h1>
                        <p className="text-sm text-slate-400 dark:text-neutral-500 mt-2 font-light">
                            Review and manage all your water consumption statements and payments in one place.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="bg-white dark:bg-neutral-900 px-5 py-3 rounded-2xl border border-slate-100 dark:border-neutral-800 shadow-sm">
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Total Records</p>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{bills.length}</p>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="fade-in delay-100 overflow-hidden rounded-[24px] border border-slate-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-neutral-950/50 border-b border-slate-100 dark:border-neutral-800">
                                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">Billing Period</th>
                                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">Usage</th>
                                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">Amount</th>
                                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 dark:text-neutral-500 uppercase tracking-widest text-right">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                                {bills.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-neutral-800 flex items-center justify-center">
                                                    <FileText className="w-6 h-6 text-slate-300" />
                                                </div>
                                                <p className="text-slate-400 font-medium italic">No billing records found for your account.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    bills.map((bill) => (
                                        <tr key={bill.id} className="group transition-all hover:bg-slate-50/50 dark:hover:bg-neutral-800/30">
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-bold text-slate-900 dark:text-neutral-100">{new Date(bill.billing_date).toLocaleDateString('en-PH', { month: 'long', year: 'numeric' })}</span>
                                                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 uppercase tracking-wide">
                                                        <Calendar className="w-3 h-3" />
                                                        Due {new Date(bill.due_date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-900/30 flex items-center justify-center">
                                                        <Droplets className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                                                    </div>
                                                    <span className="text-slate-700 dark:text-neutral-300 font-medium">{bill.consumption} m³</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="text-lg font-bold text-slate-900 dark:text-neutral-100 tracking-tight">₱{parseFloat(bill.amount).toFixed(2)}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
                                                    bill.status === 'paid' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                                    bill.status === 'unpaid' ? 'bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400' :
                                                    'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                                        bill.status === 'paid' ? 'bg-emerald-500' :
                                                        bill.status === 'unpaid' ? 'bg-sky-500' : 'bg-rose-500'
                                                    }`} />
                                                    {bill.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <Link 
                                                    href={route('bills.show', bill.id)}
                                                    className="inline-flex items-center justify-center gap-2 w-10 h-10 rounded-xl bg-slate-50 dark:bg-neutral-800 text-slate-400 hover:bg-sky-600 hover:text-white dark:hover:bg-sky-600 transition-all duration-300"
                                                >
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-auto pt-6 flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                    <span>Official records of Barangay San Antonio Water Billing System.</span>
                </div>
            </div>
        </AppLayout>
    );
}
