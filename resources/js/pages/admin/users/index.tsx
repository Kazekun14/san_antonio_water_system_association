import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Search, FilterX, Users } from 'lucide-react';
import { FormEvent } from 'react';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    position?: string | null;
    position_label?: string | null;
    created_at: string;
}

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export default function UsersIndex({
    users,
    filters,
}: {
    users: PaginatedUsers;
    filters: { 
        search?: string;
        role?: string;
    };
}) {
    const { data, setData, get, reset } = useForm({
        search: filters.search || '',
        role: filters.role || '',
    });

    const applyFilters = (e: FormEvent) => {
        e.preventDefault();
        get('/admin/users', { preserveState: true });
    };

    const clearFilters = () => {
        reset();
        router.get('/admin/users');
    };

    const handleDelete = (user: User) => {
        if (confirm(`Delete account for ${user.first_name} ${user.last_name}? This cannot be undone.`)) {
            router.delete(`/admin/users/${user.id}`);
        }
    };

    return (
        <AdminLayout title="Account Management">
            <Head title="Staff Accounts" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Users className="h-6 w-6 text-sky-700" /> Platform Accounts
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">{users.total} total system users</p>
                    </div>
                    <Link
                        href="/admin/users/create"
                        className="inline-flex items-center gap-2 rounded-xl bg-sky-700 hover:bg-sky-600 px-5 py-2.5 text-sm font-bold text-white transition-colors shadow-sm"
                    >
                        <Plus className="h-4 w-4" /> Add Account
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <form onSubmit={applyFilters} className="flex flex-wrap items-center gap-3">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search name, email, username..."
                                value={data.search}
                                onChange={(e) => setData('search', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                            />
                        </div>
                        <div className="w-full md:w-48">
                            <select
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all appearance-none cursor-pointer"
                            >
                                <option value="">All Roles</option>
                                <option value="admin">Administrators</option>
                                <option value="staff">Staff Members</option>
                                <option value="customer">Customers</option>
                            </select>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="rounded-xl bg-sky-700 hover:bg-sky-600 px-5 py-2 text-sm font-bold text-white transition-colors shadow-sm"
                            >
                                Apply
                            </button>
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-colors"
                                title="Clear All"
                            >
                                <FilterX className="h-4 w-4" />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Table */}
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Username</th>
                                    <th className="px-6 py-4">Full Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Position</th>
                                    <th className="px-6 py-4">Joined</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                                            No accounts found.
                                        </td>
                                    </tr>
                                ) : users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 font-mono text-xs font-bold text-sky-700">@{user.username}</td>
                                        <td className="px-6 py-4 font-bold text-slate-900">{user.first_name} {user.last_name}</td>
                                        <td className="px-6 py-4 text-slate-500">{user.email}</td>
                                        <td className="px-6 py-4">
                                            {user.role === 'admin' ? (
                                                <span className="rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                                                    Admin
                                                </span>
                                            ) : user.role === 'staff' ? (
                                                <span className="rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200">
                                                    Staff
                                                </span>
                                            ) : (
                                                <span className="rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-sky-50 text-sky-700 border border-sky-200">
                                                    Customer
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.position_label ? (
                                                <span
                                                    className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider border ${
                                                        user.position === 'meter_reader'
                                                            ? 'bg-teal-50 text-teal-700 border-teal-200'
                                                            : user.position === 'encoder'
                                                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                                                : 'bg-rose-50 text-rose-700 border-rose-200'
                                                    }`}
                                                >
                                                    {user.position_label}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="inline-flex gap-2">
                                                <Link
                                                    href={`/admin/users/${user.id}/edit`}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                                >
                                                    <Pencil className="h-3 w-3 text-slate-500" /> Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(user)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 transition-colors"
                                                >
                                                    <Trash2 className="h-3 w-3" /> Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
                            <p className="text-xs font-medium text-slate-500">
                                Showing {users.from}–{users.to} of {users.total}
                            </p>
                            <div className="flex gap-1">
                                {users.links.map((link, i) => (
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                                                link.active
                                                    ? 'bg-sky-700 text-white'
                                                    : 'text-slate-600 hover:bg-white hover:text-sky-700 border border-slate-200'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span key={i} className="rounded-lg px-3 py-1.5 text-xs text-slate-400"
                                            dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
