import { Head } from '@inertiajs/react';
import { Printer, ArrowLeft, Droplets, Calendar, User, FileText, MapPin, Phone } from 'lucide-react';

interface Bill {
    id: number;
    billing_date: string;
    due_date: string;
    consumption: string;
    amount: string;
    status: string;
    customer: { 
        full_name: string; 
        address: string;
        meter_number?: string;
    };
    payments?: {
        reference_number: string;
        transaction_id: string;
        payment_method: string;
    }[];
}

interface Settings {
    barangay_name: string;
    barangay_address: string;
    contact_number: string;
    base_rate: number;
    rate_per_cubic_meter: number;
    penalty_amount: number;
}

export default function BillShow({ bill, settings }: { bill: Bill; settings: Settings }) {
    const handlePrint = () => {
        window.print();
    };

    const baseAmount = Number(settings.base_rate);
    const consumptionAmount = Number(bill.consumption) * Number(settings.rate_per_cubic_meter);
    const penaltyAmount = bill.status === 'overdue' ? Number(settings.penalty_amount) : 0;

    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-8 flex flex-col items-center">
            <Head title={`Bill #${bill.id} - ${bill.customer.full_name}`} />

            <div className="w-full max-w-2xl flex justify-between items-center mb-6 no-print">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to List
                </button>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                    <Printer className="h-4 w-4" /> Print Bill
                </button>
            </div>

            {/* Bill Paper */}
            <div className="w-full max-w-2xl bg-white text-slate-900 shadow-2xl relative overflow-hidden print:shadow-none print:m-0 print:w-full min-h-[842px] flex flex-col">
                {/* Header Decoration */}
                <div className="h-2 bg-blue-600 w-full" />
                
                <div className="p-10 flex-1 flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-10">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                                    <Droplets className="h-6 w-6" />
                                </div>
                                <h1 className="text-xl font-black uppercase tracking-tighter text-blue-600">San Antonio Water</h1>
                            </div>
                            <p className="text-sm font-bold text-slate-800">{settings.barangay_name}</p>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                <MapPin className="h-3 w-3" /> {settings.barangay_address}
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                <Phone className="h-3 w-3" /> {settings.contact_number}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="inline-block px-4 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest mb-2">
                                Statement of Account
                            </div>
                            <h2 className="text-3xl font-black text-slate-900">#{bill.id.toString().padStart(6, '0')}</h2>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Bill Number</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-10 mb-10">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 flex items-center gap-2">
                                <User className="h-3 w-3" /> Billed To
                            </h3>
                            <div className="space-y-1">
                                <p className="text-lg font-black text-slate-900">{bill.customer.full_name}</p>
                                <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">
                                    {bill.customer.address || 'No address provided'}
                                </p>
                                <p className="text-[10px] font-mono text-blue-600 font-bold mt-1">@{bill.customer.meter_number}</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2 flex items-center gap-2">
                                <Calendar className="h-3 w-3" /> Important Dates
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Billing Date</p>
                                    <p className="text-sm font-black text-slate-900">{new Date(bill.billing_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-red-400 font-bold uppercase mb-1">Due Date</p>
                                    <p className="text-sm font-black text-red-600">{new Date(bill.due_date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bill Breakdown */}
                    <div className="flex-1">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="px-4 py-3 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                                    <th className="px-4 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity/Unit</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate</th>
                                    <th className="px-4 py-3 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                <tr>
                                    <td className="px-4 py-6">
                                        <p className="text-sm font-black text-slate-900">Base Water Service Fee</p>
                                        <p className="text-[10px] text-slate-500 font-medium">Standard monthly connection fee</p>
                                    </td>
                                    <td className="px-4 py-6 text-center text-sm font-medium text-slate-600">1 unit</td>
                                    <td className="px-4 py-6 text-right text-sm font-medium text-slate-600">₱{baseAmount.toFixed(2)}</td>
                                    <td className="px-4 py-6 text-right text-sm font-black text-slate-900">₱{baseAmount.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-6">
                                        <p className="text-sm font-black text-slate-900">Water Consumption</p>
                                        <p className="text-[10px] text-slate-500 font-medium">Usage based on meter reading</p>
                                    </td>
                                    <td className="px-4 py-6 text-center text-sm font-medium text-slate-600">{bill.consumption} m³</td>
                                    <td className="px-4 py-6 text-right text-sm font-medium text-slate-600">₱{Number(settings.rate_per_cubic_meter).toFixed(2)}/m³</td>
                                    <td className="px-4 py-6 text-right text-sm font-black text-slate-900">₱{consumptionAmount.toFixed(2)}</td>
                                </tr>
                                {penaltyAmount > 0 && (
                                    <tr>
                                        <td className="px-4 py-6">
                                            <p className="text-sm font-black text-red-600">Late Payment Penalty</p>
                                            <p className="text-[10px] text-slate-500 font-medium">Applied for overdue statements</p>
                                        </td>
                                        <td className="px-4 py-6 text-center text-sm font-medium text-slate-600">-</td>
                                        <td className="px-4 py-6 text-right text-sm font-medium text-slate-600">-</td>
                                        <td className="px-4 py-6 text-right text-sm font-black text-red-600">₱{penaltyAmount.toFixed(2)}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="mt-10 pt-10 border-t-2 border-slate-900 flex justify-between items-end">
                        <div className="space-y-4 max-w-[300px]">
                            <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                                <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <FileText className="h-3 w-3" /> Payment Instructions
                                </h4>
                                <p className="text-[9px] text-amber-700 leading-relaxed font-medium">
                                    Please settle this bill on or before the due date to avoid service interruption and late payment penalties. You can pay via GCash, Maya, or visit the Barangay Hall for cash payments.
                                </p>
                            </div>
                        </div>
                        <div className="text-right space-y-2">
                            {bill.payments && bill.payments[0] && (
                                <div className="mb-4 text-right">
                                    <p className="text-[9px] text-blue-500 font-bold uppercase mb-1">Payment Reference</p>
                                    <p className="text-xs font-black text-slate-900 font-mono">
                                        {bill.payments[0].reference_number || bill.payments[0].transaction_id}
                                    </p>
                                    <p className="text-[8px] text-slate-400 uppercase font-bold">{bill.payments[0].payment_method}</p>
                                </div>
                            )}
                            <div className="flex justify-between gap-10 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <span>Grand Total</span>
                                <span className="text-slate-900">₱{Number(bill.amount).toFixed(2)}</span>
                            </div>
                            <div className="pt-2">
                                <p className="text-[9px] text-slate-400 font-bold uppercase mb-1">Amount Due</p>
                                <p className="text-4xl font-black text-blue-600 tracking-tighter">₱{Number(bill.amount).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-10 pt-10 border-t border-slate-100 flex justify-between items-center opacity-50 grayscale">
                        <div className="flex gap-4">
                            <Droplets className="h-6 w-6 text-blue-600" />
                            <div className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em]">
                                SAN ANTONIO WATER<br />SYSTEM OPERATIONS
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[8px] font-black text-slate-900 uppercase">Generated on {new Date().toLocaleString()}</p>
                            <p className="text-[7px] text-slate-400">System generated document. No signature required.</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Decoration */}
                <div className="h-2 bg-slate-900 w-full" />
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; padding: 0 !important; }
                    .min-h-screen { background: white !important; min-height: auto !important; padding: 0 !important; display: block !important; }
                    .w-full { max-width: 100% !important; margin: 0 !important; }
                    .shadow-2xl { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
                }
            `}} />
        </div>
    );
}
