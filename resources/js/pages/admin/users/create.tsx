import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Shield, ArrowLeft } from 'lucide-react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';

export default function CreateUser() {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        password_confirmation: '',
        role: 'staff',
        position: 'encoder',
    });

    const handleRoleChange = (value: string) => {
        setData('role', value);
        if (value === 'admin') setData('position', 'administrator');
        else if (value === 'customer') setData('position', '');
        else setData('position', data.position === 'encoder' || data.position === 'meter_reader' ? data.position : 'encoder');
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/admin/users');
    };

    return (
        <AdminLayout title="Create Staff Account">
            <Head title="Create Staff" />

            <div className="max-w-2xl space-y-6 mx-auto">
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/users"
                        className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span className="font-bold">Back to Accounts</span>
                    </Link>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Shield className="h-6 w-6 text-blue-400" /> New Account
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Create a new user account for the platform.</p>
                </div>

                <form onSubmit={submit} className="bg-slate-900/50 border border-slate-800/50 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
                    {/* Username */}
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                        <input
                            type="text"
                            value={data.username}
                            onChange={(e) => setData('username', e.target.value)}
                            className="w-full bg-[#020617] border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="juan_staff"
                        />
                        <InputError message={errors.username} />
                    </div>

                    {/* Role */}
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Account Role</label>
                        <select
                            value={data.role}
                            onChange={(e) => handleRoleChange(e.target.value)}
                            className="w-full bg-[#020617] border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                        >
                            <option value="admin">Administrator</option>
                            <option value="staff">Staff Member</option>
                            <option value="customer">Customer</option>
                        </select>
                        <InputError message={errors.role} />
                    </div>

                    {/* Position (staff only) */}
                    {data.role === 'staff' && (
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Staff Position</label>
                            <select
                                value={data.position}
                                onChange={(e) => setData('position', e.target.value)}
                                className="w-full bg-[#020617] border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                            >
                                <option value="encoder">Encoder</option>
                                <option value="meter_reader">Meter Reader</option>
                            </select>
                            <p className="text-[11px] text-slate-500 ml-1">Meter Readers appear in the meter reading dropdowns; Encoders record &amp; encode readings.</p>
                            <InputError message={errors.position} />
                        </div>
                    )}

                    {/* Position hint for admins */}
                    {data.role === 'admin' && (
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Staff Position</label>
                            <input
                                type="text"
                                value="Administrator"
                                readOnly
                                className="w-full bg-[#020617] border-slate-800 rounded-2xl px-4 py-3 text-sm text-slate-400 cursor-not-allowed"
                            />
                        </div>
                    )}

                    {/* Password */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full bg-[#020617] border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                            <InputError message={errors.password} />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="w-full bg-[#020617] border-slate-800 rounded-2xl px-4 py-3 text-sm text-white focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-60"
                        >
                            {processing ? 'Creating...' : 'Create Account'}
                        </button>
                        <Link
                            href="/admin/users"
                            className="px-8 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
