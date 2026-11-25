<?php

/**
 * Sandboxed verification that the shipped template
 * (public/templates/sawsa_meter_reading_template.xlsx) uses the new header
 * "Meter Reading (m³)" and that filling it in and importing it works with the
 * current MeterReadingImport. Also re-checks the legacy "Reading (m³)" header.
 *
 * Runs against an in-memory SQLite database with a minimal schema
 * (mirrors scratch/verify_import.php; no real DB is touched).
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

$templatePath = __DIR__ . '/../public/templates/sawsa_meter_reading_template.xlsx';

// ---- 1. The shipped template header is now "Meter Reading (m³)" ----------
$readerPhp = new PhpOffice\PhpSpreadsheet\Reader\Xlsx();
$spreadsheet = $readerPhp->load($templatePath);
$a1 = $spreadsheet->getActiveSheet()->getCell('A1')->getValue();
$b1 = $spreadsheet->getActiveSheet()->getCell('B1')->getValue();
assert($a1 === 'Customer', 'A1 should be Customer, got: ' . var_export($a1, true));
assert($b1 === 'Meter Reading (m³)', 'B1 should be "Meter Reading (m³)", got: ' . var_export($b1, true));
echo "OK  template header is: {$a1} | {$b1}\n";

// ---- 2. Fill the real template with one row and import it ----------------
$sheet = $spreadsheet->getActiveSheet();
$sheet->setCellValue('A2', 'Juan Dela Cruz');
$sheet->setCellValue('B2', 150);
$tmp = tempnam(sys_get_temp_dir(), 'tmpl_') . '.xlsx';
(new PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet))->save($tmp);

Maatwebsite\Excel\Facades\Excel::import(new MeterReadingImport($reader->id, '2026-08-04'), $tmp);

$reading = MeterReading::first();
assert($reading !== null, 'no reading created from the shipped template');
assert($reading->customer_id === $customer->id, 'wrong customer id');
assert((float) $reading->meter_reading === 150.0, 'wrong meter reading');
assert($reading->reading_date->toDateString() === '2026-08-04', 'wrong reading date');
assert(Bill::count() === 1, 'bill not created');
assert(Payment::count() === 1, 'payment not created');
echo "OK  imported the shipped template end-to-end (meter_reading_m3 key)\n";

// ---- 3. Legacy "Reading (m³)" header still works -------------------------
$makeXlsx = function (array $headers, array $rows): string {
    $spreadsheet = new PhpOffice\PhpSpreadsheet\Spreadsheet();
    $spreadsheet->getActiveSheet()->fromArray(array_merge([$headers], $rows), null, 'A1');
    $tmp = tempnam(sys_get_temp_dir(), 'legacy_') . '.xlsx';
    (new PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet))->save($tmp);
    return $tmp;
};

Maatwebsite\Excel\Facades\Excel::import(
    new MeterReadingImport($reader->id, '2026-08-04'),
    $makeXlsx(['Customer', 'Reading (m³)'], [['Juan Dela Cruz', 200]])
);
assert(MeterReading::count() === 2, 'legacy header import failed: ' . MeterReading::count() . ' rows');
echo "OK  legacy 'Reading (m³)' header still imports\n";

echo "\nALL VERIFICATIONS PASSED\n";
