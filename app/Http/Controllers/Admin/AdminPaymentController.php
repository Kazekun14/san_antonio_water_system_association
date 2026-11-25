<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Bill;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Notifications\AdminNotification;

class AdminPaymentController extends Controller
{
    public function index()
    {
        $cashPayments = Payment::where('payment_method', 'cash')
            ->where('status', 'pending_cash')
            ->with(['customer', 'bill'])
            ->orderBy('created_at', 'desc')
            ->get();

        $allPayments = Payment::with(['customer', 'bill'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('admin/payments/index', [
            'cashPayments' => $cashPayments,
            'allPayments' => $allPayments,
        ]);
    }

    public function confirmCash(Payment $payment)
    {
        if ($payment->payment_method !== 'cash' || $payment->status !== 'pending_cash') {
            return back()->with('error', 'Invalid payment record.');
        }

        $payment->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        $bill = $payment->bill;
        $bill->update(['status' => 'paid']);

        $customer = $payment->customer;
        if ($customer) {
            $customer->decrement('balance', $payment->amount);
        }

        // Notify Admins and Staff
        $adminsAndStaff = User::whereIn('role', ['admin', 'staff'])->get();
        $paymentNotify = new AdminNotification(
            'payment',
            'Payment Confirmed',
            "A cash payment of ₱" . number_format($payment->amount, 2) . " for " . ($customer->first_name ?? 'a customer') . " has been verified.",
            ['payment_id' => $payment->id]
        );
        foreach ($adminsAndStaff as $recipient) {
            $recipient->notify($paymentNotify);
        }

        return back()->with('success', 'Cash payment confirmed successfully.');
    }

    public function rejectCash(Payment $payment)
    {
        if ($payment->payment_method !== 'cash' || $payment->status !== 'pending_cash') {
            return back()->with('error', 'Invalid payment record.');
        }

        $payment->update([
            'status' => 'failed',
        ]);

        return back()->with('success', 'Cash payment rejected.');
    }
}
