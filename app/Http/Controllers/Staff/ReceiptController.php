<?php

namespace App\Http\Controllers\Staff;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\WaterRate;
use Inertia\Inertia;

class ReceiptController extends Controller
{
    public function show(Payment $payment)
    {
        $payment->load(['customer', 'bill']);
        $settings = WaterRate::current();

        return Inertia::render('staff/receipts/show', [
            'payment'  => $payment,
            'settings' => $settings,
        ]);
    }
}
