<?php

/**
 * Feature tests for the admin edit meter reading page (edit/update endpoints).
 *
 * The edit form exposes four editable fields (customer, meter reader, reading
 * date, meter reading). The system fields (ID, recorded by, status, created_at
 * and updated_at) are hidden from the page — updated_at is refreshed
 * automatically by Eloquent on save.
 */

use App\Models\Customer;
use App\Models\MeterReading;
use App\Models\User;
use Inertia\Testing\AssertableInertia;

function makeUpdateAdmin(): User
{
    return User::create([
        'username' => 'update_admin_'.uniqid(),
        'password' => 'password',
        'role' => 'admin',
        'position' => 'administrator',
    ]);
}

function makeUpdateReader(): User
{
    return User::create([
        'username' => 'update_reader_'.uniqid(),
        'password' => 'password',
        'role' => 'staff',
        'position' => 'meter_reader',
    ]);
}

function makeUpdateCustomer(float $initialReading = 0): Customer
{
    return Customer::create([
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'initial_reading' => $initialReading,
    ]);
}

function makeUpdateReading(User $admin, Customer $customer, array $attributes = []): MeterReading
{
    return MeterReading::create(array_merge([
        'customer_id' => $customer->id,
        'meter_reader_id' => null,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 150,
        'reading_date' => '2026-08-04',
    ], $attributes));
}

function updateReadingPayload(array $overrides = []): array
{
    return array_merge([
        'customer_id' => null,
        'meter_reader_id' => null,
        'meter_reading' => '150',
        'reading_date' => '2026-08-04',
    ], $overrides);
}

test('edit renders the form with the reading, customers and meter readers', function () {
    $admin = makeUpdateAdmin();
    $reader = makeUpdateReader();
    $customer = makeUpdateCustomer(100);
    $reading = makeUpdateReading($admin, $customer, ['meter_reader_id' => $reader->id]);

    $this->actingAs($admin)
        ->get('/admin/meter-readings/'.$reading->id.'/edit')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/meter-readings/edit')
            ->where('reading.id', $reading->id)
            ->where('reading.recorded_by_user_id', $admin->id)
            ->where('reading.status', 'pending')
            ->has('customers')
            ->has('previousReadings')
            ->has('latestReadingDates')
            ->has('meterReaders'));
});

test('edit excludes the reading being edited from the previous reading map', function () {
    $admin = makeUpdateAdmin();
    $customer = makeUpdateCustomer(100);

    // An older reading (the true “previous” one)…
    MeterReading::create([
        'customer_id' => $customer->id,
        'meter_reader_id' => null,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 150,
        'reading_date' => '2026-06-01',
    ]);

    // …and the reading being edited, which is the most recent. Its own value
    // must never show up as the previous reading.
    $reading = MeterReading::create([
        'customer_id' => $customer->id,
        'meter_reader_id' => null,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 180,
        'reading_date' => '2026-07-01',
    ]);

    $this->actingAs($admin)
        ->get('/admin/meter-readings/'.$reading->id.'/edit')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->where('previousReadings.'.$customer->id, '150')
            ->where('latestReadingDates.'.$customer->id, '2026-06-01'));
});

test('update persists the editable fields and refreshes updated_at automatically', function () {
    $admin = makeUpdateAdmin();
    $reader = makeUpdateReader();
    $customer = makeUpdateCustomer(100);
    $reading = makeUpdateReading($admin, $customer);
    $createdAt = $reading->created_at;

    // updated_at must never be user-controlled: a value sent in the request is
    // ignored, and the column is refreshed to the current time on save.
    $this->travel(5)->minutes();

    $this->actingAs($admin)
        ->put('/admin/meter-readings/'.$reading->id, [
            'customer_id' => $customer->id,
            'meter_reader_id' => $reader->id,
            'meter_reading' => '160',
            'reading_date' => '2026-08-05',
            'updated_at' => '2020-01-01 00:00:00',
        ])
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success', 'Meter reading updated successfully.');

    $fresh = $reading->fresh();
    expect($fresh->customer_id)->toBe($customer->id);
    expect($fresh->meter_reader_id)->toBe($reader->id);
    expect((float) $fresh->meter_reading)->toBe(160.0);
    expect($fresh->reading_date->toDateString())->toBe('2026-08-05');

    // recorded_by_user_id and status are not editable.
    expect($fresh->recorded_by_user_id)->toBe($admin->id);
    expect($fresh->status)->toBe('pending');

    // updated_at was refreshed by Eloquent — not the value sent in the request.
    expect($fresh->updated_at->toDateTimeString())->not->toBe('2020-01-01 00:00:00');
    expect($fresh->updated_at->greaterThan($createdAt))->toBeTrue();
});

test('update accepts moving the reading to a different customer', function () {
    $admin = makeUpdateAdmin();
    $reader = makeUpdateReader();
    $originalCustomer = makeUpdateCustomer(100);
    $newCustomer = makeUpdateCustomer(50);
    $reading = makeUpdateReading($admin, $originalCustomer);

    $this->actingAs($admin)
        ->put('/admin/meter-readings/'.$reading->id, updateReadingPayload([
            'customer_id' => $newCustomer->id,
            'meter_reader_id' => $reader->id,
            'meter_reading' => '160',
            'reading_date' => '2026-08-05',
        ]))
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success');

    $fresh = $reading->fresh();
    expect($fresh->customer_id)->toBe($newCustomer->id);
    expect((float) $fresh->meter_reading)->toBe(160.0);
});

test('update rejects moving the reading to a customer with a newer reading date', function () {
    $admin = makeUpdateAdmin();
    $reader = makeUpdateReader();
    $originalCustomer = makeUpdateCustomer(100);
    $newCustomer = makeUpdateCustomer(100);

    // The new customer already has a reading on a later date (08-10), so the
    // reading cannot be slotted in behind it on 08-05.
    MeterReading::create([
        'customer_id' => $newCustomer->id,
        'meter_reader_id' => $reader->id,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 300,
        'reading_date' => '2026-08-10',
    ]);

    $reading = makeUpdateReading($admin, $originalCustomer);

    $this->actingAs($admin)
        ->put('/admin/meter-readings/'.$reading->id, updateReadingPayload([
            'customer_id' => $newCustomer->id,
            'meter_reader_id' => $reader->id,
            'meter_reading' => '160',
            'reading_date' => '2026-08-05',
        ]))
        ->assertSessionHasErrors('reading_date');

    expect($reading->fresh()->customer_id)->toBe($originalCustomer->id);
});

test('update rejects a meter reading below the new customer previous reading', function () {
    $admin = makeUpdateAdmin();
    $reader = makeUpdateReader();
    $originalCustomer = makeUpdateCustomer(100);
    $newCustomer = makeUpdateCustomer(100);

    // The new customer's latest reading is 500 — the moved reading must be at
    // least that high.
    MeterReading::create([
        'customer_id' => $newCustomer->id,
        'meter_reader_id' => $reader->id,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 500,
        'reading_date' => '2026-08-01',
    ]);

    $reading = makeUpdateReading($admin, $originalCustomer);

    $this->actingAs($admin)
        ->put('/admin/meter-readings/'.$reading->id, updateReadingPayload([
            'customer_id' => $newCustomer->id,
            'meter_reader_id' => $reader->id,
            'meter_reading' => '400',
            'reading_date' => '2026-08-05',
        ]))
        ->assertSessionHasErrors('meter_reading');

    expect((float) $reading->fresh()->meter_reading)->toBe(150.0);
});

test('update rejects moving the reading to a customer with a reading on the same date', function () {
    $admin = makeUpdateAdmin();
    $reader = makeUpdateReader();
    $originalCustomer = makeUpdateCustomer(100);
    $newCustomer = makeUpdateCustomer(100);

    MeterReading::create([
        'customer_id' => $newCustomer->id,
        'meter_reader_id' => $reader->id,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 300,
        'reading_date' => '2026-08-05',
    ]);

    $reading = makeUpdateReading($admin, $originalCustomer);

    $this->actingAs($admin)
        ->put('/admin/meter-readings/'.$reading->id, updateReadingPayload([
            'customer_id' => $newCustomer->id,
            'meter_reader_id' => $reader->id,
            'meter_reading' => '160',
            'reading_date' => '2026-08-05',
        ]))
        ->assertSessionHasErrors('reading_date');

    expect($reading->fresh()->customer_id)->toBe($originalCustomer->id);
});

test('edit renders the reading with its actual reading date', function () {
    $admin = makeUpdateAdmin();
    $customer = makeUpdateCustomer(100);
    $reading = makeUpdateReading($admin, $customer);

    // The reading_date prop must be the plain calendar date of the record
    // (2026-08-04), never a timezone-shifted ISO timestamp — otherwise the
    // Edit page pre-fills the Reading Date field one day early.
    $this->actingAs($admin)
        ->get('/admin/meter-readings/'.$reading->id.'/edit')
        ->assertOk()
        ->assertInertia(fn (AssertableInertia $page) => $page
            ->component('admin/meter-readings/edit')
            ->where('reading.id', $reading->id)
            ->where('reading.reading_date', '2026-08-04'));
});

test('update allows saving without changing the reading date', function () {
    $admin = makeUpdateAdmin();
    $reader = makeUpdateReader();
    $customer = makeUpdateCustomer(100);
    $reading = makeUpdateReading($admin, $customer);

    // The record's own reading date must not be treated as a duplicate: a user
    // may edit only the meter reading (or the reader) and keep the date.
    $this->actingAs($admin)
        ->put('/admin/meter-readings/'.$reading->id, updateReadingPayload([
            'customer_id' => $customer->id,
            'meter_reader_id' => $reader->id,
            'meter_reading' => '160',
            'reading_date' => '2026-08-04', // unchanged from the record's date
        ]))
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success', 'Meter reading updated successfully.');

    $fresh = $reading->fresh();
    expect($fresh->reading_date->toDateString())->toBe('2026-08-04');
    expect((float) $fresh->meter_reading)->toBe(160.0);

    // The (customer, date) pair still has exactly one record — the save must
    // not trip the unique index.
    expect(MeterReading::where('customer_id', $customer->id)->whereDate('reading_date', '2026-08-04')->count())->toBe(1);
});

test('update rejects moving the reading onto a date already used by the same customer', function () {
    $admin = makeUpdateAdmin();
    $reader = makeUpdateReader();
    $customer = makeUpdateCustomer(100);

    // Another reading for the same customer already occupies 08-01…
    MeterReading::create([
        'customer_id' => $customer->id,
        'meter_reader_id' => null,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 100,
        'reading_date' => '2026-08-01',
    ]);

    // …while the reading being edited is on 08-04.
    $reading = makeUpdateReading($admin, $customer);

    // Moving it onto 08-01 must still be rejected — only the record's own
    // date is exempt from the duplicate check.
    $this->actingAs($admin)
        ->put('/admin/meter-readings/'.$reading->id, updateReadingPayload([
            'customer_id' => $customer->id,
            'meter_reader_id' => $reader->id,
            'meter_reading' => '160',
            'reading_date' => '2026-08-01',
        ]))
        ->assertSessionHasErrors('reading_date');

    expect($reading->fresh()->reading_date->toDateString())->toBe('2026-08-04');
});

test('update requires a customer', function () {
    $admin = makeUpdateAdmin();
    $reader = makeUpdateReader();
    $customer = makeUpdateCustomer(100);
    $reading = makeUpdateReading($admin, $customer);

    $this->actingAs($admin)
        ->put('/admin/meter-readings/'.$reading->id, [
            'meter_reader_id' => $reader->id,
            'meter_reading' => '160',
            'reading_date' => '2026-08-05',
        ])
        ->assertSessionHasErrors('customer_id');

    expect($reading->fresh()->customer_id)->toBe($customer->id);
});
