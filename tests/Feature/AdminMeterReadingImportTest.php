<?php

/**
 * Feature tests for the admin meter reading Excel import.
 *
 * Runs against the in-memory SQLite test database configured in phpunit.xml.
 */

use App\Models\Bill;
use App\Models\Customer;
use App\Models\MeterReading;
use App\Models\Payment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\QueryException;
use Illuminate\Http\UploadedFile;
use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

/**
 * Build a real .xlsx UploadedFile from the given header + data rows.
 */
function xlsxUpload(array $headers, array $rows = [], string $name = 'readings.xlsx'): UploadedFile
{
    $spreadsheet = new Spreadsheet;
    $spreadsheet->getActiveSheet()->fromArray(array_merge([$headers], $rows), null, 'A1');

    $tmp = tempnam(sys_get_temp_dir(), 'mr_').'.xlsx';
    (new Xlsx($spreadsheet))->save($tmp);

    return new UploadedFile(
        $tmp,
        $name,
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        null,
        true
    );
}

function makeAdminUser(): User
{
    return User::create([
        'username' => 'admin_'.uniqid(),
        'password' => 'password',
        'role' => 'admin',
        'position' => 'administrator',
    ]);
}

function makeMeterReader(): User
{
    return User::create([
        'username' => 'reader_'.uniqid(),
        'password' => 'password',
        'role' => 'staff',
        'position' => 'meter_reader',
    ]);
}

/**
 * A valid reading date that is always in the past (imports reject future dates).
 */
function pastReadingDate(): string
{
    return now()->subDays(1)->toDateString();
}

/**
 * Build an .xlsx where the meter reading cell is explicitly a text cell, so
 * values that look numeric (like "1e5") are not coerced to numbers on write.
 */
function xlsxUploadWithTextReading(string $customer, string $reading): UploadedFile
{
    $spreadsheet = new Spreadsheet;
    $sheet = $spreadsheet->getActiveSheet();
    $sheet->fromArray(['Customer', 'Meter Reading (m³)'], null, 'A1');
    $sheet->setCellValueExplicit('A2', $customer, DataType::TYPE_STRING);
    $sheet->setCellValueExplicit('B2', $reading, DataType::TYPE_STRING);

    $tmp = tempnam(sys_get_temp_dir(), 'mr_').'.xlsx';
    (new Xlsx($spreadsheet))->save($tmp);

    return new UploadedFile(
        $tmp,
        'readings.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        null,
        true
    );
}

test('import accepts the current template header (Customer / Meter Reading (m³))', function () {
    $admin = makeAdminUser();
    $reader = makeMeterReader();
    $customer = Customer::create(['first_name' => 'Juan', 'last_name' => 'Dela Cruz', 'initial_reading' => 100]);

    $file = xlsxUpload(['Customer', 'Meter Reading (m³)'], [['Juan Dela Cruz', 150]]);

    $this->actingAs($admin)
        ->post('/admin/meter-readings/import', [
            'file' => $file,
            'meter_reader_id' => $reader->id,
            'reading_date' => pastReadingDate(),
        ])
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success');

    $reading = MeterReading::first();
    expect($reading)->not->toBeNull();
    expect((float) $reading->meter_reading)->toBe(150.0);
    expect(MeterReading::count())->toBe(1);
});

test('import creates a reading for each row with reader, date and recorder', function () {
    $admin = makeAdminUser();
    $reader = makeMeterReader();
    $customer = Customer::create(['first_name' => 'Juan', 'last_name' => 'Dela Cruz', 'initial_reading' => 100]);

    $file = xlsxUpload(['Customer', 'Reading (m³)'], [['Juan Dela Cruz', 150]]);

    $this->actingAs($admin)
        ->post('/admin/meter-readings/import', [
            'file' => $file,
            'meter_reader_id' => $reader->id,
            'reading_date' => pastReadingDate(),
        ])
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success');

    $reading = MeterReading::first();
    expect($reading)->not->toBeNull();
    expect($reading->customer_id)->toBe($customer->id);
    expect((float) $reading->meter_reading)->toBe(150.0);
    expect($reading->reading_date->toDateString())->toBe(pastReadingDate());
    expect($reading->meter_reader_id)->toBe($reader->id);
    expect($reading->recorded_by_user_id)->toBe($admin->id);

    // Importing a reading no longer generates a bill or payment — billing is
    // handled separately.
    expect(Bill::count())->toBe(0);
    expect(Payment::count())->toBe(0);
});

test('import reports a clear error when a customer does not exist', function () {
    $admin = makeAdminUser();
    $reader = makeMeterReader();
    Customer::create(['first_name' => 'Juan', 'last_name' => 'Dela Cruz']);

    $file = xlsxUpload(['Customer', 'Reading (m³)'], [['Maria Santos', 150]]);

    $this->actingAs($admin)
        ->post('/admin/meter-readings/import', [
            'file' => $file,
            'meter_reader_id' => $reader->id,
            'reading_date' => pastReadingDate(),
        ])
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('error');

    expect(MeterReading::count())->toBe(0);
});

test('import rejects a file that is missing a required column', function () {
    $admin = makeAdminUser();
    $reader = makeMeterReader();

    $file = xlsxUpload(['Customer'], [['Juan Dela Cruz']]);

    $this->actingAs($admin)
        ->post('/admin/meter-readings/import', [
            'file' => $file,
            'meter_reader_id' => $reader->id,
            'reading_date' => pastReadingDate(),
        ])
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('error');

    expect(MeterReading::count())->toBe(0);
});

test('import rejects a file that is not a valid spreadsheet', function () {
    $admin = makeAdminUser();
    $reader = makeMeterReader();

    $tmp = tempnam(sys_get_temp_dir(), 'mr_');
    file_put_contents($tmp, 'this is definitely not an excel file');
    $file = new UploadedFile($tmp, 'broken.xlsx', 'text/plain', null, true);

    $this->actingAs($admin)
        ->post('/admin/meter-readings/import', [
            'file' => $file,
            'meter_reader_id' => $reader->id,
            'reading_date' => pastReadingDate(),
        ])
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('error');

    expect(MeterReading::count())->toBe(0);
});

test('import requires a reading date', function () {
    $admin = makeAdminUser();
    $reader = makeMeterReader();

    $file = xlsxUpload(['Customer', 'Reading (m³)'], [['Juan Dela Cruz', 150]]);

    $this->actingAs($admin)
        ->post('/admin/meter-readings/import', [
            'file' => $file,
            'meter_reader_id' => $reader->id,
        ])
        ->assertSessionHasErrors('reading_date');

    expect(MeterReading::count())->toBe(0);
});

test('import rejects a future reading date', function () {
    $admin = makeAdminUser();
    $reader = makeMeterReader();

    $file = xlsxUpload(['Customer', 'Reading (m³)'], [['Juan Dela Cruz', 150]]);

    $this->actingAs($admin)
        ->post('/admin/meter-readings/import', [
            'file' => $file,
            'meter_reader_id' => $reader->id,
            'reading_date' => '2099-01-01',
        ])
        ->assertSessionHasErrors('reading_date');

    expect(MeterReading::count())->toBe(0);
});

test('import requires a meter reader', function () {
    $admin = makeAdminUser();

    $file = xlsxUpload(['Customer', 'Reading (m³)'], [['Juan Dela Cruz', 150]]);

    $this->actingAs($admin)
        ->post('/admin/meter-readings/import', [
            'file' => $file,
            'reading_date' => pastReadingDate(),
        ])
        ->assertSessionHasErrors('meter_reader_id');

    expect(MeterReading::count())->toBe(0);
});

test('import reports every invalid row and imports nothing when any row fails', function () {
    $admin = makeAdminUser();
    $reader = makeMeterReader();
    Customer::create(['first_name' => 'Juan', 'last_name' => 'Dela Cruz', 'initial_reading' => 100]);
    Customer::create(['first_name' => 'Pedro', 'last_name' => 'Reyes', 'initial_reading' => 50]);

    $file = xlsxUpload(['Customer', 'Meter Reading (m³)'], [
        ['Juan Dela Cruz', 150],   // valid row
        ['Maria Santos', 120],     // unknown customer
        ['Pedro Reyes', 'abc'],    // invalid reading value
        ['', 200],                 // missing customer
    ]);

    $this->actingAs($admin)
        ->post('/admin/meter-readings/import', [
            'file' => $file,
            'meter_reader_id' => $reader->id,
            'reading_date' => pastReadingDate(),
        ])
        ->assertRedirect('/admin/meter-readings');

    $errors = session('error');
    expect($errors)->toBeArray();
    expect($errors)->toHaveCount(3);
    expect($errors)->toContain("Row 3: Customer 'Maria Santos' does not exist.");
    expect($errors)->toContain('Row 4: Meter Reading (m³) value "abc" is not a valid number. Expected format: 0, 15, 15.50 or 100.00.');
    expect($errors)->toContain('Row 5: Customer is required (the Customer column is empty).');

    // A valid row in the same file must not be imported when any other row fails.
    expect(MeterReading::count())->toBe(0);
    expect(Bill::count())->toBe(0);
});

test('import rejects a negative meter reading', function () {
    $admin = makeAdminUser();
    $reader = makeMeterReader();
    Customer::create(['first_name' => 'Juan', 'last_name' => 'Dela Cruz', 'initial_reading' => 100]);

    $file = xlsxUpload(['Customer', 'Meter Reading (m³)'], [['Juan Dela Cruz', -15]]);

    $this->actingAs($admin)
        ->post('/admin/meter-readings/import', [
            'file' => $file,
            'meter_reader_id' => $reader->id,
            'reading_date' => pastReadingDate(),
        ])
        ->assertRedirect('/admin/meter-readings');

    expect(session('error'))->toContain('Row 2: Meter Reading (m³) cannot be negative (-15).');
    expect(MeterReading::count())->toBe(0);
});

test('import rejects a row whose reading date is earlier than the customer latest recorded reading date', function () {
    $admin = makeAdminUser();
    $reader = makeMeterReader();
    $customer = Customer::create(['first_name' => 'Juan', 'last_name' => 'Dela Cruz', 'initial_reading' => 100]);

    // The customer already has a reading on a later date than the import date.
    MeterReading::create([
        'customer_id' => $customer->id,
        'meter_reader_id' => $reader->id,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 150,
        'reading_date' => '2026-08-04',
    ]);

    $file = xlsxUpload(['Customer', 'Meter Reading (m³)'], [['Juan Dela Cruz', 160]]);

    $this->actingAs($admin)
        ->post('/admin/meter-readings/import', [
            'file' => $file,
            'meter_reader_id' => $reader->id,
            'reading_date' => '2026-08-01',
        ])
        ->assertRedirect('/admin/meter-readings');

    expect(session('error'))->toContain("Row 2: the reading date (08/01/2026) must be after the latest recorded reading date (08/04/2026) for Juan Dela Cruz.");
    expect(MeterReading::count())->toBe(1);
    expect(Bill::count())->toBe(0);
});

test('import skips a row whose reading date equals the latest recorded reading date as a duplicate', function () {
    $admin = makeAdminUser();
    $reader = makeMeterReader();
    $customer = Customer::create(['first_name' => 'Juan', 'last_name' => 'Dela Cruz', 'initial_reading' => 100]);

    MeterReading::create([
        'customer_id' => $customer->id,
        'meter_reader_id' => $reader->id,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 150,
        'reading_date' => '2026-08-04',
    ]);

    $file = xlsxUpload(['Customer', 'Meter Reading (m³)'], [['Juan Dela Cruz', 160]]);

    // The exact latest reading date already has a record — the duplicate check
    // runs first in the import, so the row is skipped, not imported.
    $this->actingAs($admin)
        ->post('/admin/meter-readings/import', [
            'file' => $file,
            'meter_reader_id' => $reader->id,
            'reading_date' => '2026-08-04',
        ])
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success', function (string $message) {
            return str_contains($message, 'No new meter readings were imported because all records already exist.');
        });

    expect(MeterReading::count())->toBe(1);
    expect(Bill::count())->toBe(0);
});

test('import accepts a reading date the day after the latest recorded reading date', function () {
    $admin = makeAdminUser();
    $reader = makeMeterReader();
    $customer = Customer::create(['first_name' => 'Juan', 'last_name' => 'Dela Cruz', 'initial_reading' => 100]);

    MeterReading::create([
        'customer_id' => $customer->id,
        'meter_reader_id' => $reader->id,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 150,
        'reading_date' => '2026-08-04',
    ]);

    $file = xlsxUpload(['Customer', 'Meter Reading (m³)'], [['Juan Dela Cruz', 160]]);

    $this->actingAs($admin)
        ->post('/admin/meter-readings/import', [
            'file' => $file,
            'meter_reader_id' => $reader->id,
            'reading_date' => '2026-08-05',
        ])
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success');

    expect(MeterReading::count())->toBe(2);

    // No bill is generated from an imported reading.
    expect(Bill::count())->toBe(0);
});



test('import rejects a reading below the customer previous reading', function () {
    $admin = makeAdminUser();
    $reader = makeMeterReader();
    Customer::create(['first_name' => 'Juan', 'last_name' => 'Dela Cruz', 'initial_reading' => 100]);

    $file = xlsxUpload(['Customer', 'Meter Reading (m³)'], [['Juan Dela Cruz', 90]]);

    $this->actingAs($admin)
        ->post('/admin/meter-readings/import', [
            'file' => $file,
            'meter_reader_id' => $reader->id,
            'reading_date' => pastReadingDate(),
        ])
        ->assertRedirect('/admin/meter-readings');

    expect(session('error'))->toContain('Row 2: the reading (90) cannot be less than the previous reading (100) for Juan Dela Cruz.');
    expect(MeterReading::count())->toBe(0);
});

test('import rejects malformed decimal values such as scientific notation', function () {
    $admin = makeAdminUser();
    $reader = makeMeterReader();
    Customer::create(['first_name' => 'Juan', 'last_name' => 'Dela Cruz']);

    // The cell is written as explicit text so it is not coerced to a number.
    $file = xlsxUploadWithTextReading('Juan Dela Cruz', '1e5');

    $this->actingAs($admin)
        ->post('/admin/meter-readings/import', [
            'file' => $file,
            'meter_reader_id' => $reader->id,
            'reading_date' => pastReadingDate(),
        ])
        ->assertRedirect('/admin/meter-readings');

    expect(session('error'))->toContain('Row 2: Meter Reading (m³) value "1e5" has an invalid format. Expected format: 0, 15, 15.50 or 100.00.');
    expect(MeterReading::count())->toBe(0);
});

test('import rejects a row that has a reading but no customer', function () {
    $admin = makeAdminUser();
    $reader = makeMeterReader();
    Customer::create(['first_name' => 'Juan', 'last_name' => 'Dela Cruz']);

    $file = xlsxUpload(['Customer', 'Meter Reading (m³)'], [['', 150]]);

    $this->actingAs($admin)
        ->post('/admin/meter-readings/import', [
            'file' => $file,
            'meter_reader_id' => $reader->id,
            'reading_date' => pastReadingDate(),
        ])
        ->assertRedirect('/admin/meter-readings');

    expect(session('error'))->toContain('Row 2: Customer is required (the Customer column is empty).');
    expect(MeterReading::count())->toBe(0);
});

test('import rejects a row with a customer but no reading', function () {
    $admin = makeAdminUser();
    $reader = makeMeterReader();
    Customer::create(['first_name' => 'Juan', 'last_name' => 'Dela Cruz']);

    $file = xlsxUpload(['Customer', 'Meter Reading (m³)'], [['Juan Dela Cruz', '']]);

    $this->actingAs($admin)
        ->post('/admin/meter-readings/import', [
            'file' => $file,
            'meter_reader_id' => $reader->id,
            'reading_date' => pastReadingDate(),
        ])
        ->assertRedirect('/admin/meter-readings');

    expect(session('error'))->toContain('Row 2: Meter Reading (m³) is required.');
    expect(MeterReading::count())->toBe(0);
});

test('re-importing the same file inserts nothing and reports all records already exist', function () {
    $admin = makeAdminUser();
    $reader = makeMeterReader();
    Customer::create(['first_name' => 'Juan', 'last_name' => 'Dela Cruz', 'initial_reading' => 100]);
    Customer::create(['first_name' => 'Maria', 'last_name' => 'Santos', 'initial_reading' => 200]);

    $file = xlsxUpload(['Customer', 'Meter Reading (m³)'], [
        ['Juan Dela Cruz', 150],
        ['Maria Santos', 250],
    ]);

    $payload = [
        'file' => $file,
        'meter_reader_id' => $reader->id,
        'reading_date' => pastReadingDate(),
    ];

    // First upload imports both rows.
    $this->actingAs($admin)->post('/admin/meter-readings/import', $payload)
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success');

    expect(MeterReading::count())->toBe(2);

    // Imported readings do not generate bills — billing is handled separately.
    expect(Bill::count())->toBe(0);

    // Uploading the exact same file again must skip every row as a duplicate,
    // create no readings, and say so.
    $this->actingAs($admin)->post('/admin/meter-readings/import', $payload)
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success', 'No new meter readings were imported because all records already exist.');

    expect(MeterReading::count())->toBe(2);
    expect(Bill::count())->toBe(0);
});

test('import skips existing duplicates, imports the rest, and reports the summary', function () {
    $admin = makeAdminUser();
    $reader = makeMeterReader();
    $juan = Customer::create(['first_name' => 'Juan', 'last_name' => 'Dela Cruz', 'initial_reading' => 100]);
    Customer::create(['first_name' => 'Maria', 'last_name' => 'Santos', 'initial_reading' => 200]);

    // Juan already has a reading on the target date.
    MeterReading::create([
        'customer_id' => $juan->id,
        'meter_reader_id' => $reader->id,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 150,
        'reading_date' => pastReadingDate(),
    ]);

    $file = xlsxUpload(['Customer', 'Meter Reading (m³)'], [
        ['Juan Dela Cruz', 150],
        ['Maria Santos', 250],
    ]);

    $duplicateDate = Carbon::parse(pastReadingDate())->format('m/d/Y');

    $this->actingAs($admin)
        ->post('/admin/meter-readings/import', [
            'file' => $file,
            'meter_reader_id' => $reader->id,
            'reading_date' => pastReadingDate(),
        ])
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success', function (string $message) use ($duplicateDate) {
            return str_contains($message, 'Import completed successfully.')
                && str_contains($message, 'Total rows: 2')
                && str_contains($message, 'Imported: 1')
                && str_contains($message, 'Skipped (Duplicates): 1')
                && str_contains($message, 'Duplicate Records:')
                && str_contains($message, "- Juan Dela Cruz ({$duplicateDate})");
        });

    // Only Maria's row was imported.
    expect(MeterReading::count())->toBe(2);

    // Imported readings do not generate bills.
    expect(Bill::count())->toBe(0);
});

test('import skips duplicate rows that repeat within the same file', function () {
    $admin = makeAdminUser();
    $reader = makeMeterReader();
    Customer::create(['first_name' => 'Juan', 'last_name' => 'Dela Cruz', 'initial_reading' => 100]);
    Customer::create(['first_name' => 'Maria', 'last_name' => 'Santos', 'initial_reading' => 200]);

    $file = xlsxUpload(['Customer', 'Meter Reading (m³)'], [
        ['Juan Dela Cruz', 150],
        ['Juan Dela Cruz', 150],
        ['Maria Santos', 250],
    ]);

    $this->actingAs($admin)
        ->post('/admin/meter-readings/import', [
            'file' => $file,
            'meter_reader_id' => $reader->id,
            'reading_date' => pastReadingDate(),
        ])
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success', function (string $message) {
            return str_contains($message, 'Total rows: 3')
                && str_contains($message, 'Imported: 2')
                && str_contains($message, 'Skipped (Duplicates): 1');
        });

    expect(MeterReading::count())->toBe(2);

    // Imported readings do not generate bills.
    expect(Bill::count())->toBe(0);
});

test('the database rejects a duplicate reading for the same customer and date', function () {
    $admin = makeAdminUser();
    $customer = Customer::create(['first_name' => 'Juan', 'last_name' => 'Dela Cruz']);

    MeterReading::create([
        'customer_id' => $customer->id,
        'meter_reader_id' => null,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 100,
        'reading_date' => '2026-08-01',
    ]);

    // The unique (customer_id, reading_date) constraint must reject the insert.
    expect(fn () => MeterReading::create([
        'customer_id' => $customer->id,
        'meter_reader_id' => null,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 150,
        'reading_date' => '2026-08-01',
    ]))->toThrow(QueryException::class);
});

test('import rolls back all changes when an error occurs midway through', function () {
    $admin = makeAdminUser();
    $reader = makeMeterReader();
    Customer::create(['first_name' => 'Juan', 'last_name' => 'Dela Cruz', 'initial_reading' => 100]);
    $second = Customer::create(['first_name' => 'Maria', 'last_name' => 'Santos', 'initial_reading' => 200]);

    // Fail right when the second customer's reading is about to be created.
    MeterReading::creating(function ($reading) use ($second) {
        if ((int) $reading->customer_id === (int) $second->id) {
            throw new RuntimeException('Boom');
        }
    });

    try {
        $file = xlsxUpload(['Customer', 'Meter Reading (m³)'], [
            ['Juan Dela Cruz', 150],
            ['Maria Santos', 250],
        ]);

        $this->actingAs($admin)
            ->post('/admin/meter-readings/import', [
                'file' => $file,
                'meter_reader_id' => $reader->id,
                'reading_date' => pastReadingDate(),
            ])
            ->assertRedirect('/admin/meter-readings')
            ->assertSessionHas('error', 'Boom');
    } finally {
        MeterReading::flushEventListeners();
    }

    // The first row's reading was rolled back too — the import must never
    // leave partial data behind.
    expect(MeterReading::count())->toBe(0);
    expect(Bill::count())->toBe(0);
    expect(Payment::count())->toBe(0);
});
