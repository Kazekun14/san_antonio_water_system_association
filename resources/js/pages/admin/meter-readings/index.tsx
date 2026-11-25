import CustomerCombobox, { type Customer } from '@/components/admin/customer-combobox';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import {
    CalendarDays,
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Download,
    FilterX,
    ListChecks,
    Plus,
    SlidersHorizontal,
    Trash2,
    Upload,
    UserCog,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface Reading {
    id: number;
    meter_reading: string;
    status: string;
    reading_date: string;
    created_at: string;
    updated_at: string;
    customer: { full_name: string; meter_number: string };
    meter_reader: { full_name: string } | null;
    recorder: { full_name: string } | null;
    bill_id: number | null;
}

interface PaginatedReadings {
    data: Reading[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface MeterReader {
    id: number;
    username: string;
}

// The filters echoed back from the server. Date values are plain YYYY-MM-DD
// strings; ids are numbers (null when the filter is inactive).
interface Filters {
    meter_reader_id: number | null;
    customer_id: number | null;
    date_from: string | null;
    date_to: string | null;
}

// Compact label for the Reading Date filter, e.g. "Aug 1 – Aug 15, 2026". Both
// boundaries are inclusive, so a from == to selection reads as a single day.
function formatFilterDateRange(from: string | null, to: string | null): string {
    const parseFull = (d: string) => format(new Date(`${d}T00:00:00`), 'MMM d, yyyy');
    if (from && to) {
        if (from === to) return parseFull(from);
        return `${format(new Date(`${from}T00:00:00`), 'MMM d')} – ${parseFull(to)}`;
    }
    if (from) return `From ${parseFull(from)}`;
    if (to) return `To ${parseFull(to)}`;
    return '';
}

export default function AdminMeterReadingsIndex({
    readings,
    meterReaders,
    customers,
    filters,
}: {
    readings: PaginatedReadings;
    meterReaders: MeterReader[];
    customers: Customer[];
    filters: Filters;
}) {
    // Local calendar date (not UTC) so “today” matches the user's timezone and
    // the max attribute never wrongly blocks today's date.
    const today = format(new Date(), 'yyyy-MM-dd');

    // First/last entries of Laravel's links array are the Previous/Next links.
    const prevLink = readings.links[0];
    const nextLink = readings.links[readings.links.length - 1];

    const [isImporting, setIsImporting] = useState(false);
    const [meterReaderId, setMeterReaderId] = useState('');
    const [importDate, setImportDate] = useState('');
    const [deleteTarget, setDeleteTarget] = useState<Reading | null>(null);
    const [approveTarget, setApproveTarget] = useState<Reading | null>(null);
    const { errors } = usePage().props as { errors?: Record<string, string> };

    // Ids selected via the checkbox column for the bulk actions. Only pending
    // readings can be selected.
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [bulkAction, setBulkAction] = useState<'delete' | 'approve' | null>(null);

    // Draft From/To dates for the Reading Date popover, kept in local state so
    // Apply/Clear can batch both into a single server request.
    const [dateFrom, setDateFrom] = useState(filters.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters.date_to ?? '');

    // Keep the popover drafts in sync with the applied filters (e.g. after
    // pagination, or when the Reading Date chip is cleared).
    useEffect(() => {
        setDateFrom(filters.date_from ?? '');
        setDateTo(filters.date_to ?? '');
    }, [filters.date_from, filters.date_to]);

    // ---- Bulk selection (checkbox column) ----
    // The header/select-all checkbox controls pending readings on the current page.
    const pendingReadings = readings.data.filter((r) => r.status === 'pending');
    const selectedPendingIds = selectedIds.filter((id) => pendingReadings.some((r) => r.id === id));
    const allPendingSelected = pendingReadings.length > 0 && selectedPendingIds.length === pendingReadings.length;
    const somePendingSelected = selectedPendingIds.length > 0;

    // Selection is scoped to the current view: whenever the visible list
    // changes (pagination or filters), the previous view's selection is
    // dropped so the count never refers to rows no longer on screen.
    useEffect(() => {
        setSelectedIds([]);
    }, [readings]);

    // Send the filters to the server so the table, pagination and chips all
    // reflect them. Only the changed keys need to be passed — the rest come
    // from the filters prop (server truth), so clearing one filter never
    // resets the others.
    const applyFilters = (patch: Partial<Filters>) => {
        const next = { ...filters, ...patch };

        router.get(
            '/admin/meter-readings',
            {
                meter_reader_id: next.meter_reader_id ?? '',
                customer_id: next.customer_id ?? '',
                date_from: next.date_from ?? '',
                date_to: next.date_to ?? '',
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handleCustomerFilter = (customer: Customer | null) => {
        applyFilters({ customer_id: customer ? customer.id : null });
    };

    const applyDateRange = () => {
        // Skip the round-trip when nothing changed (e.g. Apply with empty inputs).
        if (dateFrom === (filters.date_from ?? '') && dateTo === (filters.date_to ?? '')) return;
        applyFilters({ date_from: dateFrom || null, date_to: dateTo || null });
    };

    const clearDateRange = () => {
        if (!filters.date_from && !filters.date_to) return;
        applyFilters({ date_from: null, date_to: null });
    };

    // Clear every filter at once, returning the list to its unfiltered state.
    const clearAllFilters = () => {
        router.get(
            '/admin/meter-readings',
            { meter_reader_id: '', customer_id: '', date_from: '', date_to: '' },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const selectedCustomer = filters.customer_id ? (customers.find((c) => c.id === filters.customer_id) ?? null) : null;

    // True when any filter is applied — drives the Clear Filters button state.
    const hasActiveFilters = Boolean(filters.meter_reader_id || filters.customer_id || filters.date_from || filters.date_to);

    const handleApprove = (reading: Reading) => {
        setApproveTarget(reading);
    };

    const confirmApprove = () => {
        if (!approveTarget) return;

        router.post(`/admin/meter-readings/${approveTarget.id}/approve`, {}, { preserveScroll: true });
        setApproveTarget(null);
    };

    const handleDelete = (reading: Reading) => {
        // Deleting a reading also removes the bill (and payment) generated for
        // it, so confirm before doing something irreversible.
        setDeleteTarget(reading);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;

        router.delete(`/admin/meter-readings/${deleteTarget.id}`, { preserveScroll: true });
        setDeleteTarget(null);
    };

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    const handleHeaderCheckbox = () => {
        // Clicking the header checkbox with anything selected clears the whole
        // selection (this covers both the indeterminate "some selected" and the
        // "all selected" states); with nothing selected it selects every
        // pending reading on the page.
        if (somePendingSelected) {
            setSelectedIds([]);
        } else {
            setSelectedIds(pendingReadings.map((r) => r.id));
        }
    };

    const confirmBulkApprove = () => {
        if (selectedPendingIds.length === 0) return;

        router.post('/admin/meter-readings/bulk-approve', { ids: selectedPendingIds }, { preserveScroll: true });
        setBulkAction(null);
    };

    const confirmBulkDelete = () => {
        if (selectedPendingIds.length === 0) return;

        router.delete('/admin/meter-readings/bulk-delete', { data: { ids: selectedPendingIds }, preserveScroll: true });
        setBulkAction(null);
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Client-side guard: a Meter Reader and Reading Date must both be
        // selected before an import is allowed (the backend enforces this too).
        if (!meterReaderId || !importDate) return;

        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIsImporting(true);

            router.post(
                '/admin/meter-readings/import',
                { file, meter_reader_id: meterReaderId, reading_date: importDate },
                {
                    forceFormData: true,
                    preserveScroll: true,
                    onFinish: () => {
                        setIsImporting(false);
                        e.target.value = '';
                    },
                },
            );
        }
    };

    return (
        <AdminLayout title="Admin Meter Readings">
            <Head title="Admin Meter Readings" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Meter Reading Management</h2>
                    <p className="mt-1 text-sm text-slate-500">Record, review, and update customer readings</p>
                </div>

                {/* Quick Actions */}
                <div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/admin/meter-readings/create"
                            className="inline-flex items-center gap-2 rounded-xl bg-sky-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-sky-600 hover:shadow-md active:scale-95"
                        >
                            <Plus className="h-4 w-4" /> Record Reading
                        </Link>
                        <a
                            href="/admin/meter-readings/template"
                            className="ml-auto inline-flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm font-bold text-sky-700 shadow-sm transition-colors hover:bg-sky-100/80"
                        >
                            <Download className="h-4 w-4" /> Template
                        </a>
                        {/* Import group: meter reader select + file picker fused into one control, no gap/seam */}
                        <div className="inline-flex items-stretch overflow-hidden rounded-xl border border-emerald-200 shadow-sm">
                            <div className="relative">
                                <UserCog className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-emerald-600" />
                                <select
                                    value={meterReaderId}
                                    onChange={(e) => setMeterReaderId(e.target.value)}
                                    className="h-full w-44 cursor-pointer border-r border-emerald-200 bg-emerald-50/60 py-2.5 pr-3 pl-9 text-sm font-semibold text-slate-900 transition-all outline-none focus:bg-white"
                                >
                                    <option value="">Meter Reader</option>
                                    {meterReaders.map((r) => (
                                        <option key={r.id} value={r.id}>
                                            {r.username}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Reading Date: a styled shell (calendar icon left, chevron right) with an
                                invisible native date input layered on top, so clicking anywhere on the
                                field — including the chevron — still opens the browser date picker. A
                                plain type="date" input can't render a custom placeholder (browsers show
                                mm/dd/yyyy instead), so the label lives in the shell. */}
                            <div className="relative flex h-full w-40 items-center border-r border-emerald-200 bg-emerald-50/60 py-2.5 pr-3 pl-9 text-sm font-semibold text-slate-900 transition-all focus-within:bg-white">
                                <input
                                    type="date"
                                    value={importDate}
                                    max={today}
                                    onChange={(e) => setImportDate(e.target.value)}
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
                                    aria-label="Reading Date"
                                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                                />
                                <CalendarDays
                                    aria-hidden="true"
                                    className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-emerald-600"
                                />
                                <span className="pointer-events-none block w-full truncate">
                                    {importDate ? format(new Date(`${importDate}T00:00:00`), 'MM/dd/yyyy') : 'Reading Date'}
                                </span>
                                <ChevronDown
                                    aria-hidden="true"
                                    className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-black"
                                />
                            </div>
                            <input
                                type="file"
                                id="import-readings"
                                className="hidden"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleImport}
                                disabled={!meterReaderId || !importDate || isImporting}
                            />
                            <label
                                htmlFor="import-readings"
                                className={`inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm font-bold transition-colors active:scale-95 ${meterReaderId && importDate && !isImporting ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'cursor-not-allowed bg-emerald-100 text-emerald-400'}`}
                            >
                                <Upload className="h-4 w-4" /> {isImporting ? 'Importing...' : 'Import Excel'}
                            </label>
                        </div>
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-x-6 gap-y-1.5">
                        <InputError message={errors?.meter_reader_id} />
                        <InputError message={errors?.reading_date} />
                        <InputError message={errors?.file} />
                    </div>
                </div>

                {/* Filters — all applied server-side; each control updates only its own
                    filter so the others are preserved. Clear Filters (right) resets
                    everything at once, and the bulk actions sit directly below. */}
                <div className="rounded-2xl border border-slate-200 bg-sky-50/50 p-4 shadow-sm">
                    {/* gap-2 (not gap-3) keeps the icon, four equal-width fields and the
                        Clear Filters button on a single row at common desktop widths. */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Filter icon — before the Customer field */}
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-700 text-white shadow-sm">
                            <SlidersHorizontal className="h-4 w-4" />
                        </div>
                        {/* Customer — searchable combobox (reuses the form component). All four
                            fields share one fixed width (w-56) so the row stays perfectly balanced;
                            a fluid flex-1 width makes the combobox render narrower than the selects. */}
                        <div className="w-56 shrink-0">
                            <CustomerCombobox
                                customers={customers}
                                value={selectedCustomer}
                                onChange={handleCustomerFilter}
                                withIcon
                                placeholder="Search customer"
                            />
                        </div>

                        {/* Meter Reader — admins and meter_reader staff only (encoders excluded);
                            shows the placeholder when no reader is filtered. Wrapped in a fixed-width
                            div (w-56) so it matches the other filter fields exactly. */}
                        <div className="w-56 shrink-0">
                            <Select
                                value={filters.meter_reader_id ? String(filters.meter_reader_id) : ''}
                                onValueChange={(v) => applyFilters({ meter_reader_id: Number(v) })}
                            >
                                <SelectTrigger className="inline-flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm font-semibold text-slate-900 transition-all outline-none hover:border-slate-300 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:ring-offset-0 [&>svg]:opacity-100">
                                    <div className="flex min-w-0 items-center gap-2 overflow-hidden [&_span]:truncate">
                                        <UserCog className="h-4 w-4 shrink-0 text-sky-700" />
                                        <SelectValue placeholder="Meter Reader" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="z-50 rounded-xl border-slate-200 bg-white text-slate-900 shadow-lg">
                                    {meterReaders.map((r) => (
                                        <SelectItem key={r.id} value={String(r.id)} className="cursor-pointer focus:bg-sky-50 focus:text-sky-900">
                                            {r.username}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Reading Date — custom From/To range only (no presets) */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className={`inline-flex h-10 w-56 shrink-0 cursor-pointer items-center justify-between gap-2 rounded-xl border text-sm font-semibold transition-all outline-none hover:border-slate-300 focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20 ${
                                        filters.date_from || filters.date_to
                                            ? // Same slate border/background as the other filter fields once a
                                              // range is applied; tighter padding (px-3) keeps the full
                                              // "Jul 31 – Aug 31, 2026" label visible without truncating.
                                              'border-slate-200 bg-slate-50 px-3 text-slate-900'
                                            : 'border-slate-200 bg-slate-50 px-3.5 text-slate-900'
                                    }`}
                                >
                                    <span className="flex min-w-0 items-center gap-2">
                                        {/* Calendar icon stays visible at all times — the shared field
                                            width (w-56) leaves room for it next to the full date range. */}
                                        <CalendarDays className="h-4 w-4 shrink-0 text-sky-700" />
                                        <span className="truncate">
                                            {formatFilterDateRange(filters.date_from, filters.date_to) || 'Reading Date'}
                                        </span>
                                    </span>
                                    <ChevronDown className="h-4 w-4 shrink-0 text-slate-900" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="start"
                                className="z-50 w-72 rounded-xl border-slate-200 bg-white p-4 text-slate-900 shadow-lg"
                            >
                                <DropdownMenuLabel className="px-0 text-sm font-bold text-slate-900">Reading Date</DropdownMenuLabel>
                                <div className="mt-2 space-y-3">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-900">From</label>
                                        <input
                                            type="date"
                                            value={dateFrom}
                                            onChange={(e) => setDateFrom(e.target.value)}
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
                                            className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 transition-all outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold text-slate-900">To</label>
                                        <input
                                            type="date"
                                            value={dateTo}
                                            onChange={(e) => setDateTo(e.target.value)}
                                            onClick={(e) => {
                                                const el = e.currentTarget as HTMLInputElement;
                                                if (typeof el.showPicker === 'function') {
                                                    try {
                                                        el.showPicker();
                                                    } catch {
                                                        // Ignore AbortError: the picker is already open.
                                                    }
                                                }
                                            }}
                                            className="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 transition-all outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={clearDateRange}
                                        className="cursor-pointer rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-900 transition-colors hover:bg-slate-50"
                                    >
                                        Clear
                                    </button>
                                    <button
                                        type="button"
                                        onClick={applyDateRange}
                                        className="cursor-pointer rounded-xl bg-sky-700 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-sky-600"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Clear Filters — sits at the right end of the filter row; disabled
                            while no filters are applied */}
                        <button
                            type="button"
                            onClick={clearAllFilters}
                            disabled={!hasActiveFilters}
                            title="Clear all filters"
                            // ml-auto pins the button to the far right of the row, on the same line
                            // as the filter fields, with the row's gap providing breathing room.
                            className="ml-auto inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <FilterX className="h-4 w-4" /> Clear Filters
                        </button>
                    </div>

                    {/* Bulk actions — always-visible compact row under the filter fields;
                        Delete/Approve enable only when pending readings are selected */}
                    <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-3">
                        {/* Bulk actions icon — plain icon, no background */}
                        <ListChecks className="h-4 w-4 shrink-0 text-sky-700" />
                        <span className="text-sm font-bold text-slate-900">{selectedPendingIds.length} selected</span>
                        <button
                            type="button"
                            onClick={() => setBulkAction('delete')}
                            disabled={selectedPendingIds.length === 0}
                            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                                selectedPendingIds.length === 0
                                    ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
                                    : 'cursor-pointer border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100'
                            }`}
                        >
                            <Trash2 className="h-3.5 w-3.5" /> Delete Selected
                        </button>
                        <button
                            type="button"
                            onClick={() => setBulkAction('approve')}
                            disabled={selectedPendingIds.length === 0}
                            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-colors ${
                                selectedPendingIds.length === 0
                                    ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400'
                                    : 'cursor-pointer border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            }`}
                        >
                            <CheckCircle className="h-3.5 w-3.5" /> Approve Selected
                        </button>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[960px] text-left text-sm">
                            <thead className="border-b border-slate-200 bg-sky-700 text-xs font-bold whitespace-nowrap text-white uppercase">
                                <tr>
                                    <th className="w-14 px-4 py-4 text-center">
                                        <Checkbox
                                            aria-label="Select all pending readings"
                                            checked={allPendingSelected ? true : somePendingSelected ? 'indeterminate' : false}
                                            onCheckedChange={handleHeaderCheckbox}
                                            disabled={pendingReadings.length === 0}
                                            className="size-4 cursor-pointer border-white/40 data-[state=checked]:border-white data-[state=checked]:bg-white data-[state=checked]:text-sky-700"
                                        />
                                    </th>
                                    <th className="px-6 py-4">Meter Reader</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Recorded By</th>
                                    <th className="px-6 py-4">Reading Date</th>
                                    <th className="px-6 py-4">Meter Reading (m³)</th>
                                    <th className="px-6 py-4">Created At</th>
                                    <th className="px-6 py-4">Updated At</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-normal text-slate-900">
                                {readings.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-10 text-center text-slate-400">
                                            No meter readings found.
                                        </td>
                                    </tr>
                                ) : (
                                    readings.data.map((r) => {
                                        const readingDate = r.reading_date ? new Date(r.reading_date) : null;
                                        const createdAt = r.created_at ? new Date(r.created_at) : null;
                                        const updatedAt = r.updated_at ? new Date(r.updated_at) : null;
                                        return (
                                            <tr key={r.id} className="transition-colors hover:bg-slate-50/80">
                                                {' '}
                                                <td className="px-4 py-4 text-center">
                                                    <Checkbox
                                                        aria-label={`Select reading for ${r.customer.full_name}`}
                                                        checked={selectedIds.includes(r.id)}
                                                        onCheckedChange={() => toggleSelect(r.id)}
                                                        disabled={r.status !== 'pending'}
                                                        className="size-4 cursor-pointer data-[state=checked]:border-sky-700 data-[state=checked]:bg-sky-700 data-[state=checked]:text-white"
                                                    />
                                                </td>
                                                <td className="px-6 py-4">
                                                    {r.meter_reader ? (
                                                        <span>{r.meter_reader.full_name}</span>
                                                    ) : (
                                                        <span className="text-xs italic">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p>{r.customer.full_name}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {r.recorder ? <span>{r.recorder.full_name}</span> : <span className="text-xs italic">—</span>}
                                                </td>
                                                <td className="px-6 py-4 text-xs">
                                                    {readingDate ? (
                                                        readingDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                                                    ) : (
                                                        <span className="italic">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 font-mono">{parseFloat(r.meter_reading).toFixed(2)}</td>
                                                <td className="px-6 py-4 text-xs">
                                                    {createdAt ? (
                                                        createdAt.toLocaleString(undefined, {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            hour: 'numeric',
                                                            minute: '2-digit',
                                                        })
                                                    ) : (
                                                        <span className="italic">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-xs">
                                                    {updatedAt ? (
                                                        updatedAt.toLocaleString(undefined, {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            hour: 'numeric',
                                                            minute: '2-digit',
                                                        })
                                                    ) : (
                                                        <span className="italic">—</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="inline-flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/admin/meter-readings/${r.id}/edit`}
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700 transition-colors hover:bg-sky-100"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(r)}
                                                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 transition-colors hover:bg-rose-100"
                                                        >
                                                            <Trash2 className="h-3 w-3" /> Delete
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleApprove(r)}
                                                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 transition-colors hover:bg-emerald-100"
                                                        >
                                                            <CheckCircle className="h-3 w-3" /> Approve
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    {readings.total > 0 && (
                        <div className="flex items-center justify-center gap-4 border-t border-slate-200 bg-slate-50 p-4">
                            {prevLink.url ? (
                                <Link
                                    href={prevLink.url}
                                    aria-label="Previous page"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-white hover:text-sky-700"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Link>
                            ) : (
                                <span
                                    aria-disabled="true"
                                    className="inline-flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg border border-slate-100 bg-slate-100/50 text-slate-300"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </span>
                            )}
                            <span className="text-sm font-semibold text-slate-600">
                                Page <span className="font-bold text-slate-900">{readings.current_page}</span> of{' '}
                                <span className="font-bold text-slate-900">{readings.last_page}</span>
                            </span>
                            {nextLink.url ? (
                                <Link
                                    href={nextLink.url}
                                    aria-label="Next page"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-white hover:text-sky-700"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <span
                                    aria-disabled="true"
                                    className="inline-flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg border border-slate-100 bg-slate-100/50 text-slate-300"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Delete confirmation modal */}
            <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 sm:mx-0">
                            <Trash2 className="h-5 w-5 text-rose-600" />
                        </div>
                        <DialogTitle>Delete this meter reading for {deleteTarget?.customer.full_name}?</DialogTitle>
                        <DialogDescription>This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={confirmDelete} className="bg-rose-600 text-white hover:bg-rose-500">
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Approve confirmation modal */}
            <Dialog open={approveTarget !== null} onOpenChange={(open) => !open && setApproveTarget(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 sm:mx-0">
                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                        </div>
                        <DialogTitle>Approve this meter reading for {approveTarget?.customer.full_name}?</DialogTitle>
                        <DialogDescription>
                            Approving this meter reading will generate a bill for the customer. Once approved, this meter reading can no longer be edited or deleted and will no longer appear in this table.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={confirmApprove} className="bg-emerald-600 text-white hover:bg-emerald-500">
                            Approve
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk delete confirmation modal */}
            <Dialog open={bulkAction === 'delete'} onOpenChange={(open) => !open && setBulkAction(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 sm:mx-0">
                            <Trash2 className="h-5 w-5 text-rose-600" />
                        </div>
                        <DialogTitle>
                            Delete {selectedPendingIds.length} selected meter reading{selectedPendingIds.length === 1 ? '' : 's'}?
                        </DialogTitle>
                        <DialogDescription>This action cannot be undone. The selected meter readings will be permanently deleted.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={confirmBulkDelete} className="bg-rose-600 text-white hover:bg-rose-500">
                            Delete Selected
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk approve confirmation modal */}
            <Dialog open={bulkAction === 'approve'} onOpenChange={(open) => !open && setBulkAction(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 sm:mx-0">
                            <CheckCircle className="h-5 w-5 text-emerald-600" />
                        </div>
                        <DialogTitle>
                            Approve {selectedPendingIds.length} selected meter reading{selectedPendingIds.length === 1 ? '' : 's'}?
                        </DialogTitle>
                        <DialogDescription>
                            Approving these meter readings will generate bills for the customers. Once approved, these meter readings can no longer be edited or deleted and will no longer appear in this table.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={confirmBulkApprove} className="bg-emerald-600 text-white hover:bg-emerald-500">
                            Approve Selected
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
