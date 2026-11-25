<?php
/**
 * Verify both template download endpoints return the shipped template with the
 * new header and no-cache directives. No DB writes.
 */
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\User;

require __DIR__ . '/../vendor/autoload.php';
$app = require __DIR__ . '/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

config()->set('database.default', 'sqlite');
config()->set('database.connections.sqlite.database', ':memory:');
config()->set('session.driver', 'array');
DB::purge('sqlite');
Schema::create('users', function ($t) { $t->id(); $t->string('username')->unique(); $t->string('password'); $t->string('role')->default('staff'); $t->string('position')->nullable(); $t->timestamps(); });
Auth::login(User::create(['username' => 'admin1', 'password' => 'x', 'role' => 'admin', 'position' => 'administrator']));

use App\Http\Controllers\Admin\AdminMeterReadingController;
use App\Http\Controllers\Staff\MeterReadingController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

foreach (['admin' => AdminMeterReadingController::class, 'staff' => MeterReadingController::class] as $role => $class) {
    $response = (new $class)->downloadTemplate();
    assert($response instanceof BinaryFileResponse, "$role: expected BinaryFileResponse, got " . get_class($response));

    $file = $response->getFile()->getPathname();
    $expected = __DIR__ . '/../public/templates/sawsa_meter_reading_template.xlsx';
    assert(realpath($file) === realpath($expected), "$role: serves {$file}, expected {$expected}");

    $cc = (string) $response->headers->get('Cache-Control');
    assert(stripos($cc, 'no-store') !== false && stripos($cc, 'no-cache') !== false, "$role: cache-control lacks no-store/no-cache: {$cc}");
    assert((string) $response->headers->get('Pragma') === 'no-cache', "$role: pragma missing");
    assert((string) $response->headers->get('Expires') === '0', "$role: expires missing");

    $sheet = (new PhpOffice\PhpSpreadsheet\Reader\Xlsx())->load($file)->getActiveSheet();
    assert($sheet->getCell('A1')->getValue() === 'Customer', "$role: A1 = " . var_export($sheet->getCell('A1')->getValue(), true));
    assert($sheet->getCell('B1')->getValue() === 'Meter Reading (m³)', "$role: B1 = " . var_export($sheet->getCell('B1')->getValue(), true));
    echo "OK  $role download -> {$sheet->getCell('A1')->getValue()} | {$sheet->getCell('B1')->getValue()} (Cache-Control: {$cc})\n";
}
echo "\nDOWNLOAD ENDPOINTS VERIFIED\n";
