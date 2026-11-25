<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\MeterReading;
use App\Models\User;
use App\Models\WaterRate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StaffBillController extends Controller
{
    public function index(Request $request)
    {
        $query = Bill::with(['customer', 'payments'])->orderBy('created_at', 'desc');

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

        $bills = $query->paginate(15)->withQueryString();

        return Inertia::render('staff/bills/index', [
            'bills'   => $bills,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function show(Bill $bill)
    {
        $bill->load(['customer', 'payments' => function($query) {
            $query->whereIn('status', ['paid', 'pending', 'pending_cash'])->latest();
        }]);
        $settings = WaterRate::current();

        return Inertia::render('staff/bills/show', [
            'bill'     => $bill,
            'settings' => $settings,
        ]);
    }
}
