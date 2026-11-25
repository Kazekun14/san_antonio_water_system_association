<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\MeterReading;
use App\Models\Payment;
use App\Models\User;
use App\Models\Customer;
use Inertia\Inertia;

class StaffDashboardController extends Controller
{
    public function index()
    {
        $totalCustomers   = Customer::count();
        $todayReadings    = MeterReading::whereDate('reading_date', today())->count();
        $pendingPayments  = Payment::where('status', 'pending')->count();
        $unpaidBills      = Bill::whereIn('status', ['unpaid', 'overdue'])->count();

        $recentReadings = MeterReading::with(['customer', 'recorder'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $pendingPaymentsList = Payment::with(['customer', 'bill'])
            ->where('status', 'pending')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('staff/dashboard', [
            'stats' => [
                'totalCustomers'  => $totalCustomers,
                'todayReadings'   => $todayReadings,
                'pendingPayments' => $pendingPayments,
                'unpaidBills'     => $unpaidBills,
            ],
            'recentReadings'      => $recentReadings,
            'pendingPaymentsList' => $pendingPaymentsList,
        ]);
    }

    public function customers()
    {
        $customers = Customer::withCount(['bills', 'payments'])
            ->orderBy('first_name')
            ->paginate(15);

        return Inertia::render('staff/customers/index', [
            'customers' => $customers,
        ]);
    }
}
