<?php

use App\Models\Bill;
use App\Models\Payment;
use Illuminate\Support\Str;

require dirname(__DIR__) . '/vendor/autoload.php';
$app = require_once dirname(__DIR__) . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$bills = Bill::where('status', 'unpaid')
    ->whereDoesntHave('payments')
    ->get();

foreach ($bills as $bill) {
    Payment::create([
        'customer_id'      => $bill->customer_id,
        'bill_id'          => $bill->id,
        'payment_method'   => 'cash',
        'amount'           => $bill->amount,
        'reference_number' => 'REF-' . strtoupper(Str::random(8)),
        'status'           => 'pending_cash',
    ]);
    echo "Generated reference for Bill #{$bill->id}\n";
}

echo "Done.\n";
