import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';
import { BarChart3, TrendingUp, DollarSign, FileText, CreditCard, Users } from 'lucide-react';

interface Stats {
    totalRevenue: number;
    totalUnpaid: number;
    paidBillsCount: number;
    unpaidBillsCount: number;
    totalCustomers: number;
    paidPayments: number;
    pendingPayments: number;
}

interface MonthlyData { month: string; total: number; }
interface MonthlyBills { month: string; count: number; }

export default function ReportsIndex({
    stats,
    monthlyRevenue,
    monthlyBills,
}: {
    stats: Stats;
    monthlyRevenue: MonthlyData[];
    monthlyBills: MonthlyBills[];
}) {
    const total = stats.paidBillsCount + stats.unpaidBillsCount;
    const paidPct = total > 0 ? Math.round((stats.paidBillsCount / total) * 100) : 0;
    const unpaidPct = 100 - paidPct;

    const maxRevenue = Math.max(...monthlyRevenue.map((m) => m.total), 1);

    const formatMonth = (m: string) => {
        const [y, mo] = m.split('-');
        return new Date(parseInt(y), parseInt(mo) - 1).toLocaleString('default', { month: 'short', year: '2-digit' });
    };

    return (
        <AdminLayout title="Reports">
            <Head title="Reports" />

            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-sky-700" /> Financial Reports
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Overview of billing and payment performance.</p>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                        { label: 'Total Revenue', value: `₱${parseFloat(stats.totalRevenue as any).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`, icon: DollarSign, color: 'emerald' },
                        { label: 'Total Unpaid', value: `₱${parseFloat(stats.totalUnpaid as any).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: 'rose' },
                        { label: 'Paid Bills', value: stats.paidBillsCount, icon: FileText, color: 'sky' },
                        { label: 'Total Customers', value: stats.totalCustomers, icon: Users, color: 'indigo' },
                    ].map((card) => {
                        const Icon = card.icon;
                        const colors: Record<string, string> = {
                            emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                            rose:    'bg-rose-50 text-rose-700 border-rose-200',
                            sky:     'bg-sky-50 text-sky-700 border-sky-200',
                            indigo:  'bg-indigo-50 text-indigo-700 border-indigo-200',
                        };
                        const iconBg: Record<string, string> = {
                            emerald: 'bg-emerald-100 text-emerald-700',
                            rose:    'bg-rose-100 text-rose-700',
                            sky:     'bg-sky-100 text-sky-700',
                            indigo:  'bg-indigo-100 text-indigo-700',
                        };
                        return (
                            <div key={card.label} className={`rounded-2xl border p-5 bg-white shadow-sm ${colors[card.color]}`}>
                                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${iconBg[card.color]} mb-3`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.label}</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Paid vs Unpaid breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-sky-700" /> Bills Breakdown
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1.5 font-medium">
                                    <span className="text-slate-600">Paid</span>
                                    <span className="text-emerald-700 font-bold">{stats.paidBillsCount} ({paidPct}%)</span>
                                </div>
                                <div className="h-2.5 rounded-full bg-slate-100">
                                    <div className="h-2.5 rounded-full bg-emerald-500 transition-all" style={{ width: `${paidPct}%` }} />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1.5 font-medium">
                                    <span className="text-slate-600">Unpaid / Overdue</span>
                                    <span className="text-rose-700 font-bold">{stats.unpaidBillsCount} ({unpaidPct}%)</span>
                                </div>
                                <div className="h-2.5 rounded-full bg-slate-100">
                                    <div className="h-2.5 rounded-full bg-rose-500 transition-all" style={{ width: `${unpaidPct}%` }} />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-4 text-center text-sm">
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                <p className="text-xs font-semibold text-slate-500">Paid Payments</p>
                                <p className="text-xl font-bold text-slate-900 mt-0.5">{stats.paidPayments}</p>
                            </div>
                            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                                <p className="text-xs font-semibold text-amber-700">Pending Payments</p>
                                <p className="text-xl font-bold text-amber-800 mt-0.5">{stats.pendingPayments}</p>
                            </div>
                        </div>
                    </div>

                    {/* Monthly revenue chart */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-sky-700" /> Monthly Revenue (Last 12 Months)
                        </h3>
                        {monthlyRevenue.length === 0 ? (
                            <p className="text-slate-400 text-sm">No revenue data available yet.</p>
                        ) : (
                            <div className="flex items-end gap-2 h-44 pt-4">
                                {monthlyRevenue.map((m) => {
                                    const height = Math.max((m.total / maxRevenue) * 100, 4);
                                    return (
                                        <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                                            <div
                                                className="w-full rounded-t bg-sky-700 hover:bg-sky-600 transition-colors cursor-default"
                                                style={{ height: `${height}%` }}
                                                title={`₱${parseFloat(m.total as any).toFixed(2)}`}
                                            />
                                            <span className="text-[10px] font-bold text-slate-400 rotate-45 origin-left whitespace-nowrap mt-2">
                                                {formatMonth(m.month)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
