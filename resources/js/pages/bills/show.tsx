import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FileText, CreditCard, AlertCircle, CheckCircle2, Wallet, Info } from 'lucide-react';
import { FormEventHandler } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

interface Payment {
    id: number;
    payment_method: string;
    status: string;
    reference_number?: string;
    amount: string;
    created_at: string;
}

interface Bill {
    id: number;
    billing_date: string;
    consumption: string;
    amount: string;
    status: string;
    due_date: string;
    payments?: Payment[];
}

interface PageProps {
    bill: Bill;
    flash: {
        success?: string;
        error?: string;
        cash_payment?: {
            reference_number: string;
            amount: string;
            instructions: string;
        };
    };
}

export default function BillShow() {
    const { bill, flash } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'My Bills', href: '/bills' },
        { title: `Bill #${bill.id}`, href: `/bills/${bill.id}` },
    ];

    const { data, setData, post, processing, errors } = useForm({
        bill_id: bill.id,
        payment_method: 'gcash',
    });

    // Mock calculations (as requested dynamically instead of DB columns)
    const baseRate = 200.00; 
    const consumptionRate = parseFloat(bill.consumption) * 15.00; // 15 per cubic meter
    const penalty = bill.status === 'overdue' ? 50.00 : 0.00;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('payments.store'));
    };

    const pendingCashPayment = bill.payments?.find(p => p.status === 'pending_cash');
    const hasPendingOnlinePayment = bill.payments?.some(p => p.status === 'pending');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Bill Details #${bill.id}`} />
            
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-6 bg-slate-50 dark:bg-neutral-950">
                {flash?.success && (
                    <div className="rounded-lg bg-green-50 p-4 border border-green-200 dark:bg-green-900/20 dark:border-green-900/50 flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-green-800 dark:text-green-400">{flash.success}</p>
                        </div>
                    </div>
                )}

                {flash?.error && (
                    <div className="rounded-lg bg-red-50 p-4 border border-red-200 dark:bg-red-900/20 dark:border-red-900/50 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-red-800 dark:text-red-400">{flash.error}</p>
                        </div>
                    </div>
                )}

                {flash?.cash_payment && (
                    <div className="rounded-lg bg-blue-50 p-6 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/50 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-2 mb-4">
                            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300">Cash Payment Instructions</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center p-3 bg-white dark:bg-neutral-900 rounded-lg border border-blue-100 dark:border-blue-800">
                                <span className="text-sm text-neutral-500">Reference Number:</span>
                                <span className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400 tracking-wider">{flash.cash_payment.reference_number}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-white dark:bg-neutral-900 rounded-lg border border-blue-100 dark:border-blue-800">
                                <span className="text-sm text-neutral-500">Amount to Pay:</span>
                                <span className="text-xl font-bold text-neutral-900 dark:text-white">₱{parseFloat(flash.cash_payment.amount).toFixed(2)}</span>
                            </div>
                            <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed italic">
                                {flash.cash_payment.instructions}
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Bill Details */}
                    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center gap-2 mb-6 border-b border-neutral-100 pb-4 dark:border-neutral-800">
                            <FileText className="w-6 h-6 text-blue-500" />
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Bill Summary</h2>
                            <span className={`ml-auto inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                bill.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                bill.status === 'unpaid' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                                {bill.status.toUpperCase()}
                            </span>
                        </div>

                        <div className="space-y-4 text-sm text-neutral-600 dark:text-neutral-300">
                            <div className="flex justify-between">
                                <span>Billing Date</span>
                                <span className="font-medium text-neutral-900 dark:text-neutral-100">{new Date(bill.billing_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Due Date</span>
                                <span className="font-medium text-neutral-900 dark:text-neutral-100">{new Date(bill.due_date).toLocaleDateString()}</span>
                            </div>
                            <div className="border-t border-dashed border-neutral-200 py-4 dark:border-neutral-800">
                                <div className="flex justify-between mb-2">
                                    <span>Consumption ({bill.consumption} m³)</span>
                                    <span className="font-medium text-neutral-900 dark:text-neutral-100">₱{consumptionRate.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span>Base Rate</span>
                                    <span className="font-medium text-neutral-900 dark:text-neutral-100">₱{baseRate.toFixed(2)}</span>
                                </div>
                                {penalty > 0 && (
                                    <div className="flex justify-between mb-2 text-red-600 dark:text-red-400">
                                        <span>Penalty (Overdue)</span>
                                        <span className="font-medium">₱{penalty.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800">
                                <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Total Amount</span>
                                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₱{parseFloat(bill.amount).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="flex items-center gap-2 mb-6 border-b border-neutral-100 pb-4 dark:border-neutral-800">
                            <CreditCard className="w-6 h-6 text-blue-500" />
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Make a Payment</h2>
                        </div>

                        {bill.status === 'paid' ? (
                            <div className="flex flex-col items-center justify-center p-6 text-center">
                                <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                                    <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="mt-4 font-semibold text-neutral-900 dark:text-neutral-100">Bill Fully Paid</h3>
                                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Thank you for your payment.</p>
                            </div>
                        ) : pendingCashPayment ? (
                            <div className="flex flex-col items-center justify-center p-6 text-center">
                                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
                                    <Info className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="mt-4 font-semibold text-neutral-900 dark:text-neutral-100">Pending Cash Confirmation</h3>
                                <div className="mt-4 w-full p-4 bg-slate-50 dark:bg-neutral-800 rounded-xl space-y-2">
                                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Reference Number</p>
                                    <p className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">{pendingCashPayment.reference_number}</p>
                                </div>
                                <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                    Please proceed to the office with this reference number to complete your payment.
                                </p>
                            </div>
                        ) : hasPendingOnlinePayment ? (
                            <div className="flex flex-col items-center justify-center p-6 text-center">
                                <div className="rounded-full bg-amber-100 p-3 dark:bg-amber-900/30">
                                    <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                                </div>
                                <h3 className="mt-4 font-semibold text-neutral-900 dark:text-neutral-100">Online Payment Processing</h3>
                                <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">Your online payment is currently being processed. This may take a few minutes.</p>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-neutral-700 dark:text-neutral-300">Choose Payment Method</Label>
                                    <div className="grid grid-cols-1 gap-3">
                                        <label className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${
                                            data.payment_method === 'gcash' 
                                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:bg-blue-500/10' 
                                            : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:bg-neutral-800/50'
                                        }`}>
                                            <input 
                                                type="radio" 
                                                name="payment_method" 
                                                value="gcash" 
                                                className="sr-only"
                                                checked={data.payment_method === 'gcash'}
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                            />
                                            <div className={`rounded-lg p-2 ${data.payment_method === 'gcash' ? 'bg-blue-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                                                <Wallet className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-neutral-900 dark:text-white">GCash</p>
                                                <p className="text-xs text-neutral-500">Pay instantly via GCash wallet</p>
                                            </div>
                                            {data.payment_method === 'gcash' && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
                                        </label>

                                        <label className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${
                                            data.payment_method === 'paymaya' 
                                            ? 'border-green-500 bg-green-50 ring-1 ring-green-500 dark:bg-green-500/10' 
                                            : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:bg-neutral-800/50'
                                        }`}>
                                            <input 
                                                type="radio" 
                                                name="payment_method" 
                                                value="paymaya" 
                                                className="sr-only"
                                                checked={data.payment_method === 'paymaya'}
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                            />
                                            <div className={`rounded-lg p-2 ${data.payment_method === 'paymaya' ? 'bg-green-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                                                <Wallet className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-neutral-900 dark:text-white">Maya</p>
                                                <p className="text-xs text-neutral-500">Pay via Maya wallet or Card</p>
                                            </div>
                                            {data.payment_method === 'paymaya' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                                        </label>

                                        <label className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-all ${
                                            data.payment_method === 'cash' 
                                            ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:bg-blue-500/10' 
                                            : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-800 dark:hover:bg-neutral-800/50'
                                        }`}>
                                            <input 
                                                type="radio" 
                                                name="payment_method" 
                                                value="cash" 
                                                className="sr-only"
                                                checked={data.payment_method === 'cash'}
                                                onChange={(e) => setData('payment_method', e.target.value)}
                                            />
                                            <div className={`rounded-lg p-2 ${data.payment_method === 'cash' ? 'bg-blue-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                                                <CreditCard className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-bold text-neutral-900 dark:text-white">Cash over Counter</p>
                                                <p className="text-xs text-neutral-500">Generate reference and pay at office</p>
                                            </div>
                                            {data.payment_method === 'cash' && <CheckCircle2 className="h-5 w-5 text-blue-600" />}
                                        </label>
                                    </div>
                                    <InputError message={errors.payment_method} />
                                </div>

                                <Button type="submit" disabled={processing} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-bold rounded-xl shadow-lg shadow-blue-500/20">
                                    {processing ? 'Processing...' : 'Proceed to Payment'}
                                </Button>
                                
                                <div className="flex items-center gap-2 justify-center text-xs text-neutral-400">
                                    <Info className="w-3 h-3" />
                                    <span>Secure payment powered by PayMongo</span>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
