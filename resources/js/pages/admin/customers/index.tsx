import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { 
    Users, Plus, Search, MoreVertical, Edit2, 
    Trash2, UserPlus, Mail, Shield, User as UserIcon, MapPin,
    Activity, FilterX, Map, Eye, ChevronDown, Phone
} from 'lucide-react';
import { useState } from 'react';

interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    meter_number: string;
    household_address: string;
    phone_number: string;
    balance: number;
    user_id: number | null;
    access_type: string;
    connection_status: string;
    email: string | null;
    user?: {
        email: string;
        username: string;
    };
    purok: string | null;
    created_at: string;
}

interface Props {
    customers: {
        data: Customer[];
        links: any[];
        total: number;
    };
    zones: string[];
    filters: {
        search?: string;
        zone?: string;
        access_type?: string;
        balance_type?: string;
        status?: string;
    };
}

export default function Index({ customers, filters, zones }: Props) {
    const { data, setData, get, reset } = useForm({
        search: filters.search || '',
        zone: filters.zone || '',
        access_type: filters.access_type || '',
        balance_type: filters.balance_type || '',
        status: filters.status || '',
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        get('/admin/customers', { preserveState: true });
    };

    const clearFilters = () => {
        reset();
        router.get('/admin/customers');
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this customer record?')) {
            router.delete(`/admin/customers/${id}`);
        }
    };

    return (
        <AdminLayout title="Customer Management">
            <Head title="Customers" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Users className="h-6 w-6 text-sky-700" /> Customer Records
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">Manage customer billing profiles, water meter connections, and service records.</p>
                    </div>
                    <Link
                        href="/admin/customers/create"
                        className="flex items-center justify-center gap-2 bg-sky-700 hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm"
                    >
                        <Plus className="h-4 w-4" /> Add Customer
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-sky-50 flex items-center justify-center">
                                <Users className="h-6 w-6 text-sky-700" />
                            </div>
                            <div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Customers</p>
                                <p className="text-2xl font-bold text-slate-900">{customers.total}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shadow-sm">
                    <form onSubmit={handleSearch} className="flex flex-col gap-5">
                        {/* Top row: Search and Actions */}
                        <div className="flex flex-col md:flex-row gap-4 w-full">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by name, meter, household address, email, phone..."
                                    value={data.search}
                                    onChange={(e) => setData('search', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-[13px] text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all outline-none placeholder:text-slate-400 font-medium"
                                />
                            </div>
                            <div className="flex gap-3 md:w-auto w-full">
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-3 rounded-xl text-[13px] font-bold transition-all border border-slate-200 group outline-none"
                                    title="Clear All Filters"
                                >
                                    <FilterX className="h-4 w-4 group-hover:text-rose-600 transition-colors" />
                                    <span>Reset</span>
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 md:flex-none bg-sky-700 hover:bg-sky-600 text-white px-8 py-3 rounded-xl text-[13px] font-bold transition-all shadow-sm outline-none"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>

                        {/* Bottom row: Filters Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Zone Filter */}
                            <div className="relative group">
                                <select
                                    value={data.zone}
                                    onChange={(e) => setData('zone', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-[13px] text-slate-700 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all appearance-none outline-none font-medium cursor-pointer"
                                >
                                    <option value="">All Puroks</option>
                                    {zones.map(z => <option key={z} value={z}>{z}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
                            </div>

                            {/* Access Type Filter */}
                            <div className="relative group">
                                <select
                                    value={data.access_type}
                                    onChange={(e) => setData('access_type', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-[13px] text-slate-700 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all appearance-none outline-none font-medium cursor-pointer"
                                >
                                    <option value="">All Access Types</option>
                                    <option value="digital">Digital Account</option>
                                    <option value="physical_only">Physical Only</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
                            </div>

                            {/* Status Filter */}
                            <div className="relative group">
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-[13px] text-slate-700 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all appearance-none outline-none font-medium cursor-pointer"
                                >
                                    <option value="">All Statuses</option>
                                    <option value="active">Active Connection</option>
                                    <option value="inactive">Inactive Connection</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
                            </div>

                            {/* Balance Filter */}
                            <div className="relative group">
                                <select
                                    value={data.balance_type}
                                    onChange={(e) => setData('balance_type', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-[13px] text-slate-700 focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all appearance-none outline-none font-medium cursor-pointer"
                                >
                                    <option value="">All Balances</option>
                                    <option value="overdue">With Unpaid Balance</option>
                                    <option value="zero">Zero Balance</option>
                                    <option value="credit">With Credit Balance</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Customers Table */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Name</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Household Address</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Purok</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Info</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Access Type</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Balance</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {customers.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-6 py-16 text-center">
                                            <div className="flex flex-col items-center justify-center text-slate-400">
                                                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 border border-slate-200">
                                                    <Users className="h-8 w-8 text-slate-400" />
                                                </div>
                                                <p className="text-sm font-bold text-slate-700">No customer records yet</p>
                                                <p className="text-xs text-slate-400 mt-1 max-w-sm">When you add new customers or digital accounts, they will appear here.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    customers.data.map((c) => (
                                        <tr key={c.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 font-bold text-sm">
                                                        {(c.first_name?.[0] || '').toUpperCase()}{(c.last_name?.[0] || '').toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-900 group-hover:text-sky-700 transition-colors">{c.first_name} {c.last_name}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <p className="text-xs text-slate-400 font-mono">{c.user?.username ? `@${c.user.username}` : `Meter: ${c.meter_number}`}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-600 max-w-[200px]">
                                                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                                    <span className="text-xs truncate" title={c.household_address}>{c.household_address}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {c.purok ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-[10px] font-bold uppercase tracking-wider border border-sky-200">
                                                        {c.purok}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-400">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {c.connection_status === 'active' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                                                        <Activity className="h-3 w-3" /> Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold uppercase tracking-wider border border-rose-200">
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                                                        <Mail className="h-3 w-3 text-slate-400" /> {c.email || c.user?.email || 'No email linked'}
                                                    </p>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                                        <Phone className="h-3 w-3 text-slate-400" /> {c.phone_number || 'No phone registered'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {c.access_type === 'digital' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider border border-emerald-200">
                                                        <Shield className="h-3 w-3" /> Digital
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold uppercase tracking-wider border border-amber-200" title="No internet/device access">
                                                        Physical Only
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className={`text-sm font-bold ${c.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                    ₱{parseFloat(c.balance.toString()).toLocaleString()}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1.5 transition-all">
                                                    <Link
                                                        href={`/admin/customers/${c.id}`}
                                                        className="p-2 hover:bg-sky-50 text-sky-700 rounded-lg transition-colors"
                                                        title="View Profile"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                    {!c.user_id && (
                                                        <Link
                                                            href={`/admin/customers/${c.id}/edit?action=link`}
                                                            className="p-2 hover:bg-sky-50 text-sky-700 rounded-lg transition-colors"
                                                            title="Link Account"
                                                        >
                                                            <UserPlus className="h-4 w-4" />
                                                        </Link>
                                                    )}
                                                    <Link
                                                        href={`/admin/customers/${c.id}/edit`}
                                                        className="p-2 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors"
                                                        title="Edit Record"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(c.id)}
                                                        className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                                                        title="Delete Record"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
