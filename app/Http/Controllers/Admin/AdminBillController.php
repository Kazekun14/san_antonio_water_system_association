<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Bill;
use App\Models\Customer;
use App\Models\WaterRate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminBillController extends Controller
{
    public function index(Request $request)
    {
        $query = Bill::with('customer')->orderBy('created_at', 'desc');

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
        $customers = Customer::orderBy('first_name')->get(['id', 'first_name', 'last_name']);
        $rate = WaterRate::current();

        return Inertia::render('admin/bills/index', [
            'bills'     => $bills,
            'customers' => $customers,
            'rate'      => $rate,
            'filters'   => $request->only(['status', 'search']),
        ]);
    }

    public function show(Bill $bill)
    {
        $bill->load(['customer', 'payments' => function($query) {
            $query->whereIn('status', ['paid', 'pending', 'pending_cash'])->latest();
        }]);
        $settings = WaterRate::current();

        return Inertia::render('admin/bills/show', [
            'bill'     => $bill,
            'settings' => $settings,
        ]);
    }

    public function destroy(Bill $bill)
    {
        $bill->delete();

        return redirect()->route('admin.bills.index')
            ->with('success', 'Bill deleted successfully.');
    }
}
