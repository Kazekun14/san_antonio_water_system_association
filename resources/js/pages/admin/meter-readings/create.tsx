import CustomerCombobox, { type Customer } from '@/components/admin/customer-combobox';
import InputError from '@/components/input-error';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { addDays, format } from 'date-fns';
import { ArrowLeft, CalendarDays, Gauge, Save, UserCog, UserRound } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface MeterReader {
    id: number;
    username: string;
}

export default function CreateMeterReading({
    customers,
    previousReadings,
    latestReadingDates,
    meterReaders,
}: {
    customers: Customer[];
    previousReadings: Record<number, string>;
    latestReadingDates: Record<number, string | null>;
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

    const [localReadingError, setLocalReadingError] = useState('');
    const [localDateError, setLocalDateError] = useState('');

    const selectedCustomer = data.customer_id ? (customers.find((c) => c.id === parseInt(data.customer_id, 10)) ?? null) : null;

    // Latest recorded reading for the selected customer (from the server),
    // falling back to the customer's initial reading or 0.
    const previousReading = selectedCustomer ? parseFloat(previousReadings[selectedCustomer.id] ?? '0') || 0 : 0;

    // Latest recorded reading date for the selected customer (from the server).
    const latestReadingDate = selectedCustomer ? (latestReadingDates[selectedCustomer.id] ?? undefined) : undefined;

    // Earliest allowed reading date for the selected customer: the day AFTER
    // their latest recorded reading date, so the latest reading date itself
    // (which already has a record) can never be selected. Customers with no
    // previous readings have no entry, so only the maximum (today) applies.
    const minReadingDate = latestReadingDate ? format(addDays(new Date(`${latestReadingDate}T00:00:00`), 1), 'yyyy-MM-dd') : undefined;

    const handleCustomerSelect = (customer: Customer | null) => {
        setData('customer_id', customer ? String(customer.id) : '');
        if (customer) {
            const prev = parseFloat(previousReadings[customer.id] ?? '0') || 0;
            // Prefill with the customer's most recent recorded reading (still editable).
            setData('meter_reading', prev.toFixed(2));
            // If the currently picked date now falls on or before the new
            // customer's latest reading, drop it so an invalid date is never
            // submitted.
            const latest = latestReadingDates[customer.id];
            if (latest && data.reading_date && data.reading_date <= latest) {
                setData('reading_date', '');
            }
        } else {
            setData('meter_reading', '');
        }
        setLocalReadingError('');
        setLocalDateError('');
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Frontend guard: the entered reading must never be below the customer's
        // most recent recorded reading (the backend enforces this as well).
        if (selectedCustomer) {
            const value = parseFloat(data.meter_reading);
            if (data.meter_reading === '' || isNaN(value)) {
                setLocalReadingError('Please enter the meter reading.');
                return;
            }
            if (value < previousReading) {
                setLocalReadingError(`Meter reading (${value}) cannot be less than the previous reading (${previousReading}).`);
                return;
            }
        }

        // Frontend guard: the reading date must be within the allowed range —
        // after the customer's latest recorded reading date and not in the
        // future (the backend enforces this as well).
        if (data.reading_date && latestReadingDate && data.reading_date <= latestReadingDate) {
            setLocalDateError(
                `Reading date must be after the latest recorded reading date (${format(new Date(`${latestReadingDate}T00:00:00`), 'MM/dd/yyyy')}).`,
            );
            return;
        }
        if (data.reading_date && data.reading_date > today) {
            setLocalDateError('Reading date cannot be in the future.');
            return;
        }

        post('/admin/meter-readings');
    };

    return (
        <AdminLayout title="Record Meter Reading">
            <Head title="Record Reading" />

            {/* Back link pinned to the left of the full content area */}
            <Link
                href="/admin/meter-readings"
                className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-sky-700"
            >
                <ArrowLeft className="h-4 w-4" /> Back
            </Link>

            {/* Centered, balanced form card */}
            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Record New Reading</h2>
                    <p className="mt-1 text-sm text-slate-500">Enter a meter reading for a customer</p>
                </div>

                <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {/* Card header strip */}
                    <div className="flex items-center gap-3 rounded-t-2xl border-b border-slate-100 bg-slate-50 px-6 py-5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-700">
                            <Gauge className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900">Reading Details</p>
                            <p className="text-xs text-slate-500">All fields are required</p>
                        </div>
                    </div>

                    {/* Fields — balanced two-column grid */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {/* Meter Reader */}
                            <div>
                                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                                    <UserCog className="h-4 w-4 text-slate-400" /> Meter Reader
                                </label>
                                <select
                                    value={data.meter_reader_id}
                                    onChange={(e) => setData('meter_reader_id', e.target.value)}
                                    className={`w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm transition-all outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 ${data.meter_reader_id ? 'text-slate-900' : 'text-slate-400'}`}
                                >
                                    <option value="">— Select —</option>
                                    {meterReaders.map((r) => (
                                        <option key={r.id} value={r.id} className="truncate bg-sky-50 font-semibold text-sky-900">
                                            {r.username}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.meter_reader_id} />
                            </div>

                            {/* Customer — searchable combobox */}
                            <div>
                                <label htmlFor="customer-search" className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                                    <UserRound className="h-4 w-4 text-slate-400" /> Customer
                                </label>
                                <CustomerCombobox customers={customers} value={selectedCustomer} onChange={handleCustomerSelect} />
                                <InputError message={errors.customer_id} />
                            </div>

                            {/* Reading Date */}
                            <div>
                                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                                    <CalendarDays className="h-4 w-4 text-slate-400" /> Reading Date
                                </label>
                                <input
                                    type="date"
                                    value={data.reading_date}
                                    min={minReadingDate}
                                    max={today}
                                    onChange={(e) => {
                                        setData('reading_date', e.target.value);
                                        setLocalDateError('');
                                    }}
                                    onClick={(e) => {
                                        // Open the native picker when clicking anywhere on the field.
                                        const el = e.currentTarget as HTMLInputElement;
                                        if (typeof el.showPicker === 'function') {
                                            try {
                                                el.showPicker();
                                            } catch {
                                                // Ignore AbortError: the picker is already open.
                                            }
                                        }
                                    }}
                                    className={`w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm transition-all outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 ${data.reading_date ? 'text-slate-900' : 'text-slate-400'}`}
                                />
                                {minReadingDate && minReadingDate <= today && (
                                    <p className="mt-1 text-[11px] text-slate-400">
                                        Earliest: {format(new Date(`${minReadingDate}T00:00:00`), 'MM/dd/yyyy')} · Latest: today
                                    </p>
                                )}
                                {minReadingDate && minReadingDate > today && (
                                    <p className="mt-1 text-[11px] font-medium text-amber-600">
                                        The latest reading was recorded today — the next reading can be recorded starting{' '}
                                        {format(new Date(`${minReadingDate}T00:00:00`), 'MM/dd/yyyy')}.
                                    </p>
                                )}
                                {localDateError ? <InputError message={localDateError} /> : <InputError message={errors.reading_date} />}
                            </div>

                            {/* Meter Reading */}
                            <div>
                                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                                    <Gauge className="h-4 w-4 text-slate-400" /> Meter Reading (m³)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min={previousReading}
                                    value={data.meter_reading}
                                    onChange={(e) => {
                                        setData('meter_reading', e.target.value);
                                        setLocalReadingError('');
                                    }}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition-all outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
                                    placeholder="0.00"
                                />
                                {localReadingError ? <InputError message={localReadingError} /> : <InputError message={errors.meter_reading} />}
                            </div>
                        </div>
                    </div>

                    {/* Footer action bar — full-width, well-defined save button */}
                    <div className="rounded-b-2xl border-t border-slate-100 bg-slate-50 px-6 py-5">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl bg-sky-700 px-8 py-4 text-base font-bold text-white shadow-sm transition-colors hover:bg-sky-600 hover:shadow-md active:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <Save className="h-5 w-5" />
                            {processing ? 'Saving Reading...' : 'Save Meter Reading'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
