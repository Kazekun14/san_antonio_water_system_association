import AdminLayout from '@/layouts/admin-layout';
import { Head, useForm, Link } from '@inertiajs/react';
import { Users, Save, X, ArrowLeft, Home, Phone, User as UserIcon, Shield, WifiOff, Activity, Map, Hash, Gauge, Mail, Lock } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        first_name: '',
        last_name: '',
        household_address: '',
        purok: '',
        phone_number: '',
        meter_number: '',
        username: '',
        initial_reading: '0',
        email: '',
        access_type: 'physical_only',
        connection_status: 'active',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/customers');
    };

    return (
        <AdminLayout title="Add New Customer">
            <Head title="Add Customer" />

            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <Link
                        href="/admin/customers"
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span className="text-sm font-bold">Back to Customers</span>
                    </Link>
                </div>

                <div className="bg-slate-900/50 border border-slate-800/50 rounded-[2.5rem] p-8 shadow-xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                            <Users className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Customer Information</h2>
                            <p className="text-slate-400 text-sm">Create a new customer record for billing and water service management.</p>
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
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Household Address</label>
                                <div className="relative">
                                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                    <input
                                        type="text"
                                        value={data.household_address}
                                        onChange={e => setData('household_address', e.target.value)}
                                        className="w-full bg-slate-50 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        placeholder="House No., Street, or Landmark"
                                    />
                                </div>
                                {errors.household_address && <p className="text-rose-400 text-xs font-bold mt-1 ml-1">{errors.household_address}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.initial_reading && <p className="text-rose-400 text-xs font-bold mt-1 ml-1">{errors.initial_reading}</p>}
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
                                            className="w-full bg-slate-50 border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                                            placeholder="Enter a username for login"
                                            required
                                        />
                                    </div>
                                    {errors.username && <p className="text-rose-400 text-xs font-bold mt-1 ml-1">{errors.username}</p>}
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
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
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

                        <div className="pt-4 flex gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                <Save className="h-5 w-5" />
                                {processing ? 'Creating...' : 'Create Customer Record'}
                            </button>
                            <Link
                                href="/admin/customers"
                                className="px-8 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
