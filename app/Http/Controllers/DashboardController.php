<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\Bill;
use App\Models\Payment;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $customer = $user->customer;

        if (!$customer) {
            return Inertia::render('dashboard', [
                'currentBill'       => null,
                'totalUnpaidAmount' => 0,
                'totalUnpaidBills'  => 0,
                'lastPayment'       => null,
            ]);
        }

        $currentBill = Bill::where('customer_id', $customer->id)
            ->where('status', 'unpaid')
            ->orderBy('due_date', 'asc')
            ->first();

        $totalUnpaidAmount = Bill::where('customer_id', $customer->id)
            ->where('status', 'unpaid')
            ->sum('amount');

        $totalUnpaidBills = Bill::where('customer_id', $customer->id)
            ->where('status', 'unpaid')
            ->count();

        $lastPayment = Payment::where('customer_id', $customer->id)
            ->where('status', 'paid')
            ->orderBy('created_at', 'desc')
            ->with('bill')
            ->first();

        return Inertia::render('dashboard', [
            'currentBill'       => $currentBill,
            'totalUnpaidAmount' => $totalUnpaidAmount,
            'totalUnpaidBills'  => $totalUnpaidBills,
            'lastPayment'       => $lastPayment,
        ]);
    }
}
