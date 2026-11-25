import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, router } from '@inertiajs/react';
import { Megaphone, Plus, Pencil, Trash2, Pin, Eye, EyeOff } from 'lucide-react';

interface Announcement {
    id: number;
    title: string;
    status: 'active' | 'inactive';
    is_pinned: boolean;
    created_at: string;
    expires_at: string | null;
    user: { full_name: string };
}

interface PaginatedAnnouncements {
    data: Announcement[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

export default function AnnouncementIndex({
    announcements,
}: {
    announcements: PaginatedAnnouncements;
}) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this announcement?')) {
            router.delete(`/admin/announcements/${id}`);
        }
    };

    return (
        <AdminLayout title="Announcement Management">
            <Head title="Announcements" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Megaphone className="h-6 w-6 text-blue-400" /> Announcements
                        </h2>
                        <p className="text-slate-400 text-sm mt-1">Manage system-wide broadcasts</p>
                    </div>
                    <Link
                        href="/admin/announcements/create"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="h-4 w-4" /> Create Announcement
                    </Link>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-800/50 text-xs uppercase text-slate-400">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Posted By</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Pinned</th>
                                    <th className="px-6 py-4">Created Date</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {announcements.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-slate-500 italic">
                                            No announcements posted yet.
                                        </td>
                                    </tr>
                                ) : announcements.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white max-w-xs truncate">{item.title}</td>
                                        <td className="px-6 py-4 text-slate-400">{item.user.full_name}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                item.status === 'active' 
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                            }`}>
                                                {item.status === 'active' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {item.is_pinned && (
                                                <Pin className="h-4 w-4 text-amber-400 mx-auto fill-amber-400/20" />
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400">
                                            {new Date(item.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="inline-flex gap-2">
                                                <Link
                                                    href={`/admin/announcements/${item.id}/edit`}
                                                    className="p-2 rounded-lg border border-slate-700 bg-slate-800 text-slate-400 hover:text-white transition-colors"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 rounded-lg border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {announcements.last_page > 1 && (
                        <div className="flex items-center justify-between border-t border-slate-800 px-6 py-4 bg-slate-900/50">
                            <p className="text-xs text-slate-500">
                                Showing {announcements.from}–{announcements.to} of {announcements.total}
                            </p>
                            <div className="flex gap-1">
                                {announcements.links.map((link, i) => (
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={`rounded px-3 py-1 text-xs ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-slate-400 hover:text-white border border-slate-700'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span key={i} className="rounded px-3 py-1 text-xs text-slate-600"
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
