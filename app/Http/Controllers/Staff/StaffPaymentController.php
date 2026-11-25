<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StaffPaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with(['customer', 'bill'])->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('customer', function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        $payments = $query->paginate(15)->withQueryString();

        return Inertia::render('staff/payments/index', [
            'payments' => $payments,
            'filters'  => $request->only(['status', 'search']),
        ]);
    }

    public function recordCash(Request $request)
    {
        $request->validate([
            'bill_id' => ['required', 'exists:bills,id'],
        ]);

        $bill = Bill::with('customer')->findOrFail($request->bill_id);

        if ($bill->status === 'paid') {
            return back()->with('error', 'This bill has already been paid.');
        }

        // Check for existing pending payment
        $existing = Payment::where('bill_id', $bill->id)->whereIn('status', ['pending', 'pending_cash'])->first();
        if ($existing) {
            return back()->with('error', 'There is already a pending payment for this bill.');
        }

        $payment = Payment::create([
            'customer_id'    => $bill->customer_id,
            'bill_id'        => $bill->id,
            'payment_method' => 'cash',
            'amount'         => $bill->amount,
            'status'         => 'paid',
            'paid_at'        => now(),
        ]);

        // Immediately mark bill as paid for cash payments
        $bill->update(['status' => 'paid']);

        // Update customer balance
        $bill->customer->decrement('balance', $bill->amount);

        return redirect()->route('staff.receipts.show', $payment->id)
            ->with('success', 'Cash payment recorded. Bill marked as paid.');
    }

    public function verify(Request $request, Payment $payment)
    {
        $request->validate([
            'action' => ['required', 'in:paid,failed'],
        ]);

        $status = $request->action;
        $payment->update([
            'status' => $status,
            'paid_at' => $status === 'paid' ? now() : null,
        ]);

        if ($status === 'paid') {
            $payment->bill()->update(['status' => 'paid']);
            // Update customer balance
            $customer = $payment->customer;
            if ($customer) {
                $customer->decrement('balance', $payment->amount);
            }
        }

        $msg = $status === 'paid'
            ? 'Payment confirmed as paid. Bill marked as paid.'
            : 'Payment marked as failed.';

        return back()->with('success', $msg);
    }
}
