<?php

/**
 * Feature tests for the admin meter readings index filters. All filtering is
 * applied server-side on the meter_readings query; the UI merely passes the
 * selected values as query parameters.
 */

use App\Models\Customer;
use App\Models\MeterReading;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

function indexFilterAdmin(): User
{
    return User::create([
        'username' => 'Admin User',
        'password' => 'password',
        'role' => 'admin',
        'position' => 'administrator',
    ]);
}

function indexFilterReader(string $username): User
{
    return User::create([
        'username' => $username,
        'password' => 'password',
        'role' => 'staff',
        'position' => 'meter_reader',
    ]);
}

function indexFilterEncoder(string $username = 'Anna'): User
{
    return User::create([
        'username' => $username,
        'password' => 'password',
        'role' => 'staff',
        'position' => 'encoder',
    ]);
}

function indexFilterCustomer(string $firstName, string $lastName = 'Test'): Customer
{
    return Customer::create([
        'first_name' => $firstName,
        'last_name' => $lastName,
    ]);
}

function indexFilterReading(Customer $customer, ?User $reader, string $date, string $status = 'pending', float $reading = 100): MeterReading
{
    return MeterReading::create([
        'customer_id' => $customer->id,
        'meter_reader_id' => $reader?->id,
        'recorded_by_user_id' => $reader?->id,
        'meter_reading' => $reading,
        'reading_date' => $date,
        'status' => $status,
    ]);
}

test('the meter reader filter only lists admins and meter readers, never encoders', function () {
    $admin = indexFilterAdmin();
    indexFilterReader('Butoy');
    indexFilterReader('Juan');
    indexFilterEncoder(); // must NOT appear in the dropdown

    $this->actingAs($admin)
        ->get('/admin/meter-readings')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/meter-readings/index')
            ->has('meterReaders', 3)
            ->where('meterReaders.0.username', 'Admin User')
            ->where('meterReaders.1.username', 'Butoy')
            ->where('meterReaders.2.username', 'Juan'));
});

test('index filters readings by meter reader', function () {
    $admin = indexFilterAdmin();
    $reader = indexFilterReader('Butoy');
    $otherReader = indexFilterReader('Juan');
    $customer = indexFilterCustomer('Maria', 'Santos');

    indexFilterReading($customer, $reader, '2026-08-01');
    indexFilterReading($customer, $otherReader, '2026-08-02');

    $this->actingAs($admin)
        ->get('/admin/meter-readings?meter_reader_id='.$reader->id)
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('readings.total', 1)
            ->where('readings.data.0.meter_reader.username', 'Butoy')
            ->where('filters.meter_reader_id', $reader->id));
});

test('index filters readings by customer', function () {
    $admin = indexFilterAdmin();
    $reader = indexFilterReader('Butoy');
    $customer = indexFilterCustomer('Maria', 'Santos');
    $otherCustomer = indexFilterCustomer('Juan', 'Cruz');

    indexFilterReading($customer, $reader, '2026-08-01');
    indexFilterReading($otherCustomer, $reader, '2026-08-02');

    $this->actingAs($admin)
        ->get('/admin/meter-readings?customer_id='.$customer->id)
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('readings.total', 1)
            ->where('readings.data.0.customer.full_name', 'Maria Santos')
            ->where('filters.customer_id', $customer->id));
});

test('index filters readings by an inclusive reading date range', function () {
    $admin = indexFilterAdmin();
    $reader = indexFilterReader('Butoy');
    $customer = indexFilterCustomer('Maria', 'Santos');

    indexFilterReading($customer, $reader, '2026-08-01'); // boundary — included
    indexFilterReading($customer, $reader, '2026-08-08');
    indexFilterReading($customer, $reader, '2026-08-15'); // boundary — included
    indexFilterReading($customer, $reader, '2026-07-31'); // outside
    indexFilterReading($customer, $reader, '2026-08-16'); // outside

    $this->actingAs($admin)
        ->get('/admin/meter-readings?date_from=2026-08-01&date_to=2026-08-15')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('readings.total', 3)
            ->where('filters.date_from', '2026-08-01')
            ->where('filters.date_to', '2026-08-15'));
});

test('index date range with identical from and to filters that single day', function () {
    $admin = indexFilterAdmin();
    $reader = indexFilterReader('Butoy');
    $customer = indexFilterCustomer('Maria', 'Santos');

    indexFilterReading($customer, $reader, '2026-08-10');
    indexFilterReading($customer, $reader, '2026-08-11');

    $this->actingAs($admin)
        ->get('/admin/meter-readings?date_from=2026-08-10&date_to=2026-08-10')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('readings.total', 1)
            ->where('readings.data.0.reading_date', '2026-08-10'));
});

test('index filters readings by status', function () {
    $admin = indexFilterAdmin();
    $reader = indexFilterReader('Butoy');
    $customer = indexFilterCustomer('Maria', 'Santos');

    indexFilterReading($customer, $reader, '2026-08-01', 'pending');
    indexFilterReading($customer, $reader, '2026-08-02', 'finalized');

    $this->actingAs($admin)
        ->get('/admin/meter-readings?status=finalized')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('readings.total', 1)
            ->where('readings.data.0.status', 'finalized')
            ->where('filters.status', 'finalized'));
});

test('all filters combine together (AND)', function () {
    $admin = indexFilterAdmin();
    $reader = indexFilterReader('Butoy');
    $otherReader = indexFilterReader('Juan');
    $customer = indexFilterCustomer('Maria', 'Santos');
    $otherCustomer = indexFilterCustomer('Juan', 'Cruz');

    indexFilterReading($customer, $reader, '2026-08-05', 'pending');
    indexFilterReading($customer, $reader, '2026-08-06', 'finalized');
    indexFilterReading($customer, $otherReader, '2026-08-07', 'pending');
    indexFilterReading($otherCustomer, $reader, '2026-08-08', 'pending');
    indexFilterReading($customer, $reader, '2026-07-05', 'pending'); // outside range

    $this->actingAs($admin)
        ->get('/admin/meter-readings'.'?meter_reader_id='.$reader->id
            .'&customer_id='.$customer->id
            .'&date_from=2026-08-01&date_to=2026-08-15'
            .'&status=pending')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('readings.total', 1)
            ->where('readings.data.0.customer.full_name', 'Maria Santos')
            ->where('readings.data.0.meter_reader.username', 'Butoy')
            ->where('readings.data.0.status', 'pending')
            ->where('readings.data.0.reading_date', '2026-08-05'));
});

test('filters are preserved in pagination links', function () {
    $admin = indexFilterAdmin();
    $reader = indexFilterReader('Butoy');
    $customer = indexFilterCustomer('Maria', 'Santos');

    // 16 readings so the 5-per-page paginator has multiple pages.
    foreach (range(1, 16) as $day) {
        indexFilterReading($customer, $reader, '2026-08-'.str_pad((string) $day, 2, '0', STR_PAD_LEFT), 'pending');
    }

    $this->actingAs($admin)
        ->get('/admin/meter-readings?meter_reader_id='.$reader->id.'&status=pending')
        ->assertOk()
        ->assertSee('meter_reader_id='.$reader->id)
        ->assertSee('status=pending');
});

test('default index ordering shows pending readings before finalized ones, newest first within each status', function () {
    $admin = indexFilterAdmin();
    $reader = indexFilterReader('Butoy');
    $customer = indexFilterCustomer('Maria', 'Santos');

    indexFilterReading($customer, $reader, '2026-08-03', 'finalized');
    indexFilterReading($customer, $reader, '2026-08-01', 'pending');
    indexFilterReading($customer, $reader, '2026-08-05', 'pending');
    indexFilterReading($customer, $reader, '2026-08-02', 'finalized');

    $this->actingAs($admin)
        ->get('/admin/meter-readings')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('readings.total', 4)
            // All pending records first, ordered by reading date desc, then id desc
            ->where('readings.data.0.status', 'pending')
            ->where('readings.data.0.reading_date', '2026-08-05')
            ->where('readings.data.1.status', 'pending')
            ->where('readings.data.1.reading_date', '2026-08-01')
            // Then all finalized records, same newest-first ordering
            ->where('readings.data.2.status', 'finalized')
            ->where('readings.data.2.reading_date', '2026-08-03')
            ->where('readings.data.3.status', 'finalized')
            ->where('readings.data.3.reading_date', '2026-08-02'));
});

test('customer filter ordering keeps pending readings before finalized ones', function () {
    $admin = indexFilterAdmin();
    $reader = indexFilterReader('Butoy');
    $customer = indexFilterCustomer('Kurt', 'Shiedrick');

    indexFilterReading($customer, $reader, '2026-08-10', 'finalized');
    indexFilterReading($customer, $reader, '2026-08-12', 'pending');
    indexFilterReading($customer, $reader, '2026-08-11', 'finalized');

    $this->actingAs($admin)
        ->get('/admin/meter-readings?customer_id='.$customer->id)
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('readings.total', 3)
            ->where('readings.data.0.status', 'pending')
            ->where('readings.data.0.reading_date', '2026-08-12')
            ->where('readings.data.1.status', 'finalized')
            ->where('readings.data.1.reading_date', '2026-08-11')
            ->where('readings.data.2.status', 'finalized')
            ->where('readings.data.2.reading_date', '2026-08-10'));
});

test('combined filters ordering keeps pending readings before finalized ones', function () {
    $admin = indexFilterAdmin();
    $reader = indexFilterReader('Butoy');
    $otherReader = indexFilterReader('Juan');
    $customer = indexFilterCustomer('Maria', 'Santos');

    indexFilterReading($customer, $reader, '2026-08-02', 'finalized');
    indexFilterReading($customer, $reader, '2026-08-05', 'pending');
    indexFilterReading($customer, $reader, '2026-08-06', 'pending');
    indexFilterReading($customer, $reader, '2026-08-07', 'finalized');
    indexFilterReading($customer, $otherReader, '2026-08-08', 'pending'); // excluded by reader filter

    $this->actingAs($admin)
        ->get('/admin/meter-readings?meter_reader_id='.$reader->id.'&customer_id='.$customer->id.'&date_from=2026-08-01&date_to=2026-08-15')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('readings.total', 4)
            ->where('readings.data.0.status', 'pending')
            ->where('readings.data.0.reading_date', '2026-08-06')
            ->where('readings.data.1.status', 'pending')
            ->where('readings.data.1.reading_date', '2026-08-05')
            ->where('readings.data.2.status', 'finalized')
            ->where('readings.data.2.reading_date', '2026-08-07')
            ->where('readings.data.3.status', 'finalized')
            ->where('readings.data.3.reading_date', '2026-08-02'));
});

test('malformed filter values are ignored rather than crashing', function () {
    $admin = indexFilterAdmin();
    $customer = indexFilterCustomer('Maria', 'Santos');
    indexFilterReading($customer, null, '2026-08-01', 'pending');

    $this->actingAs($admin)
        ->get('/admin/meter-readings?meter_reader_id=abc&customer_id=-5&date_from=not-a-date&date_to=08/15/2026&status=bogus')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('readings.total', 1)
            ->where('filters.meter_reader_id', null)
            ->where('filters.customer_id', null)
            ->where('filters.date_from', null)
            ->where('filters.date_to', null)
            ->where('filters.status', null));
});
