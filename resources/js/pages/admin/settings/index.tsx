import AdminLayout from '@/layouts/admin-layout';
import { Head, useForm } from '@inertiajs/react';
import { Settings, Save, Info, Droplet } from 'lucide-react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';

interface WaterRate {
    base_rate: string;
    rate_per_cubic_meter: string;
    penalty_amount: string;
    billing_cycle_day: number;
    barangay_name: string;
    barangay_address: string;
    contact_number: string;
}

export default function SettingsIndex({ settings }: { settings: WaterRate }) {
    const { data, setData, put, processing, errors } = useForm({
        base_rate: settings.base_rate,
        rate_per_cubic_meter: settings.rate_per_cubic_meter,
        penalty_amount: settings.penalty_amount,
        billing_cycle_day: settings.billing_cycle_day,
        barangay_name: settings.barangay_name,
        barangay_address: settings.barangay_address,
        contact_number: settings.contact_number,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put('/admin/settings');
    };

    return (
        <AdminLayout title="System Settings">
            <Head title="Settings" />

            <div className="max-w-4xl space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Settings className="h-6 w-6 text-sky-700" /> System Configuration
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">Configure water rates, billing cycles, and barangay information.</p>
                </div>

                <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Billing Rates */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Droplet className="h-5 w-5 text-sky-700" /> Water Rates
                        </h3>
                        <p className="text-xs text-slate-400">These values are used to calculate customer bills automatically.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Base Rate (₱)</label>
                                <input type="number" step="0.01" value={data.base_rate}
                                    onChange={(e) => setData('base_rate', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all" />
                                <InputError message={errors.base_rate} />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Rate Per Cubic Meter (₱)</label>
                                <input type="number" step="0.01" value={data.rate_per_cubic_meter}
                                    onChange={(e) => setData('rate_per_cubic_meter', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all" />
                                <InputError message={errors.rate_per_cubic_meter} />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Penalty Amount (₱)</label>
                                <input type="number" step="0.01" value={data.penalty_amount}
                                    onChange={(e) => setData('penalty_amount', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all" />
                                <InputError message={errors.penalty_amount} />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Billing Cycle Day (1-28)</label>
                                <input type="number" min="1" max="28" value={data.billing_cycle_day}
                                    onChange={(e) => setData('billing_cycle_day', parseInt(e.target.value))}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all" />
                                <InputError message={errors.billing_cycle_day} />
                                <p className="text-[11px] text-slate-400 mt-1 italic">Day of the month when bills are typically generated.</p>
                            </div>
                        </div>
                    </div>

                    {/* Barangay Information */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-5 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Info className="h-5 w-5 text-sky-700" /> Barangay Details
                        </h3>
                        <p className="text-xs text-slate-400">This information will appear on generated receipts and reports.</p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Barangay Name</label>
                                <input type="text" value={data.barangay_name}
                                    onChange={(e) => setData('barangay_name', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all" />
                                <InputError message={errors.barangay_name} />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Office Address</label>
                                <textarea rows={3} value={data.barangay_address}
                                    onChange={(e) => setData('barangay_address', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all" />
                                <InputError message={errors.barangay_address} />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Number</label>
                                <input type="text" value={data.contact_number}
                                    onChange={(e) => setData('contact_number', e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all" />
                                <InputError message={errors.contact_number} />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <button type="submit" disabled={processing}
                            className="w-full md:w-auto px-8 rounded-xl bg-sky-700 py-3 text-sm font-bold text-white hover:bg-sky-600 disabled:opacity-60 transition-colors flex items-center justify-center gap-2 shadow-sm">
                            <Save className="h-4 w-4" /> {processing ? 'Saving...' : 'Save System Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
