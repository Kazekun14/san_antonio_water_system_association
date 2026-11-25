import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Megaphone, ArrowLeft, Save, Image as ImageIcon, X } from 'lucide-react';
import { useState, useRef } from 'react';

export default function AnnouncementCreate() {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        image: null as File | null,
        status: 'active' as 'active' | 'inactive',
        is_pinned: false as boolean,
        expires_at: '',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData('image', null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/announcements');
    };

    return (
        <AdminLayout title="Post New Announcement">
            <Head title="Create Announcement" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <Link
                        href="/admin/announcements"
                        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to list
                    </Link>
                </div>

                <div className="rounded-[32px] border border-slate-800 bg-[#020617] p-8 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                        <Megaphone className="w-32 h-32" />
                    </div>

                    <form onSubmit={submit} className="space-y-8 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column: Basic Info */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Announcement Title</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-all"
                                        placeholder="Headline for the update..."
                                    />
                                    {errors.title && <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Content / Message</label>
                                    <textarea
                                        rows={6}
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        className="w-full rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm text-white placeholder-slate-600 focus:border-blue-500 focus:outline-none transition-all resize-none"
                                        placeholder="Details of the announcement..."
                                    />
                                    {errors.content && <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.content}</p>}
                                </div>
                            </div>

                            {/* Right Column: Meta & Image */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3">Announcement Image (Optional)</label>
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`relative group cursor-pointer border-2 border-dashed rounded-3xl transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] ${
                                            preview ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/50'
                                        }`}
                                    >
                                        {preview ? (
                                            <div className="relative w-full h-full p-2">
                                                <img src={preview} className="w-full h-[204px] object-cover rounded-2xl" alt="Preview" />
                                                <button 
                                                    type="button"
                                                    onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                                    className="absolute top-4 right-4 p-1.5 bg-rose-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-blue-500 transition-all">
                                                    <ImageIcon className="w-5 h-5 text-slate-400 group-hover:text-white" />
                                                </div>
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Image</p>
                                                <p className="text-[10px] text-slate-600 mt-1">JPG, PNG (Max 2MB)</p>
                                            </>
                                        )}
                                        <input 
                                            ref={fileInputRef}
                                            type="file" 
                                            className="hidden" 
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />
                                    </div>
                                    {errors.image && <p className="mt-1.5 text-xs text-rose-400 font-medium">{errors.image}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Status</label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value as 'active' | 'inactive')}
                                            className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">Expiration (Optional)</label>
                                        <input
                                            type="date"
                                            value={data.expires_at}
                                            onChange={(e) => setData('expires_at', e.target.value)}
                                            className="w-full rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 rounded-2xl border border-slate-800 bg-slate-900/30">
                                    <input
                                        type="checkbox"
                                        id="is_pinned"
                                        checked={data.is_pinned}
                                        onChange={(e) => setData('is_pinned', e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-800 bg-slate-900 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="is_pinned" className="text-sm font-bold text-slate-400 cursor-pointer">Pin to top of list</label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-6 border-t border-slate-800">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-sm font-bold text-white hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-xl shadow-blue-500/20"
                            >
                                <Save className="h-4 w-4" /> Broadcast Announcement
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
