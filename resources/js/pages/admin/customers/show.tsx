import AdminLayout from '@/layouts/admin-layout';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, ArrowLeft, Mail, Phone, MapPin, Hash, 
    Gauge, Activity, CreditCard, Receipt, FileText,
    History, CheckCircle2, AlertCircle, Clock,
    TrendingUp, Droplets, Calendar, Download, Eye, Map
} from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { useState } from 'react';

interface Bill {
    id: number;
    billing_date: string;
    consumption: number;
    amount: number;
    status: string;
    due_date: string;
}

interface Payment {
    id: number;
    reference_number: string;
    payment_method: string;
    amount: number;
    status: string;
    paid_at: string;
}

interface Reading {
    id: number;
    meter_reading: number;
    reading_date: string;
}

interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;

    house_address: string;
    phone_number: string;
    email: string | null;
    purok: string | null;
    meter_number: string;
    balance: number;
    access_type: string;
    connection_status: string;
    user?: {
        email: string;
        username: string;
    };
}

interface Props {
    customer: Customer;
    bills: Bill[];
    payments: Payment[];
    readings: Reading[];
}

export default function Show({ customer, bills, payments, readings }: Props) {
    const [activeTab, setActiveTab] = useState('overview');

    // Prepare chart data (Usage History)
    const chartData = readings.slice(-12).map(r => ({
        date: new Date(r.reading_date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        value: r.meter_reading
    }));

    // Calculate consumption from readings
    const consumptionData = readings.slice(1).map((r, i) => ({
        date: new Date(r.reading_date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        consumption: r.meter_reading - readings[i].meter_reading
    })).slice(-12);

    const unpaidBills = bills.filter(b => b.status === 'unpaid' || b.status === 'overdue');
    const paidBills = bills.filter(b => b.status === 'paid');

    return (
        <AdminLayout title={`Customer: ${customer.full_name}`}>
            <Head title={`Profile - ${customer.full_name}`} />

            <div className="space-y-6">
                {/* Navigation & Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/customers"
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">{customer.full_name}</h2>
                            <p className="text-slate-400 text-sm font-mono mt-0.5 flex items-center gap-2">
                                {customer.user?.username ? `@${customer.user.username}` : `Meter: ${customer.meter_number}`} 
                                <span className="text-slate-600">•</span>
                                <span className={`flex items-center gap-1.5 ${customer.connection_status === 'active' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    <Activity className="h-3 w-3" /> {customer.connection_status === 'active' ? 'Active' : 'Inactive'}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={`/admin/customers/${customer.id}/edit`}
                            className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-2xl font-bold transition-all text-sm flex items-center gap-2"
                        >
                            Edit Profile
                        </Link>
                    </div>
                </div>

                {/* Main Dashboard Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column: Essential Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Balance Card */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 shadow-xl shadow-blue-600/20 relative overflow-hidden group">
                            <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <CreditCard className="w-64 h-64 rotate-12" />
                            </div>
                            <div className="relative z-10">
                                <p className="text-blue-100 text-xs font-bold uppercase tracking-widest opacity-80">Current Outstanding Balance</p>
                                <h3 className="text-4xl font-black text-white mt-2 tracking-tighter">
                                    ₱{parseFloat(customer.balance.toString()).toLocaleString()}
                                </h3>
                                <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
                                    <div className="text-white/80 text-xs font-medium">
                                        <p>{unpaidBills.length} Unpaid Bills</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${customer.balance > 0 ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                                        {customer.balance > 0 ? 'Action Required' : 'Cleared'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Customer Details */}
                        <div className="bg-slate-900/50 border border-slate-800/50 rounded-[2.5rem] p-8 space-y-8">
                            <div>
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-5">Personal Information</h4>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                                            <MapPin className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">Physical Address</p>
                                            <p className="text-sm text-slate-200 mt-0.5 leading-relaxed">{customer.house_address}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                                            <Phone className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">Contact Number</p>
                                            <p className="text-sm text-slate-200 mt-0.5">{customer.phone_number}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                                            <Mail className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">Email Address</p>
                                            <p className="text-sm text-slate-200 mt-0.5">{customer.email || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-800/50">
                                <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-5">Meter Configuration</h4>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 text-blue-400">
                                            <Hash className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">Meter Number</p>
                                            <p className="text-sm text-white font-mono mt-0.5">{customer.meter_number}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0 text-blue-400">
                                            <Map className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">Purok / Zone</p>
                                            <p className="text-sm text-white mt-0.5">{customer.purok || 'Unassigned'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 text-emerald-400">
                                            <Gauge className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase">Last Meter Reading</p>
                                            <p className="text-sm text-white mt-0.5">{readings.length > 0 ? readings[readings.length-1].meter_reading : 0} m³</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Dynamic Tabs & History */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Usage Chart Section */}
                        <div className="bg-slate-900/50 border border-slate-800/50 rounded-[2.5rem] p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h4 className="text-white font-bold flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-blue-400" /> Consumption History
                                    </h4>
                                    <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mt-1">Water usage trends (m³)</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 font-bold">AVG. MONTHLY</p>
                                    <p className="text-lg font-black text-white">
                                        {consumptionData.length > 0 
                                            ? (consumptionData.reduce((acc, curr) => acc + curr.consumption, 0) / consumptionData.length).toFixed(2)
                                            : 0} m³
                                    </p>
                                </div>
                            </div>
                            
                            <div className="h-[250px] w-full mt-4">
                                {consumptionData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={consumptionData}>
                                            <defs>
                                                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                            <XAxis 
                                                dataKey="date" 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                                dy={10}
                                            />
                                            <YAxis 
                                                axisLine={false} 
                                                tickLine={false} 
                                                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                            />
                                            <Tooltip 
                                                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }}
                                                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                                            />
                                            <Area 
                                                type="monotone" 
                                                dataKey="consumption" 
                                                stroke="#3b82f6" 
                                                strokeWidth={3}
                                                fillOpacity={1} 
                                                fill="url(#colorUsage)" 
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-600 bg-slate-950/50 rounded-3xl border border-dashed border-slate-800">
                                        <Droplets className="w-12 h-12 mb-3 opacity-20" />
                                        <p className="text-sm font-bold">No consumption history yet</p>
                                        <p className="text-xs">Usage data will appear after the next billing cycle.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tabs Section */}
                        <div className="bg-slate-900/50 border border-slate-800/50 rounded-[2.5rem] overflow-hidden">
                            <div className="flex border-b border-slate-800/50 p-2">
                                {[
                                    { id: 'bills', label: 'Bills', icon: FileText },
                                    { id: 'payments', label: 'Payments', icon: Receipt },
                                    { id: 'history', label: 'Readings', icon: Gauge },
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                                    >
                                        <tab.icon className="h-4 w-4" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="p-8">
                                {/* Bills Tab */}
                                {activeTab === 'bills' && (
                                    <div className="space-y-6">
                                        {bills.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="border-b border-slate-800">
                                                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Billing Date</th>
                                                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Consumption</th>
                                                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                                                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                                            <th className="pb-4 text-right"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-800/50">
                                                        {bills.map(bill => (
                                                            <tr key={bill.id} className="group hover:bg-slate-800/20 transition-colors">
                                                                <td className="py-4">
                                                                    <div className="flex items-center gap-3">
                                                                        <Calendar className="h-4 w-4 text-slate-500" />
                                                                        <span className="text-sm font-bold text-slate-200">{new Date(bill.billing_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 text-sm font-mono text-slate-400">{bill.consumption} m³</td>
                                                                <td className="py-4 text-sm font-black text-white">₱{bill.amount.toLocaleString()}</td>
                                                                <td className="py-4">
                                                                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter border ${bill.status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                                                                        {bill.status}
                                                                    </span>
                                                                </td>
                                                                <td className="py-4 text-right">
                                                                    <Link href={`/admin/bills/${bill.id}`} className="p-2 hover:bg-slate-800 rounded-lg inline-block text-slate-400 hover:text-white transition-all">
                                                                        <Eye className="h-4 w-4" />
                                                                    </Link>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-10">
                                                <FileText className="w-12 h-12 text-slate-800 mx-auto mb-3" />
                                                <p className="text-sm font-bold text-slate-500">No billing records found</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Payments Tab */}
                                {activeTab === 'payments' && (
                                    <div className="space-y-6">
                                        {payments.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="border-b border-slate-800">
                                                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Paid At</th>
                                                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Reference</th>
                                                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Method</th>
                                                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-800/50">
                                                        {payments.map(payment => (
                                                            <tr key={payment.id} className="hover:bg-slate-800/20 transition-colors">
                                                                <td className="py-4">
                                                                    <p className="text-sm font-bold text-slate-200">{new Date(payment.paid_at).toLocaleDateString()}</p>
                                                                    <p className="text-[10px] text-slate-500">{new Date(payment.paid_at).toLocaleTimeString()}</p>
                                                                </td>
                                                                <td className="py-4 text-sm font-mono text-blue-400 uppercase">{payment.reference_number}</td>
                                                                <td className="py-4">
                                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-800 px-2 py-1 rounded-md">{payment.payment_method}</span>
                                                                </td>
                                                                <td className="py-4 text-sm font-black text-emerald-400">₱{parseFloat(payment.amount.toString()).toLocaleString()}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-10">
                                                <Receipt className="w-12 h-12 text-slate-800 mx-auto mb-3" />
                                                <p className="text-sm font-bold text-slate-500">No payment history found</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Readings Tab */}
                                {activeTab === 'history' && (
                                    <div className="space-y-6">
                                        {readings.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="border-b border-slate-800">
                                                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Reading Date</th>
                                                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Meter Value</th>
                                                            <th className="pb-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Notes</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-800/50">
                                                        {readings.slice().reverse().map(reading => (
                                                            <tr key={reading.id} className="hover:bg-slate-800/20 transition-colors">
                                                                <td className="py-4 text-sm font-bold text-slate-200">{new Date(reading.reading_date).toLocaleDateString('en-US', { dateStyle: 'full' })}</td>
                                                                <td className="py-4 text-sm font-mono font-black text-white">{reading.meter_reading} m³</td>
                                                                <td className="py-4 text-xs text-slate-500 italic">Verified reading</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <div className="text-center py-10">
                                                <Gauge className="w-12 h-12 text-slate-800 mx-auto mb-3" />
                                                <p className="text-sm font-bold text-slate-500">No readings recorded</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
