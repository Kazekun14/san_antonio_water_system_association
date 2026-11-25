<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\Payment;
use App\Models\User;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        $totalRevenue    = Bill::where('status', 'paid')->sum('amount');
        $totalUnpaid     = Bill::whereIn('status', ['unpaid', 'overdue'])->sum('amount');
        $paidBillsCount  = Bill::where('status', 'paid')->count();
        $unpaidBillsCount = Bill::whereIn('status', ['unpaid', 'overdue'])->count();
        $totalCustomers  = User::where('role', 'customer')->count();
        $confirmedPayments = Payment::where('status', 'paid')->count();
        $pendingPayments   = Payment::where('status', 'pending')->count();

        // Monthly revenue for the last 12 months
        $monthlyRevenue = Bill::where('status', 'paid')
            ->selectRaw("DATE_FORMAT(billing_date, '%Y-%m') as month, SUM(amount) as total")
            ->where('billing_date', '>=', now()->subMonths(11)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Monthly bill generation count
        $monthlyBills = Bill::selectRaw("DATE_FORMAT(billing_date, '%Y-%m') as month, COUNT(*) as count")
            ->where('billing_date', '>=', now()->subMonths(11)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return Inertia::render('admin/reports/index', [
            'stats' => [
                'totalRevenue'     => $totalRevenue,
                'totalUnpaid'      => $totalUnpaid,
                'paidBillsCount'   => $paidBillsCount,
                'unpaidBillsCount' => $unpaidBillsCount,
                'totalCustomers'   => $totalCustomers,
                'paidPayments' => $confirmedPayments,
                'pendingPayments'   => $pendingPayments,
            ],
            'monthlyRevenue' => $monthlyRevenue,
            'monthlyBills'   => $monthlyBills,
        ]);
    }
}
