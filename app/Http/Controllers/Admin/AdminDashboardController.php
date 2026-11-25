<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\Payment;
use App\Models\User;
use App\Models\Customer;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $totalCustomers  = Customer::count();
        $totalStaff      = User::where('role', 'staff')->count();
        $totalRevenue    = Bill::where('status', 'paid')->sum('amount');
        $unpaidBills     = Bill::where('status', 'unpaid')->count();
        $overdueBills    = Bill::where('status', 'overdue')->count();
        $pendingPayments = Payment::where('status', 'pending')->count();

        $recentPayments = Payment::with(['customer', 'bill'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $recentBills = Bill::with('customer')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalCustomers'  => $totalCustomers,
                'totalStaff'      => $totalStaff,
                'totalAccounts'   => User::count(),
                'totalRevenue'    => $totalRevenue,
                'unpaidBills'     => $unpaidBills,
                'overdueBills'    => $overdueBills,
                'pendingPayments' => $pendingPayments,
            ],
            'recentPayments' => $recentPayments,
            'recentBills'    => $recentBills,
        ]);
    }
}
