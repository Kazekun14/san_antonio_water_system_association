import AdminLayout from '@/layouts/admin-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { 
    Users, Save, ArrowLeft, Home, Phone, User as UserIcon, 
    Link as LinkIcon, Lock, ShieldCheck, AlertCircle,
    Shield, WifiOff, Activity, Map, Hash, Gauge, Mail
} from 'lucide-react';
import { useEffect } from 'react';

interface Customer {
    id: number;
    first_name: string;
    last_name: string;

    house_address: string;
    phone_number: string;
    balance: number;
    user_id: number | null;
    access_type: string;
    connection_status: string;
    purok: string | null;
    meter_number: string | null;
    email: string | null;
    initial_reading: number | string;
    user?: {
        id: number;
        username: string;
    } | null;
}

interface Props {
    customer: Customer;
}

export default function Edit({ customer }: Props) {
    const queryParams = new URLSearchParams(window.location.search);
    const isLinking = queryParams.get('action') === 'link';

    const { data, setData, put, post, processing, errors } = useForm({
        first_name: customer.first_name,
        last_name: customer.last_name,

        house_address: customer.house_address,
        purok: customer.purok || '',
        meter_number: customer.meter_number || '',
        email: customer.email || '',
        initial_reading: Number(customer.initial_reading) ? String(Number(customer.initial_reading)) : '0',
        phone_number: customer.phone_number,
        access_type: customer.access_type,
        connection_status: customer.connection_status,
        // Account linking/edit fields
        username: customer.user?.username || '',
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/customers/${customer.id}`);
    };

    const handleLinkAccount = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/admin/customers/${customer.id}/link-account`);
    };

    return (
        <AdminLayout title={isLinking ? "Link Online Account" : "Edit Customer Record"}>
            <Head title={isLinking ? "Link Account" : "Edit Customer"} />

            <div className="max-w-3xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <Link
                        href="/admin/customers"
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span className="text-sm font-bold">Back to Customers</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Main Record Form */}
                    {!isLinking && (
                        <div className="bg-slate-900/50 border border-slate-800/50 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center">
                                    <Users className="h-6 w-6 text-slate-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">Edit Information</h2>
                                    <p className="text-slate-400 text-sm">Review and update customer record.</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">First Name</label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                            <input
                                                type="text"
                                                value={data.first_name}
                                                onChange={e => setData('first_name', e.target.value)}
                                                className="w-full bg-slate-50 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Enter first name"
                                            />
                                        </div>
                                        {errors.first_name && <p className="text-rose-400 text-xs font-bold mt-1 ml-1">{errors.first_name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Last Name</label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                            <input
                                                type="text"
                                                value={data.last_name}
                                                onChange={e => setData('last_name', e.target.value)}
                                                className="w-full bg-slate-50 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Enter last name"
                                            />
                                        </div>
                                        {errors.last_name && <p className="text-rose-400 text-xs font-bold mt-1 ml-1">{errors.last_name}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Meter Number</label>
                                        <div className="relative">
                                            <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                            <input
                                                type="text"
                                                value={data.meter_number}
                                                onChange={e => setData('meter_number', e.target.value)}
                                                className="w-full bg-slate-50 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 font-mono focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="MTR-XXXXXX"
                                            />
                                        </div>
                                        {errors.meter_number && <p className="text-rose-400 text-xs font-bold mt-1 ml-1">{errors.meter_number}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Initial Reading (m³)</label>
                                        <div className="relative">
                                            <Gauge className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.initial_reading}
                                                onChange={e => setData('initial_reading', e.target.value)}
                                                className="w-full bg-slate-50 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="0"
                                            />
                                        </div>
                                        {errors.initial_reading && <p className="text-rose-400 text-xs font-bold mt-1 ml-1">{errors.initial_reading}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Household Address</label>
                                        <div className="relative">
                                            <Home className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                            <input
                                                type="text"
                                                value={data.house_address}
                                                onChange={e => setData('house_address', e.target.value)}
                                                className="w-full bg-slate-50 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="House No., Street, or Landmark"
                                            />
                                        </div>
                                        {errors.house_address && <p className="text-rose-400 text-xs font-bold mt-1 ml-1">{errors.house_address}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Purok</label>
                                        <div className="relative">
                                            <Map className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                            <input
                                                type="text"
                                                value={data.purok}
                                                onChange={e => setData('purok', e.target.value)}
                                                className="w-full bg-slate-50 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="Purok Name"
                                            />
                                        </div>
                                        {errors.purok && <p className="text-rose-400 text-xs font-bold mt-1 ml-1">{errors.purok}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number (Optional)</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                            <input
                                                type="text"
                                                value={data.phone_number}
                                                onChange={e => setData('phone_number', e.target.value)}
                                                className="w-full bg-slate-50 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="09XXXXXXXXX"
                                            />
                                        </div>
                                        {errors.phone_number && <p className="text-rose-400 text-xs font-bold mt-1 ml-1">{errors.phone_number}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email (Optional)</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                className="w-full bg-slate-50 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                placeholder="customer@example.com"
                                            />
                                        </div>
                                        {errors.email && <p className="text-rose-400 text-xs font-bold mt-1 ml-1">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Account Access Type</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setData('access_type', 'digital')}
                                            className={`flex items-start gap-4 p-5 rounded-2xl border transition-all text-left ${data.access_type === 'digital' ? 'bg-blue-500/10 border-blue-500 shadow-lg shadow-blue-500/10' : 'bg-[#020617] border-slate-800 hover:border-slate-700'}`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${data.access_type === 'digital' ? 'bg-blue-500 text-white' : 'bg-slate-900 text-slate-500'}`}>
                                                <Shield className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold ${data.access_type === 'digital' ? 'text-white' : 'text-slate-400'}`}>Digital Account</p>
                                                <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-tight">Customer dashboard access & online payments</p>
                                            </div>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setData('access_type', 'physical_only')}
                                            className={`flex items-start gap-4 p-5 rounded-2xl border transition-all text-left ${data.access_type === 'physical_only' ? 'bg-amber-500/10 border-amber-500 shadow-lg shadow-amber-500/10' : 'bg-[#020617] border-slate-800 hover:border-slate-700'}`}
                                        >
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${data.access_type === 'physical_only' ? 'bg-amber-500 text-white' : 'bg-slate-900 text-slate-500'}`}>
                                                <WifiOff className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className={`text-sm font-bold ${data.access_type === 'physical_only' ? 'text-white' : 'text-slate-400'}`}>Physical Only</p>
                                                <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-tight">No online dashboard access or digital payments</p>
                                            </div>
                                        </button>
                                    </div>
                                    {errors.access_type && <p className="text-rose-400 text-xs font-bold mt-1 ml-1">{errors.access_type}</p>}
                                </div>

                                 {data.access_type === 'digital' && (
                                    <div className="space-y-6">

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Login Username</label>
                                            <div className="relative">
                                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                                <input
                                                    type="text"
                                                    value={data.username}
                                                    onChange={e => setData('username', e.target.value)}
                                                    className="w-full bg-slate-50 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                    placeholder="Enter a username for login"
                                                    required
                                                />
                                            </div>
                                            {errors.username && <p className="text-rose-400 text-xs font-bold mt-1 ml-1">{errors.username}</p>}
                                        </div>

                                        {customer.user_id ? (
                                            <>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                                        <input
                                                            type="password"
                                                            value={data.current_password}
                                                            onChange={e => setData('current_password', e.target.value)}
                                                            className="w-full bg-slate-50 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                            placeholder="Leave blank to keep current"
                                                        />
                                                    </div>
                                                    {errors.current_password && <p className="text-rose-400 text-xs font-bold mt-1 ml-1">{errors.current_password}</p>}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                                                        <div className="relative">
                                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                                            <input
                                                                type="password"
                                                                value={data.password}
                                                                onChange={e => setData('password', e.target.value)}
                                                                className="w-full bg-slate-50 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                                placeholder="Leave blank to keep current"
                                                            />
                                                        </div>
                                                        {errors.password && <p className="text-rose-400 text-xs font-bold mt-1 ml-1">{errors.password}</p>}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                                                        <div className="relative">
                                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                                            <input
                                                                type="password"
                                                                value={data.password_confirmation}
                                                                onChange={e => setData('password_confirmation', e.target.value)}
                                                                className="w-full bg-slate-50 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                                placeholder="Leave blank to keep current"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                                        <input
                                                            type="password"
                                                            value={data.password}
                                                            onChange={e => setData('password', e.target.value)}
                                                            className="w-full bg-slate-50 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                            placeholder="••••••••"
                                                            required
                                                        />
                                                    </div>
                                                    {errors.password && <p className="text-rose-400 text-xs font-bold mt-1 ml-1">{errors.password}</p>}
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                                        <input
                                                            type="password"
                                                            value={data.password_confirmation}
                                                            onChange={e => setData('password_confirmation', e.target.value)}
                                                            className="w-full bg-slate-50 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                            placeholder="••••••••"
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Water Connection Status</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setData('connection_status', 'active')}
                                            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${data.connection_status === 'active' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-[#020617] border-slate-800 text-slate-500'}`}
                                        >
                                            <Activity className="h-5 w-5" />
                                            <span className="text-sm font-bold">Active Connection</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setData('connection_status', 'inactive')}
                                            className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${data.connection_status === 'inactive' ? 'bg-rose-500/10 border-rose-500 text-rose-400' : 'bg-[#020617] border-slate-800 text-slate-500'}`}
                                        >
                                            <Activity className="h-5 w-5 opacity-50" />
                                            <span className="text-sm font-bold">Inactive / Disconnected</span>
                                        </button>
                                    </div>
                                    {errors.connection_status && <p className="text-rose-400 text-xs font-bold mt-1 ml-1">{errors.connection_status}</p>}
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-slate-100 hover:bg-white text-[#020617] py-4 rounded-2xl font-bold transition-all shadow-lg shadow-white/5 disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        <Save className="h-5 w-5" />
                                        {processing ? 'Saving...' : 'Update Customer Record'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Account Linking Section */}
                    {isLinking && (
                        <div className="bg-slate-900/50 border border-slate-800/50 rounded-[2.5rem] p-8 shadow-xl animate-in zoom-in-95 duration-500">
                            {!customer.user_id ? (
                                <>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                                            <LinkIcon className="h-6 w-6 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-white tracking-tight">Create Login Account</h2>
                                            <p className="text-slate-400 text-sm">Enable online access for {customer.first_name} {customer.last_name}.</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleLinkAccount} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Login Username</label>
                                            <div className="relative">
                                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                                <input
                                                    type="text"
                                                    value={data.username}
                                                    onChange={e => setData('username', e.target.value)}
                                                    className="w-full bg-slate-50 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                                    placeholder="Enter a username for login"
                                                    required
                                                />
                                            </div>
                                            {errors.username && <p className="text-rose-400 text-xs font-bold mt-1 ml-1">{errors.username}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number (Optional)</label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                                <input
                                                    type="text"
                                                    value={data.phone_number}
                                                    onChange={e => setData('phone_number', e.target.value)}
                                                    className="w-full bg-slate-50 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                                    placeholder="09XXXXXXXXX"
                                                />
                                            </div>
                                            {errors.phone_number && <p className="text-rose-400 text-xs font-bold mt-1 ml-1">{errors.phone_number}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email (Optional)</label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={e => setData('email', e.target.value)}
                                                    className="w-full bg-slate-50 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                                    placeholder="customer@example.com"
                                                />
                                            </div>
                                            {errors.email && <p className="text-rose-400 text-xs font-bold mt-1 ml-1">{errors.email}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                                                <div className="relative">
                                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                                    <input
                                                        type="password"
                                                        value={data.password}
                                                        onChange={e => setData('password', e.target.value)}
                                                        className="w-full bg-slate-50 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                                        placeholder="••••••••"
                                                        required
                                                    />
                                                </div>
                                                {errors.password && <p className="text-rose-400 text-xs font-bold mt-1 ml-1">{errors.password}</p>}
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm Password</label>
                                                <div className="relative">
                                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                                    <input
                                                        type="password"
                                                        value={data.password_confirmation}
                                                        onChange={e => setData('password_confirmation', e.target.value)}
                                                        className="w-full bg-slate-50 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                                        placeholder="••••••••"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex flex-col gap-4">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                <LinkIcon className="h-5 w-5" />
                                                {processing ? 'Linking...' : 'Link Online Account'}
                                            </button>
                                            <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest font-bold">
                                                This will allow the customer to log in and view their billing history.
                                            </p>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                                        <ShieldCheck className="h-5 w-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-emerald-400">Account Linked Successfully</p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            This customer has an active online account. They can access the resident portal to view bills and pay online.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {customer.user_id && !isLinking && (
                        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-6 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-emerald-400">Account Linked</p>
                                <p className="text-xs text-slate-400 mt-1">
                                    This customer has an active online account. They can access the resident portal to view bills and pay online.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
