import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FileText, ArrowLeft, Calculator } from 'lucide-react';
import { FormEventHandler, useState } from 'react';
import InputError from '@/components/input-error';

interface Customer { id: number; first_name: string; last_name: string; meter_number?: string; }
interface WaterRate { base_rate: number; rate_per_cubic_meter: number; penalty_amount: number; }

export default function GenerateBill({
    customers,
    rate,
}: {
    customers: Customer[];
    rate: WaterRate;
}) {
    const today = new Date().toISOString().split('T')[0];
    const dueDefault = new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        consumption: '',
        billing_date: today,
        due_date: dueDefault,
    });

    const baseRate = parseFloat(rate.base_rate as any);
    const ratePerM3 = parseFloat(rate.rate_per_cubic_meter as any);
    const consumption = parseFloat(data.consumption) || 0;
    const estimatedTotal = baseRate + consumption * ratePerM3;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/bills/generate');
    };

    return (
        <AdminLayout title="Generate Bill">
            <Head title="Generate Bill" />

            <div className="max-w-2xl space-y-6">
                <Link href="/admin/bills" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white">
                    <ArrowLeft className="h-4 w-4" /> Back to Bills
                </Link>

                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <FileText className="h-6 w-6 text-blue-400" /> Generate Water Bill
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Create a new bill for a customer account.</p>
                </div>

                {/* Rate info */}
                <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                        <p className="text-slate-400">Base Rate</p>
                        <p className="text-white font-semibold mt-1">₱{baseRate.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-slate-400">Per Cubic Meter</p>
                        <p className="text-white font-semibold mt-1">₱{ratePerM3.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-slate-400">Penalty</p>
                        <p className="text-white font-semibold mt-1">₱{parseFloat(rate.penalty_amount as any).toFixed(2)}</p>
                    </div>
                </div>

                <form onSubmit={submit} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5">
                    {/* Customer */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Customer</label>
                        <select value={data.user_id} onChange={(e) => setData('user_id', e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
                            <option value="">— Select Customer —</option>
                            {customers.map((c) => (
                                <option key={c.id} value={c.id}>{c.first_name} {c.last_name} (@{c.meter_number})</option>
                            ))}
                        </select>
                        <InputError message={errors.user_id} />
                    </div>

                    {/* Consumption */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Water Consumption (m³)</label>
                        <input type="number" step="0.01" min="0" value={data.consumption}
                            onChange={(e) => setData('consumption', e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
                            placeholder="e.g. 12.50" />
                        <InputError message={errors.consumption} />
                    </div>

                    {/* Estimated total */}
                    {consumption > 0 && (
                        <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 flex items-center gap-3">
                            <Calculator className="h-5 w-5 text-blue-400 shrink-0" />
                            <div>
                                <p className="text-xs text-blue-300">Estimated Total</p>
                                <p className="text-xl font-bold text-white">₱{estimatedTotal.toFixed(2)}</p>
                                <p className="text-xs text-slate-400 mt-0.5">₱{baseRate.toFixed(2)} base + {consumption} m³ × ₱{ratePerM3.toFixed(2)}</p>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Billing Date</label>
                            <input type="date" value={data.billing_date} onChange={(e) => setData('billing_date', e.target.value)}
                                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
                            <InputError message={errors.billing_date} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Due Date</label>
                            <input type="date" value={data.due_date} onChange={(e) => setData('due_date', e.target.value)}
                                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none" />
                            <InputError message={errors.due_date} />
                        </div>
                    </div>

                    <button type="submit" disabled={processing}
                        className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors">
                        {processing ? 'Generating...' : 'Generate Bill'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
