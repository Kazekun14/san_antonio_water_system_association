<?php

/**
 * Feature tests for the admin meter-reading finalize action and the
 * finalized (locked) behavior: finalized readings cannot be finalized again,
 * edited, updated, or deleted — even through direct requests.
 */

use App\Models\Bill;
use App\Models\Customer;
use App\Models\MeterReading;
use App\Models\User;

function makeFinalizeAdmin(): User
{
    return User::create([
        'username' => 'finalize_admin_'.uniqid(),
        'password' => 'password',
        'role' => 'admin',
        'position' => 'administrator',
    ]);
}

function makeFinalizeReader(): User
{
    return User::create([
        'username' => 'finalize_reader_'.uniqid(),
        'password' => 'password',
        'role' => 'staff',
        'position' => 'meter_reader',
    ]);
}

function makeFinalizeCustomer(float $initialReading = 0): Customer
{
    return Customer::create([
        'first_name' => 'Juan',
        'last_name' => 'Dela Cruz',
        'initial_reading' => $initialReading,
    ]);
}

function makeFinalizeReading(User $admin, Customer $customer, string $status = 'pending'): MeterReading
{
    return MeterReading::create([
        'customer_id' => $customer->id,
        'meter_reader_id' => null,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 150,
        'reading_date' => '2026-08-04',
        'status' => $status,
    ]);
}

test('readings recorded through the store endpoint default to pending', function () {
    $admin = makeFinalizeAdmin();
    $reader = makeFinalizeReader();
    $customer = makeFinalizeCustomer(100);

    $this->actingAs($admin)
        ->post('/admin/meter-readings', [
            'customer_id' => $customer->id,
            'meter_reader_id' => $reader->id,
            'meter_reading' => '150',
            'reading_date' => '2026-08-04',
        ])
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success');

    // Both manually recorded and Excel-imported readings are created through
    // MeterReading::create, so they share the same pending default.
    $reading = MeterReading::firstOrFail();
    expect($reading->status)->toBe('pending');
    expect(Bill::count())->toBe(0);
});

test('finalize locks a pending reading', function () {
    $admin = makeFinalizeAdmin();
    $customer = makeFinalizeCustomer(100);
    $reading = makeFinalizeReading($admin, $customer);

    $this->actingAs($admin)
        ->post('/admin/meter-readings/'.$reading->id.'/finalize')
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success', 'Meter reading finalized successfully.');

    expect($reading->fresh()->status)->toBe('finalized');
});

test('finalize rejects a reading that is already finalized', function () {
    $admin = makeFinalizeAdmin();
    $customer = makeFinalizeCustomer(100);
    $reading = makeFinalizeReading($admin, $customer, 'finalized');

    $this->actingAs($admin)
        ->post('/admin/meter-readings/'.$reading->id.'/finalize')
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('error');

    expect($reading->fresh()->status)->toBe('finalized');
});

test('edit is blocked for finalized readings', function () {
    $admin = makeFinalizeAdmin();
    $customer = makeFinalizeCustomer(100);
    $reading = makeFinalizeReading($admin, $customer, 'finalized');

    $this->actingAs($admin)
        ->get('/admin/meter-readings/'.$reading->id.'/edit')
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('error');
});

test('update is blocked for finalized readings', function () {
    $admin = makeFinalizeAdmin();
    $reader = makeFinalizeReader();
    $customer = makeFinalizeCustomer(100);
    $reading = makeFinalizeReading($admin, $customer, 'finalized');

    $this->actingAs($admin)
        ->put('/admin/meter-readings/'.$reading->id, [
            'customer_id' => $customer->id,
            'meter_reader_id' => $reader->id,
            'meter_reading' => '160',
            'reading_date' => '2026-08-05',
        ])
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('error');

    // The finalized reading is untouched.
    $fresh = $reading->fresh();
    expect($fresh->status)->toBe('finalized');
    expect((float) $fresh->meter_reading)->toBe(150.0);
});

test('destroy is blocked for finalized readings', function () {
    $admin = makeFinalizeAdmin();
    $customer = makeFinalizeCustomer(100);
    $reading = makeFinalizeReading($admin, $customer, 'finalized');

    $this->actingAs($admin)
        ->delete('/admin/meter-readings/'.$reading->id)
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('error');

    expect(MeterReading::count())->toBe(1);
});

test('pending readings remain editable and deletable', function () {
    $admin = makeFinalizeAdmin();
    $reader = makeFinalizeReader();
    $customer = makeFinalizeCustomer(100);
    $reading = makeFinalizeReading($admin, $customer, 'pending');

    // Edit form is reachable for pending readings.
    $this->actingAs($admin)
        ->get('/admin/meter-readings/'.$reading->id.'/edit')
        ->assertOk();

    // Update succeeds for pending readings.
    $this->actingAs($admin)
        ->put('/admin/meter-readings/'.$reading->id, [
            'customer_id' => $customer->id,
            'meter_reader_id' => $reader->id,
            'meter_reading' => '160',
            'reading_date' => '2026-08-05',
        ])
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success');

    expect($reading->fresh()->status)->toBe('pending');

    // Delete succeeds for pending readings.
    $this->actingAs($admin)
        ->delete('/admin/meter-readings/'.$reading->id)
        ->assertRedirect('/admin/meter-readings');

    expect(MeterReading::count())->toBe(0);
});
