<?php

/**
 * Feature tests for the admin manual meter reading form (store endpoint).
 */

use App\Models\Bill;
use App\Models\Customer;
use App\Models\MeterReading;
use App\Models\Payment;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Testing\AssertableInertia;

function makeStoreAdmin(): User
{
    return User::create([
        'username' => 'store_admin_'.uniqid(),
        'password' => 'password',
        'role' => 'admin',
        'position' => 'administrator',
    ]);
}

function makeStoreReader(): User
{
    return User::create([
        'username' => 'store_reader_'.uniqid(),
        'password' => 'password',
        'role' => 'staff',
        'position' => 'meter_reader',
    ]);
}

function makeStoreCustomer(float $initialReading = 0): Customer
{
    return Customer::create([
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'initial_reading' => $initialReading,
    ]);
}

function storeReadingPayload(array $overrides = []): array
{
    return array_merge([
        'meter_reader_id' => null,
        'meter_reading' => '150',
        'reading_date' => '2026-08-04',
    ], $overrides);
}

test('store accepts an admin account as the meter reader', function () {
    $admin = makeStoreAdmin();
    $customer = makeStoreCustomer(100);

    $this->actingAs($admin)
        ->post('/admin/meter-readings', storeReadingPayload([
            'customer_id' => $customer->id,
            'meter_reader_id' => $admin->id,
        ]))
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success');

    $reading = MeterReading::first();
    expect($reading)->not->toBeNull();
    expect($reading->customer_id)->toBe($customer->id);
    expect($reading->meter_reader_id)->toBe($admin->id);
    expect((float) $reading->meter_reading)->toBe(150.0);

    // Recording a reading no longer generates a bill or payment — billing is
    // handled separately.
    expect(Bill::count())->toBe(0);
    expect(Payment::count())->toBe(0);
});

test('store rejects a future reading date', function () {
    $admin = makeStoreAdmin();
    $reader = makeStoreReader();
    $customer = makeStoreCustomer(100);

    $this->actingAs($admin)
        ->post('/admin/meter-readings', storeReadingPayload([
            'customer_id' => $customer->id,
            'meter_reader_id' => $reader->id,
            'reading_date' => now()->addDay()->toDateString(),
        ]))
        ->assertSessionHasErrors('reading_date');

    expect(MeterReading::count())->toBe(0);
});

test('store accepts today as the reading date', function () {
    $admin = makeStoreAdmin();
    $reader = makeStoreReader();
    $customer = makeStoreCustomer(100);

    $this->actingAs($admin)
        ->post('/admin/meter-readings', storeReadingPayload([
            'customer_id' => $customer->id,
            'meter_reader_id' => $reader->id,
            'reading_date' => now()->toDateString(),
        ]))
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success');

    expect(MeterReading::count())->toBe(1);
});

test('store accepts the local date right after midnight in the Philippines (UTC is still the previous day)', function () {
    // 12:07 AM on Aug 9 in the Philippines (UTC+8) is still Aug 8 16:07 UTC.
    // The app must treat Aug 9 as "today" — staff in Siquijor recording at the
    // very start of the day must be able to use today's date even though the
    // server clock (in UTC) has not reached Aug 9 yet. Regression test for the
    // timezone mismatch that rejected today's date shortly after midnight.
    //
    // Pin PHP's default timezone so this test is deterministic regardless of
    // what APP_TIMEZONE resolves to in the surrounding environment (a pre-set
    // OS env variable would otherwise override .env / .env.testing).
    date_default_timezone_set('Asia/Manila');

    $this->travelTo(Carbon::parse('2026-08-09 00:07:00', 'Asia/Manila'));

    $admin = makeStoreAdmin();
    $reader = makeStoreReader();
    $customer = makeStoreCustomer(100);

    $this->actingAs($admin)
        ->post('/admin/meter-readings', storeReadingPayload([
            'customer_id' => $customer->id,
            'meter_reader_id' => $reader->id,
            'reading_date' => '2026-08-09',
        ]))
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success');

    expect(MeterReading::count())->toBe(1);
    expect(MeterReading::first()->reading_date->toDateString())->toBe('2026-08-09');
});

test('store still rejects a future date at the Philippines midnight boundary', function () {
    date_default_timezone_set('Asia/Manila');

    $this->travelTo(Carbon::parse('2026-08-09 00:07:00', 'Asia/Manila'));

    $admin = makeStoreAdmin();
    $reader = makeStoreReader();
    $customer = makeStoreCustomer(100);

    $this->actingAs($admin)
        ->post('/admin/meter-readings', storeReadingPayload([
            'customer_id' => $customer->id,
            'meter_reader_id' => $reader->id,
            'reading_date' => '2026-08-10',
        ]))
        ->assertSessionHasErrors('reading_date');

    expect(MeterReading::count())->toBe(0);
});

test('store rejects a meter reading below the latest recorded reading', function () {
    $admin = makeStoreAdmin();
    $reader = makeStoreReader();
    $customer = makeStoreCustomer(100);

    $this->actingAs($admin)
        ->post('/admin/meter-readings', storeReadingPayload([
            'customer_id' => $customer->id,
            'meter_reader_id' => $reader->id,
            'meter_reading' => '50',
        ]))
        ->assertSessionHasErrors('meter_reading');

    expect(MeterReading::count())->toBe(0);
});

test('store accepts a meter reading equal to the previous reading', function () {
    $admin = makeStoreAdmin();
    $reader = makeStoreReader();
    $customer = makeStoreCustomer(100);

    $this->actingAs($admin)
        ->post('/admin/meter-readings', storeReadingPayload([
            'customer_id' => $customer->id,
            'meter_reader_id' => $reader->id,
            'meter_reading' => '100',
        ]))
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success');

    expect(MeterReading::count())->toBe(1);
});

test('create prefills the most recent reading by date as the previous reading', function () {
    $admin = makeStoreAdmin();
    $customer = makeStoreCustomer(100);

    // The newest reading (by date) has a lower value than an older one, so the
    // “previous reading” must be the latest by date — not the max value.
    MeterReading::create([
        'customer_id' => $customer->id,
        'meter_reader_id' => null,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 200,
        'reading_date' => '2026-06-01',
    ]);
    MeterReading::create([
        'customer_id' => $customer->id,
        'meter_reader_id' => null,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 180,
        'reading_date' => '2026-07-01',
    ]);

    $this->actingAs($admin)
        ->get('/admin/meter-readings/create')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/meter-readings/create')
            ->where('previousReadings.'.$customer->id, '180'));
});

test('store rejects a reading date earlier than the customer latest recorded reading date', function () {
    $admin = makeStoreAdmin();
    $reader = makeStoreReader();
    $customer = makeStoreCustomer(100);

    // The customer already has a reading recorded on a later date.
    MeterReading::create([
        'customer_id' => $customer->id,
        'meter_reader_id' => $reader->id,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 150,
        'reading_date' => '2026-08-04',
    ]);

    $this->actingAs($admin)
        ->post('/admin/meter-readings', storeReadingPayload([
            'customer_id' => $customer->id,
            'meter_reader_id' => $reader->id,
            'meter_reading' => '160',
            'reading_date' => '2026-08-01',
        ]))
        ->assertSessionHasErrors('reading_date');

    // Nothing was saved — the earlier date must be rejected.
    expect(MeterReading::count())->toBe(1);
    expect(Bill::count())->toBe(0);
});

test('store rejects a reading date equal to the latest recorded reading date', function () {
    $admin = makeStoreAdmin();
    $reader = makeStoreReader();
    $customer = makeStoreCustomer(100);

    // The customer's most recent reading is on the date we will use.
    MeterReading::create([
        'customer_id' => $customer->id,
        'meter_reader_id' => $reader->id,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 150,
        'reading_date' => '2026-08-04',
    ]);

    $this->actingAs($admin)
        ->post('/admin/meter-readings', storeReadingPayload([
            'customer_id' => $customer->id,
            'meter_reader_id' => $reader->id,
            'meter_reading' => '160',
            'reading_date' => '2026-08-04',
        ]))
        ->assertSessionHasErrors('reading_date', "The reading date must be after the customer's latest recorded reading date (2026-08-04).");

    expect(MeterReading::count())->toBe(1);
    expect(Bill::count())->toBe(0);
});

test('store accepts a reading date the day after the latest recorded reading date', function () {
    $admin = makeStoreAdmin();
    $reader = makeStoreReader();
    $customer = makeStoreCustomer(100);

    MeterReading::create([
        'customer_id' => $customer->id,
        'meter_reader_id' => $reader->id,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 150,
        'reading_date' => '2026-08-04',
    ]);

    $this->actingAs($admin)
        ->post('/admin/meter-readings', storeReadingPayload([
            'customer_id' => $customer->id,
            'meter_reader_id' => $reader->id,
            'meter_reading' => '160',
            'reading_date' => '2026-08-05',
        ]))
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success');

    expect(MeterReading::count())->toBe(2);

    // No bill or payment is generated when the reading is recorded.
    expect(Bill::count())->toBe(0);
    expect(Payment::count())->toBe(0);
});

test('create passes the latest reading date for customers with previous readings only', function () {
    $admin = makeStoreAdmin();
    $customer = makeStoreCustomer(100);

    MeterReading::create([
        'customer_id' => $customer->id,
        'meter_reader_id' => null,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 200,
        'reading_date' => '2026-06-01',
    ]);
    MeterReading::create([
        'customer_id' => $customer->id,
        'meter_reader_id' => null,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 180,
        'reading_date' => '2026-07-01',
    ]);

    $this->actingAs($admin)
        ->get('/admin/meter-readings/create')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/meter-readings/create')
            ->where('latestReadingDates.'.$customer->id, '2026-07-01'));
});

test('store rejects a duplicate reading for the same customer and date', function () {
    $admin = makeStoreAdmin();
    $reader = makeStoreReader();
    $customer = makeStoreCustomer(100);

    MeterReading::create([
        'customer_id' => $customer->id,
        'meter_reader_id' => $reader->id,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 150,
        'reading_date' => '2026-08-04',
    ]);

    $this->actingAs($admin)
        ->post('/admin/meter-readings', storeReadingPayload([
            'customer_id' => $customer->id,
            'meter_reader_id' => $reader->id,
        ]))
        ->assertSessionHasErrors('reading_date');

    expect(MeterReading::count())->toBe(1);
    expect(Bill::count())->toBe(0);
});

test('destroy deletes the reading along with any bill and payment tied to it', function () {
    $admin = makeStoreAdmin();
    $reader = makeStoreReader();
    $customer = makeStoreCustomer(100);

    // Recording a reading no longer creates a bill — simulate one that was
    // generated later by the (separate) billing flow.
    $this->actingAs($admin)
        ->post('/admin/meter-readings', storeReadingPayload([
            'customer_id' => $customer->id,
            'meter_reader_id' => $reader->id,
        ]))
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success');

    $reading = MeterReading::firstOrFail();
    expect(Bill::count())->toBe(0);

    $bill = Bill::create([
        'customer_id' => $customer->id,
        'billing_date' => $reading->reading_date,
        'consumption' => 50,
        'amount' => 250,
        'status' => 'unpaid',
        'due_date' => now()->addDays(15),
    ]);
    Payment::create([
        'customer_id' => $customer->id,
        'bill_id' => $bill->id,
        'payment_method' => 'cash',
        'amount' => 250,
        'reference_number' => 'REF-TEST',
        'status' => 'pending_cash',
    ]);

    $this->actingAs($admin)
        ->delete('/admin/meter-readings/'.$reading->id)
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success', 'Meter reading deleted successfully.');

    // The reading, its bill and its payment are all gone — no orphans.
    expect(MeterReading::count())->toBe(0);
    expect(Bill::count())->toBe(0);
    expect(Payment::count())->toBe(0);
});

test('destroy only removes the bill tied to the deleted reading', function () {
    $admin = makeStoreAdmin();
    $reader = makeStoreReader();
    $customer = makeStoreCustomer(100);

    // Two readings for the same customer on different dates → no bills yet
    // (billing is handled separately). Create a bill for each reading.
    $this->actingAs($admin)->post('/admin/meter-readings', storeReadingPayload([
        'customer_id' => $customer->id,
        'meter_reader_id' => $reader->id,
        'meter_reading' => '150',
        'reading_date' => '2026-08-01',
    ]));
    $this->actingAs($admin)->post('/admin/meter-readings', storeReadingPayload([
        'customer_id' => $customer->id,
        'meter_reader_id' => $reader->id,
        'meter_reading' => '160',
        'reading_date' => '2026-08-02',
    ]));

    expect(MeterReading::count())->toBe(2);
    expect(Bill::count())->toBe(0);

    $older = MeterReading::whereDate('reading_date', '2026-08-01')->firstOrFail();
    $newer = MeterReading::whereDate('reading_date', '2026-08-02')->firstOrFail();

    foreach ([$older, $newer] as $index => $reading) {
        Bill::create([
            'customer_id' => $customer->id,
            'billing_date' => $reading->reading_date,
            'consumption' => $index === 0 ? 50 : 60,
            'amount' => $index === 0 ? 250 : 300,
            'status' => 'unpaid',
            'due_date' => now()->addDays(15),
        ]);
    }

    expect(Bill::count())->toBe(2);

    $this->actingAs($admin)
        ->delete('/admin/meter-readings/'.$older->id)
        ->assertRedirect('/admin/meter-readings');

    expect(MeterReading::count())->toBe(1);
    expect(Bill::count())->toBe(1);
});

test('update rejects moving a reading onto a date that already has one', function () {
    $admin = makeStoreAdmin();
    $reader = makeStoreReader();
    $customer = makeStoreCustomer(100);

    MeterReading::create([
        'customer_id' => $customer->id,
        'meter_reader_id' => $reader->id,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 150,
        'reading_date' => '2026-08-04',
    ]);
    $second = MeterReading::create([
        'customer_id' => $customer->id,
        'meter_reader_id' => $reader->id,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 160,
        'reading_date' => '2026-08-05',
    ]);

    $this->actingAs($admin)
        ->put('/admin/meter-readings/'.$second->id, [
            'customer_id' => $customer->id,
            'meter_reader_id' => $reader->id,
            'meter_reading' => '160',
            'reading_date' => '2026-08-04',
        ])
        ->assertSessionHasErrors('reading_date');

    expect(MeterReading::where('id', $second->id)->value('reading_date'))->not->toBe('2026-08-04');
});

test('store rejects a non-meter-reader staff member as the meter reader', function () {
    $admin = makeStoreAdmin();
    $encoder = User::create([
        'username' => 'store_encoder_'.uniqid(),
        'password' => 'password',
        'role' => 'staff',
        'position' => 'encoder',
    ]);
    $customer = makeStoreCustomer(100);

    $this->actingAs($admin)
        ->post('/admin/meter-readings', storeReadingPayload([
            'customer_id' => $customer->id,
            'meter_reader_id' => $encoder->id,
        ]))
        ->assertSessionHasErrors('meter_reader_id');

    expect(MeterReading::count())->toBe(0);
});
