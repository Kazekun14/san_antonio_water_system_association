import { Head } from '@inertiajs/react';
import { Printer, ArrowLeft, CheckCircle, Droplets } from 'lucide-react';

interface Payment {
    id: number;
    method: string;
    status: string;
    reference_number?: string;
    transaction_id?: string;
    created_at: string;
    customer: { full_name: string; address: string };
    bill: { id: number; amount: string; billing_date: string; consumption: string };
}

interface Settings {
    barangay_name: string;
    barangay_address: string;
    contact_number: string;
}

export default function ReceiptShow({ payment, settings }: { payment: Payment; settings: Settings }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-8 flex flex-col items-center">
            <Head title={`Receipt #${payment.id}`} />

            <div className="w-full max-w-2xl flex justify-between items-center mb-6 no-print">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-bold text-white hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20"
                >
                    <Printer className="h-4 w-4" /> Print Receipt
                </button>
            </div>

            {/* Receipt Card */}
            <div className="w-full max-w-md bg-white text-slate-900 rounded-2xl shadow-2xl p-8 space-y-6 relative overflow-hidden print:shadow-none print:m-0 print:w-full">
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-teal-600" />

                <div className="text-center space-y-1">
                    <div className="flex justify-center mb-2">
                        <div className="h-12 w-12 rounded-xl bg-teal-600 flex items-center justify-center text-white">
                            <Droplets className="h-7 w-7" />
                        </div>
                    </div>
                    <h1 className="text-xl font-bold uppercase tracking-wide">{settings.barangay_name}</h1>
                    <p className="text-[10px] text-slate-500 font-medium px-8">{settings.barangay_address}</p>
                    <p className="text-[10px] text-slate-500 font-bold">CONTACT: {settings.contact_number}</p>
                </div>

                <div className="border-y border-slate-100 py-4 text-center">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">Official Receipt</p>
                    <h2 className="text-2xl font-black text-slate-900">₱{parseFloat(payment.bill.amount).toFixed(2)}</h2>
                </div>

                <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Receipt ID</span>
                        <span className="font-bold font-mono">#{payment.id.toString().padStart(6, '0')}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Payment Date</span>
                        <span className="font-bold">{new Date(payment.created_at).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400 font-medium">Payment Method</span>
                        <span className="font-bold uppercase">{payment.method}</span>
                    </div>
                    {(payment.reference_number || payment.transaction_id) && (
                        <div className="flex justify-between border-t border-slate-50 pt-2 mt-1">
                            <span className="text-slate-400 font-medium">Reference No.</span>
                            <span className="font-bold font-mono text-[10px]">{payment.reference_number || payment.transaction_id}</span>
                        </div>
                    )}
                </div>

                <div className="space-y-4 pt-2">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-1">Customer Info</h3>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-slate-400 font-medium">Customer</span>
                            <span className="font-bold">{payment.customer.full_name}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-2">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-1">Bill Details</h3>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                            <span className="text-slate-400 font-medium">Bill ID</span>
                            <span className="font-bold">#{payment.bill.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-400 font-medium">Consumption</span>
                            <span className="font-bold">{payment.bill.consumption} m³</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-dashed border-slate-100">
                            <span className="text-slate-900 font-black">TOTAL PAID</span>
                            <span className="text-slate-900 font-black">₱{parseFloat(payment.bill.amount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-6 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black border border-emerald-100">
                        <CheckCircle className="h-3 w-3" /> PAYMENT PAID
                    </div>
                    <p className="text-[9px] text-slate-400 italic">This serves as an official proof of payment for the services rendered by {settings.barangay_name}. Thank you!</p>
                </div>

                {/* Footer bar */}
                <div className="flex justify-between pt-4 opacity-10">
                    <Droplets className="h-8 w-8 text-slate-900" />
                    <Droplets className="h-8 w-8 text-slate-900" />
                    <Droplets className="h-8 w-8 text-slate-900" />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                }
            `}} />
        </div>
    );
}
