<?php

/**
 * Sandboxed verification of the MeterReadingImport flow against an in-memory
 * SQLite database. Creates a minimal schema (no real DB touched) and asserts
 * the imported rows, the new 2-column template handling, and the error paths.
 */

use App\Imports\MeterReadingImport;
use App\Models\Bill;
use App\Models\Customer;
use App\Models\MeterReading;
use App\Models\Payment;
use App\Models\User;
use App\Models\WaterRate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

require __DIR__ . '/../vendor/autoload.php';

$app = require __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Force in-memory SQLite regardless of dev DB env vars.
config()->set('database.default', 'sqlite');
config()->set('database.connections.sqlite.database', ':memory:');
config()->set('session.driver', 'array');
DB::purge('sqlite');
DB::connection('sqlite')->statement('PRAGMA foreign_keys = ON');

// Minimal schema mirroring the columns the import touches.
Schema::create('users', function ($t) {
    $t->id();
    $t->string('username')->unique();
    $t->string('password');
    $t->string('role')->default('staff');
    $t->string('position')->nullable();
    $t->timestamps();
});
Schema::create('customers', function ($t) {
    $t->id();
    $t->string('first_name');
    $t->string('last_name');
    $t->string('purok')->nullable();
    $t->string('meter_number')->nullable();
    $t->decimal('initial_reading', 15, 2)->default(0);
    $t->decimal('balance', 15, 2)->default(0);
    $t->foreignId('user_id')->nullable();
    $t->timestamps();
});
Schema::create('meter_readings', function ($t) {
    $t->id();
    $t->foreignId('customer_id');
    $t->foreignId('meter_reader_id')->nullable();
    $t->foreignId('recorded_by_user_id')->nullable();
    $t->date('reading_date');
    $t->decimal('meter_reading', 12, 2)->default(0);
    $t->timestamps();
});
Schema::create('water_rates', function ($t) {
    $t->id();
    $t->decimal('base_rate', 10, 2)->default(0);
    $t->decimal('rate_per_cubic_meter', 10, 2)->default(0);
    $t->decimal('penalty_amount', 10, 2)->default(0);
    $t->integer('billing_cycle_day')->default(1);
    $t->string('barangay_name')->nullable();
    $t->string('barangay_address')->nullable();
    $t->string('contact_number')->nullable();
    $t->timestamps();
});
Schema::create('bills', function ($t) {
    $t->id();
    $t->foreignId('customer_id');
    $t->date('billing_date');
    $t->decimal('consumption', 10, 2);
    $t->decimal('amount', 10, 2);
    $t->string('status')->default('unpaid');
    $t->date('due_date')->nullable();
    $t->timestamps();
});
Schema::create('payments', function ($t) {
    $t->id();
    $t->foreignId('customer_id');
    $t->foreignId('bill_id');
    $t->string('payment_method')->default('cash');
    $t->decimal('amount', 10, 2);
    $t->string('reference_number')->nullable();
    $t->string('status')->default('pending_cash');
    $t->timestamps();
});

// Seed data
$admin = User::create(['username' => 'admin1', 'password' => 'x', 'role' => 'admin', 'position' => 'administrator']);
$reader = User::create(['username' => 'reader1', 'password' => 'x', 'role' => 'staff', 'position' => 'meter_reader']);
$customer = Customer::create(['first_name' => 'Juan', 'last_name' => 'Dela Cruz', 'initial_reading' => 100]);
WaterRate::current();
Auth::login($admin);

$makeXlsx = function (array $headers, array $rows): string {
    $spreadsheet = new PhpOffice\PhpSpreadsheet\Spreadsheet();
    $spreadsheet->getActiveSheet()->fromArray(array_merge([$headers], $rows), null, 'A1');
    $tmp = tempnam(sys_get_temp_dir(), 'verify_') . '.xlsx';
    (new PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet))->save($tmp);
    return $tmp;
};

// ---- 1. Happy path: new 2-column template --------------------------------
$file = $makeXlsx(['Customer', 'Reading (m³)'], [['Juan Dela Cruz', 150]]);
Maatwebsite\Excel\Facades\Excel::import(new MeterReadingImport($reader->id, '2026-08-04'), $file);

$reading = MeterReading::first();
assert($reading !== null, 'no reading created');
assert($reading->customer_id === $customer->id, 'wrong customer id');
assert((float) $reading->meter_reading === 150.0, 'wrong meter reading');
assert($reading->reading_date->toDateString() === '2026-08-04', 'wrong reading date');
assert($reading->meter_reader_id === $reader->id, 'wrong meter reader');
assert($reading->recorded_by_user_id === $admin->id, 'wrong recorded_by');
assert(Bill::count() === 1, 'bill not created');
assert(Payment::count() === 1, 'payment not created');
echo "OK  happy path (new template)\n";

// ---- 2. Legacy template (Customer / Date / Reading (m³)) still works -----
$file = $makeXlsx(['Customer', 'Date', 'Reading (m³)'], [['Juan Dela Cruz', '2026-07-01', 200]]);
Maatwebsite\Excel\Facades\Excel::import(new MeterReadingImport($reader->id), $file);
$r2 = MeterReading::orderByDesc('id')->first();
assert($r2->reading_date->toDateString() === '2026-07-01', 'legacy per-row date not honored');
echo "OK  legacy template (per-row date)\n";

// ---- 3. Customer not found -> clear exception ----------------------------
$file = $makeXlsx(['Customer', 'Reading (m³)'], [['Nobody Here', 50]]);
try {
    Maatwebsite\Excel\Facades\Excel::import(new MeterReadingImport($reader->id, '2026-08-04'), $file);
    throw new RuntimeException('expected exception for unknown customer');
} catch (Exception $e) {
    assert(str_contains($e->getMessage(), 'Nobody Here'), 'message should name the customer: ' . $e->getMessage());
    echo "OK  unknown customer error: " . $e->getMessage() . "\n";
}

// ---- 4. Missing required column -> clear exception -----------------------
$file = $makeXlsx(['Customer'], [['Juan Dela Cruz']]);
try {
    Maatwebsite\Excel\Facades\Excel::import(new MeterReadingImport($reader->id, '2026-08-04'), $file);
    throw new RuntimeException('expected exception for missing column');
} catch (Exception $e) {
    assert(str_contains($e->getMessage(), 'Reading (m³)'), 'message should mention the missing column: ' . $e->getMessage());
    echo "OK  missing column error: " . $e->getMessage() . "\n";
}

// ---- 5. No records created when a later row is invalid --------------------
MeterReading::query()->delete();
$file = $makeXlsx(['Customer', 'Reading (m³)'], [['Juan Dela Cruz', 150], ['Ghost Person', 160]]);
try {
    Maatwebsite\Excel\Facades\Excel::import(new MeterReadingImport($reader->id, '2026-08-04'), $file);
    throw new RuntimeException('expected exception');
} catch (Exception $e) {
    assert(MeterReading::count() === 0, 'partial import happened: ' . MeterReading::count() . ' rows');
    echo "OK  atomic failure (0 rows persisted): " . $e->getMessage() . "\n";
}

echo "\nALL VERIFICATIONS PASSED\n";
