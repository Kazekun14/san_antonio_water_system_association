import StaffLayout from '@/layouts/staff-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { format } from 'date-fns';
import { Gauge, ArrowLeft, Calculator, MapPin, UserRound, UserCog } from 'lucide-react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';

interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    purok?: string | null;
    meter_number?: string;
}

interface MeterReader {
    id: number;
    username: string;
}

export default function CreateMeterReading({
    customers,
    previousReadings,
    meterReaders,
}: {
    customers: Customer[];
    previousReadings: Record<number, string>;
    meterReaders: MeterReader[];
}) {
    // Local calendar date (not UTC) so “today” matches the user's timezone and
    // the max attribute never wrongly blocks today's date.
    const today = format(new Date(), 'yyyy-MM-dd');

    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        meter_reader_id: '',
        meter_reading: '',
        reading_date: '',
    });

    const selectedCustomer = customers.find((c) => c.id === parseInt(data.customer_id));
    const prev = data.customer_id ? parseFloat(previousReadings[parseInt(data.customer_id)] || '0') || 0 : 0;
    const curr = parseFloat(data.meter_reading) || 0;
    const usage = Math.max(curr - prev, 0);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/staff/meter-readings');
    };

    return (
        <StaffLayout title="Record Meter Reading">
            <Head title="Record Reading" />

            <div className="max-w-2xl space-y-6">
                <Link href="/staff/meter-readings" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white">
                    <ArrowLeft className="h-4 w-4" /> Back to Readings
                </Link>

                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Gauge className="h-6 w-6 text-teal-400" /> Record New Reading
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Enter a meter reading for a customer — same fields as the Excel import template.</p>
                </div>

                <form onSubmit={submit} className="rounded-2xl border border-slate-800 bg-slate-900 p-6 space-y-5">
                    {/* Customer Name */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                            <UserRound className="h-4 w-4 text-slate-500" /> Customer Name
                        </label>
                        <select
                            value={data.customer_id}
                            onChange={(e) => setData('customer_id', e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
                        >
                            <option value="">— Select Customer —</option>
                            {customers.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.first_name} {c.last_name}{c.purok ? ` — Purok ${c.purok}` : ''}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.customer_id} />
                    </div>

                    {/* Purok */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-slate-500" /> Purok
                        </label>
                        <input
                            type="text"
                            value={selectedCustomer?.purok || ''}
                            readOnly
                            placeholder="— Select a customer —"
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-500 outline-none cursor-not-allowed"
                        />
                        <p className="text-[11px] text-slate-500 mt-1">Auto-filled from the selected customer, matching the import template.</p>
                    </div>

                    {/* Meter Reader */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                            <UserCog className="h-4 w-4 text-slate-500" /> Meter Reader
                        </label>
                        <select
                            value={data.meter_reader_id}
                            onChange={(e) => setData('meter_reader_id', e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
                        >
                            <option value="">— Select Meter Reader —</option>
                            {meterReaders.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.username}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.meter_reader_id} />
                    </div>

                    {/* Meter Reading */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Meter Reading (m³)</label>
                        <input
                            type="number"
                            step="0.01"
                            min={prev || 0}
                            value={data.meter_reading}
                            onChange={(e) => setData('meter_reading', e.target.value)}
                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none"
                            placeholder="0.00"
                        />
                        <InputError message={errors.meter_reading} />
                        {data.customer_id && (
                            <p className="text-[11px] text-slate-500 mt-1">Previous reading: {prev.toFixed(2)} m³ (auto from last reading)</p>
                        )}
                    </div>

                    {/* Reading Date */}
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Reading Date</label>
                        <input
                            type="date"
                            value={data.reading_date}
                            max={today}
                            onChange={(e) => setData('reading_date', e.target.value)}
                            className={`w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none ${data.reading_date ? 'text-white' : 'text-slate-400'}`}
                        />
                        <InputError message={errors.reading_date} />
                    </div>

                    {/* Calculated Consumption */}
                    <div className="rounded-xl bg-teal-500/10 border border-teal-500/20 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Calculator className="h-5 w-5 text-teal-400 shrink-0" />
                            <div>
                                <p className="text-xs text-teal-300 uppercase font-bold tracking-wider">Total Consumption</p>
                                <p className="text-2xl font-bold text-white font-mono">{usage.toFixed(2)} m³</p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full rounded-xl bg-teal-600 px-4 py-3 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-60 transition-colors"
                    >
                        {processing ? 'Saving...' : 'Save Meter Reading'}
                    </button>
                </form>
            </div>
        </StaffLayout>
    );
}
