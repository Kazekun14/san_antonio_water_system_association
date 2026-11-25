import StaffLayout from '@/layouts/staff-layout';
import { Head, Link } from '@inertiajs/react';
import { Users, Search, Phone, MapPin, Hash } from 'lucide-react';
import { useState } from 'react';

interface Customer {
    id: number;
    full_name: string;
    meter_number: string;
    house_address: string;
    phone_number: string;
    bills_count: number;
    payments_count: number;
}

interface PaginatedCustomers {
    data: Customer[];
    from: number; to: number; total: number; last_page: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export default function StaffCustomersIndex({ customers }: { customers: PaginatedCustomers }) {
    const [search, setSearch] = useState('');

    const filtered = customers.data.filter(c =>
        c.full_name.toLowerCase().includes(search.toLowerCase()) ||
        c.meter_number.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <StaffLayout title="Customer Directory">
            <Head title="Customers" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Users className="h-6 w-6 text-teal-400" /> Customer Records
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">View and search for customer information.</p>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by name, meter, or username..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-800 pl-9 pr-4 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.length === 0 ? (
                        <div className="col-span-full py-10 text-center text-slate-500 bg-slate-900 rounded-2xl border border-slate-800 border-dashed">
                            No customers found matching your search.
                        </div>
                    ) : filtered.map((c) => (
                        <div key={c.id} className="rounded-2xl border border-slate-800 bg-slate-900 p-5 space-y-4 hover:border-teal-500/30 transition-all">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-white">{c.full_name}</h3>
                                    <p className="text-xs text-teal-400 font-mono flex items-center gap-1 mt-0.5">
                                        @{c.meter_number}
                                    </p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold">
                                    {c.full_name.charAt(0)}
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-slate-400">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 shrink-0 text-slate-600" />
                                    <span className="truncate">{c.house_address}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 shrink-0 text-slate-600" />
                                    <span>{c.phone_number}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Total Bills</p>
                                    <p className="text-white font-semibold">{c.bills_count}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase text-slate-500 font-bold tracking-wider">Payments</p>
                                    <p className="text-white font-semibold">{c.payments_count}</p>
                                </div>
                            </div>

                            <div className="pt-2 flex gap-2">
                                <Link
                                    href={`/staff/meter-readings/create?user_id=${c.id}`}
                                    className="flex-1 text-center py-2 rounded-lg bg-teal-600/10 text-teal-400 text-xs font-bold hover:bg-teal-600 hover:text-white transition-all"
                                >
                                    New Reading
                                </Link>
                                <Link
                                    href={`/staff/bills?search=${c.meter_number}`}
                                    className="flex-1 text-center py-2 rounded-lg border border-slate-700 text-slate-400 text-xs font-bold hover:bg-slate-800 transition-all"
                                >
                                    View Bills
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Simple pagination */}
                {customers.last_page > 1 && (
                    <div className="flex justify-center pt-4">
                         <div className="flex gap-1">
                            {customers.links.map((link, i) => (
                                <Link
                                    key={i}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 text-xs rounded transition-all ${
                                        link.active ? 'bg-teal-600 text-white' : 'text-slate-500 hover:text-white border border-slate-800'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </StaffLayout>
    );
}
