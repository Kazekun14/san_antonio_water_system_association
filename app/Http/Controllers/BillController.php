<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\Bill;
use Illuminate\Support\Facades\Auth;

class BillController extends Controller
{
    public function index()
    {
        $customer = Auth::user()->customer;

        if (!$customer) {
            return Inertia::render('bills/index', ['bills' => []]);
        }

        $bills = Bill::where('customer_id', $customer->id)
            ->orderBy('billing_date', 'desc')
            ->get();

        return Inertia::render('bills/index', [
            'bills' => $bills
        ]);
    }

    public function show(Request $request, Bill $bill)
    {
        $customer = Auth::user()->customer;

        if (!$customer || $bill->customer_id !== $customer->id) {
            abort(403);
        }

        // --- Simulation Mode Success Handling ---
        if ($request->query('simulated') === 'true' && $request->query('payment') === 'success') {
            $latestPayment = $bill->payments()->where('status', 'pending')->latest()->first();
            if ($latestPayment) {
                $latestPayment->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                ]);
                $bill->update(['status' => 'paid']);
                
                // Also update customer balance
                $customer->decrement('balance', $latestPayment->amount);

                // Notify Admins and Staff (Simulation)
                $adminsAndStaff = \App\Models\User::whereIn('role', ['admin', 'staff'])->get();
                $simNotify = new \App\Notifications\AdminNotification(
                    'payment',
                    'Online Payment Received (Simulated)',
                    "A simulated payment of ₱" . number_format($latestPayment->amount, 2) . " from {$customer->first_name} {$customer->last_name} was successful.",
                    ['payment_id' => $latestPayment->id]
                );
                foreach ($adminsAndStaff as $recipient) {
                    $recipient->notify($simNotify);
                }
            }
        }

        // Mark bill as seen the first time the customer views it
        if (is_null($bill->seen_at)) {
            $bill->update(['seen_at' => now()]);
        }

        $bill->load('payments');

        return Inertia::render('bills/show', [
            'bill' => $bill
        ]);
    }
}
