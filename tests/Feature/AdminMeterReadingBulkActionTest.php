<?php

/**
 * Feature tests for the admin bulk meter-reading actions: finalizing and
 * deleting several pending readings at once. Finalized records are locked and
 * are never touched by either bulk action, even when their ids are submitted
 * directly.
 */

use App\Models\Bill;
use App\Models\Customer;
use App\Models\MeterReading;
use App\Models\Payment;
use App\Models\User;

function makeBulkAdmin(): User
{
    return User::create([
        'username' => 'bulk_admin_'.uniqid(),
        'password' => 'password',
        'role' => 'admin',
        'position' => 'administrator',
    ]);
}

function makeBulkCustomer(float $initialReading = 0): Customer
{
    return Customer::create([
        'first_name' => 'Maria',
        'last_name' => 'Santos',
        'initial_reading' => $initialReading,
    ]);
}

function makeBulkReading(User $admin, Customer $customer, string $status = 'pending', string $date = '2026-08-04'): MeterReading
{
    return MeterReading::create([
        'customer_id' => $customer->id,
        'meter_reader_id' => null,
        'recorded_by_user_id' => $admin->id,
        'meter_reading' => 150,
        'reading_date' => $date,
        'status' => $status,
    ]);
}

test('bulk finalize locks only the submitted pending readings', function () {
    $admin = makeBulkAdmin();
    $customer = makeBulkCustomer(100);
    $pendingA = makeBulkReading($admin, $customer, 'pending', '2026-08-01');
    $pendingB = makeBulkReading($admin, $customer, 'pending', '2026-08-02');
    $finalized = makeBulkReading($admin, $customer, 'finalized', '2026-08-03');
    $other = makeBulkReading($admin, makeBulkCustomer(50), 'pending', '2026-08-04');

    $this->actingAs($admin)
        ->post('/admin/meter-readings/bulk-finalize', ['ids' => [$pendingA->id, $pendingB->id, $finalized->id]])
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success');

    expect($pendingA->fresh()->status)->toBe('finalized');
    expect($pendingB->fresh()->status)->toBe('finalized');
    // The finalized reading in the request and the unrelated pending reading
    // are left untouched.
    expect($finalized->fresh()->status)->toBe('finalized');
    expect($other->fresh()->status)->toBe('pending');
});

test('bulk finalize with only finalized ids reports an error and changes nothing', function () {
    $admin = makeBulkAdmin();
    $customer = makeBulkCustomer(100);
    $finalized = makeBulkReading($admin, $customer, 'finalized');

    $this->actingAs($admin)
        ->post('/admin/meter-readings/bulk-finalize', ['ids' => [$finalized->id]])
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('error');

    expect($finalized->fresh()->status)->toBe('finalized');
});

test('bulk finalize requires at least one id', function () {
    $admin = makeBulkAdmin();

    $this->actingAs($admin)
        ->post('/admin/meter-readings/bulk-finalize', ['ids' => []])
        ->assertSessionHasErrors('ids');
});

test('bulk delete removes pending readings along with their bills and payments', function () {
    $admin = makeBulkAdmin();
    $customer = makeBulkCustomer(100);
    $reading = makeBulkReading($admin, $customer, 'pending');

    $bill = Bill::create([
        'customer_id' => $customer->id,
        'billing_date' => '2026-08-04',
        'consumption' => 50,
        'amount' => 500,
        'due_date' => '2026-08-18',
    ]);
    Payment::create([
        'customer_id' => $customer->id,
        'bill_id' => $bill->id,
        'payment_method' => 'gcash',
        'amount' => 500,
        'status' => 'paid',
    ]);

    $this->actingAs($admin)
        ->delete('/admin/meter-readings/bulk-delete', ['ids' => [$reading->id]])
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('success');

    expect(MeterReading::count())->toBe(0);
    expect(Bill::count())->toBe(0);
    expect(Payment::count())->toBe(0);
});

test('bulk delete skips finalized readings', function () {
    $admin = makeBulkAdmin();
    $customer = makeBulkCustomer(100);
    $pending = makeBulkReading($admin, $customer, 'pending', '2026-08-01');
    $finalized = makeBulkReading($admin, $customer, 'finalized', '2026-08-02');

    $this->actingAs($admin)
        ->delete('/admin/meter-readings/bulk-delete', ['ids' => [$pending->id, $finalized->id]])
        ->assertRedirect('/admin/meter-readings');

    expect(MeterReading::find($pending->id))->toBeNull();
    expect(MeterReading::find($finalized->id))->not->toBeNull();
});

test('bulk delete with only finalized ids reports an error and changes nothing', function () {
    $admin = makeBulkAdmin();
    $customer = makeBulkCustomer(100);
    $finalized = makeBulkReading($admin, $customer, 'finalized');

    $this->actingAs($admin)
        ->delete('/admin/meter-readings/bulk-delete', ['ids' => [$finalized->id]])
        ->assertRedirect('/admin/meter-readings')
        ->assertSessionHas('error');

    expect(MeterReading::count())->toBe(1);
});

test('bulk delete requires at least one id', function () {
    $admin = makeBulkAdmin();

    $this->actingAs($admin)
        ->delete('/admin/meter-readings/bulk-delete', ['ids' => []])
        ->assertSessionHasErrors('ids');
});
