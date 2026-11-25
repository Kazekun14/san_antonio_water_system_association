import StaffLayout from '@/layouts/staff-layout';
import { Head, Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Download, Gauge, Info, Plus, Upload } from 'lucide-react';
import { useState } from 'react';

interface Reading {
    id: number;
    previous_reading: string;
    meter_reading: string;
    consumption: string;
    reading_date: string;
    customer: { full_name: string; meter_number: string };
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

export default function MeterReadingsIndex({ readings }: { readings: PaginatedReadings }) {
    const [isImporting, setIsImporting] = useState(false);

    const prevLink = readings.links[0];
    const nextLink = readings.links[readings.links.length - 1];

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIsImporting(true);

            router.post(
                '/staff/meter-readings/import',
                { file },
                {
                    forceFormData: true,
                    onFinish: () => setIsImporting(false),
                },
            );
        }
    };

    return (
        <StaffLayout title="Meter Readings">
            <Head title="Meter Readings" />

            <div className="space-y-6">
                <div>
                    <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
                        <Gauge className="h-6 w-6 text-teal-400" /> Meter Readings
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">{readings.total} total readings recorded</p>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900 p-4 lg:flex-row lg:items-center">
                    <div className="flex flex-wrap items-center gap-2">
                        <Link
                            href="/staff/meter-readings/create"
                            className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-teal-700 active:scale-95"
                        >
                            <Plus className="h-4 w-4" /> Record Reading
                        </Link>
                        <div className="hidden h-8 w-px bg-slate-800 sm:block" />
                        <a
                            href="/staff/meter-readings/template"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700"
                        >
                            <Download className="h-4 w-4" /> Template
                        </a>
                        <div className="relative">
                            <input
                                type="file"
                                id="import-readings"
                                className="hidden"
                                accept=".csv,.xlsx,.xls"
                                onChange={handleImport}
                                disabled={isImporting}
                            />
                            <label
                                htmlFor="import-readings"
                                className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2.5 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-500/20 ${isImporting ? 'cursor-not-allowed opacity-50' : ''}`}
                            >
                                <Upload className="h-4 w-4" /> {isImporting ? 'Importing...' : 'Import Excel'}
                            </label>
                        </div>
                    </div>
                    <div className="hidden max-w-sm items-start gap-2 md:flex lg:ml-auto">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                        <p className="text-xs leading-relaxed text-slate-500">
                            Batch record readings by downloading the <span className="font-semibold text-slate-400">template</span>, filling in
                            Customer &amp; Meter Reading (m³), then importing the Excel file.
                        </p>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-800/50 text-xs text-slate-400 uppercase">
                                <tr>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Reading Date</th>
                                    <th className="px-6 py-4">Prev (m³)</th>
                                    <th className="px-6 py-4">Current (m³)</th>
                                    <th className="px-6 py-4">Cons. (m³)</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {readings.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-10 text-center text-slate-500">
                                            No meter readings found.
                                        </td>
                                    </tr>
                                ) : (
                                    readings.data.map((r) => (
                                        <tr key={r.id} className="transition-colors hover:bg-slate-800/40">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-white">{r.customer.full_name}</p>
                                                <p className="font-mono text-xs text-blue-400">@{r.customer.meter_number}</p>
                                            </td>
                                            <td className="px-6 py-4 text-slate-400">{new Date(r.reading_date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-mono text-slate-400">{parseFloat(r.previous_reading).toFixed(2)}</td>
                                            <td className="px-6 py-4 font-mono font-bold text-white">{parseFloat(r.meter_reading).toFixed(2)}</td>
                                            <td className="px-6 py-4 font-mono font-bold text-teal-400">{parseFloat(r.consumption).toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                {r.bill_id ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                                                        BILLED
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400">
                                                        UNBILLED
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {r.bill_id ? (
                                                    <span className="text-xs font-medium text-slate-600 italic">Bill generated</span>
                                                ) : (
                                                    <span className="text-xs font-medium text-amber-500 italic">Processing...</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {readings.total > 0 && (
                        <div className="flex items-center justify-center gap-4 border-t border-slate-800 p-4">
                            {prevLink.url ? (
                                <Link
                                    href={prevLink.url}
                                    aria-label="Previous page"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition-colors hover:border-slate-500 hover:text-white"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Link>
                            ) : (
                                <span
                                    aria-disabled="true"
                                    className="inline-flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg border border-slate-800 text-slate-600"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </span>
                            )}
                            <span className="text-sm text-slate-400">
                                Page <span className="font-semibold text-white">{readings.current_page}</span> of{' '}
                                <span className="font-semibold text-white">{readings.last_page}</span>
                            </span>
                            {nextLink.url ? (
                                <Link
                                    href={nextLink.url}
                                    aria-label="Next page"
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition-colors hover:border-slate-500 hover:text-white"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <span
                                    aria-disabled="true"
                                    className="inline-flex h-8 w-8 cursor-not-allowed items-center justify-center rounded-lg border border-slate-800 text-slate-600"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </StaffLayout>
    );
}
