import CustomerCombobox, { type Customer } from '@/components/admin/customer-combobox';
import InputError from '@/components/input-error';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { addDays, format } from 'date-fns';
import { ArrowLeft, CalendarDays, Gauge, Save, UserCog, UserRound } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

interface Reading {
    id: number;
    customer_id: number;
    meter_reader_id: number | null;
    meter_reading: string;
    reading_date: string;
}

interface MeterReader {
    id: number;
    username: string;
}

export default function EditMeterReading({
    reading,
    customers,
    previousReadings,
    latestReadingDates,
    meterReaders,
}: {
    reading: Reading;
    customers: Customer[];
    previousReadings: Record<number, string>;
    latestReadingDates: Record<number, string | null>;
    meterReaders: MeterReader[];
}) {
    // Local calendar date (not UTC) so “today” matches the user's timezone and
    // the max attribute never wrongly blocks today's date.
    const today = format(new Date(), 'yyyy-MM-dd');

    // Normalize the reading date to a plain YYYY-MM-DD value for the date input.
    // The backend serializes reading_date as YYYY-MM-DD; if it ever arrives as
    // an ISO-8601 UTC timestamp (e.g. 2026-08-01T16:00:00.000000Z), parse it in
    // local time so the calendar date never shifts a day.
    function toDateInputValue(value: string | null | undefined): string {
        if (!value) {
            return '';
        }
        // Plain YYYY-MM-DD (what the backend sends) or "YYYY-MM-DD HH:MM:SS".
        const match = /^(\d{4}-\d{2}-\d{2})/.exec(value);
        if (match && !value.includes('T')) {
            return match[1];
        }
        // ISO-8601 string with a timezone component — convert in local time.
        const date = new Date(value);
        return Number.isNaN(date.getTime()) ? '' : format(date, 'yyyy-MM-dd');
    }

    // The reading's original date stays valid even if the customer has since
    // received newer readings — only a *changed* customer has to respect the
    // reading-date chain (mirroring the backend rule).
    const originalReadingDate = toDateInputValue(reading.reading_date);

    const { data, setData, put, processing, errors } = useForm({
        customer_id: String(reading.customer_id),
        meter_reader_id: reading.meter_reader_id ? String(reading.meter_reader_id) : '',
        meter_reading: String(reading.meter_reading ?? ''),
        reading_date: originalReadingDate,
    });

    const [localReadingError, setLocalReadingError] = useState('');
    const [localDateError, setLocalDateError] = useState('');

    const selectedCustomer = data.customer_id ? (customers.find((c) => c.id === parseInt(data.customer_id, 10)) ?? null) : null;
    const customerChanged = data.customer_id !== String(reading.customer_id);

    // Latest recorded reading for the selected customer (from the server, with
    // the reading being edited excluded), falling back to the initial reading.
    const previousReading = selectedCustomer ? parseFloat(previousReadings[selectedCustomer.id] ?? '0') || 0 : 0;

    // Latest recorded reading date for the selected customer (from the server).
    const latestReadingDate = selectedCustomer ? (latestReadingDates[selectedCustomer.id] ?? undefined) : undefined;

    // Earliest allowed reading date for the selected customer: the day AFTER
    // their latest recorded reading date. Not applied when it would lock out
    // the reading's own date — e.g. a newer reading now exists for the same
    // customer, in which case the original date remains valid (the backend only
    // rejects duplicates for an unchanged customer).
    const nextAllowedDate = latestReadingDate ? format(addDays(new Date(`${latestReadingDate}T00:00:00`), 1), 'yyyy-MM-dd') : undefined;
    const minReadingDate = nextAllowedDate && data.reading_date && nextAllowedDate > data.reading_date ? undefined : nextAllowedDate;

    const handleCustomerSelect = (customer: Customer | null) => {
        const previousId = data.customer_id;
        setData('customer_id', customer ? String(customer.id) : '');

        if (customer && String(customer.id) !== previousId) {
            // Prefill with the newly selected customer's most recent recorded
            // reading (still editable), matching the create page.
            const prev = parseFloat(previousReadings[customer.id] ?? '0') || 0;
            setData('meter_reading', prev.toFixed(2));
            // Drop the date if it now falls on or before the new customer's
            // latest reading, so an invalid date is never submitted.
            const latest = latestReadingDates[customer.id];
            if (latest && data.reading_date && data.reading_date <= latest) {
                setData('reading_date', '');
            }
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

        // Frontend guard: only a reading moved to a *different* customer has to
        // fit that customer's reading chain (date after their latest recorded
        // reading) — the backend enforces the same rule. An unchanged customer
        // keeps the existing behavior, where only duplicates are rejected.
        if (customerChanged && data.reading_date && latestReadingDate && data.reading_date <= latestReadingDate) {
            setLocalDateError(
                `Reading date must be after the latest recorded reading date (${format(new Date(`${latestReadingDate}T00:00:00`), 'MM/dd/yyyy')}).`,
            );
            return;
        }
        if (data.reading_date && data.reading_date > today) {
            setLocalDateError('Reading date cannot be in the future.');
            return;
        }

        put(`/admin/meter-readings/${reading.id}`);
    };

    return (
        <AdminLayout title="Edit Meter Reading">
            <Head title="Edit Reading" />

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
                    <h2 className="text-2xl font-bold text-slate-900">Edit Meter Reading</h2>
                    <p className="mt-1 text-sm text-slate-500">Correct an unbilled meter reading entry</p>
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
                                <CustomerCombobox customers={customers} value={selectedCustomer} onChange={handleCustomerSelect} nullable={false} />
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
                                {selectedCustomer && (
                                    <p className="mt-1 text-[11px] text-slate-400">
                                        Previous reading: {previousReading.toFixed(2)} m³ (auto from last reading)
                                    </p>
                                )}
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
                            {processing ? 'Updating Reading...' : 'Update Meter Reading'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
