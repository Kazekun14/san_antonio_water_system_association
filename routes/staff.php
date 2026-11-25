<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Staff\StaffDashboardController;
use App\Http\Controllers\Staff\MeterReadingController;
use App\Http\Controllers\Staff\StaffBillController;
use App\Http\Controllers\Staff\StaffPaymentController;
use App\Http\Controllers\Staff\ReceiptController;

Route::middleware(['auth', 'role:admin,staff'])->prefix('staff')->name('staff.')->group(function () {

    // Dashboard
    Route::get('dashboard', [StaffDashboardController::class, 'index'])->name('dashboard');

    // Customer List (read-only)
    Route::get('customers', [StaffDashboardController::class, 'customers'])->name('customers.index');

    // Meter Readings
    Route::get('meter-readings', [MeterReadingController::class, 'index'])->name('meter-readings.index');
    Route::get('meter-readings/create', [MeterReadingController::class, 'create'])->name('meter-readings.create');
    Route::post('meter-readings', [MeterReadingController::class, 'store'])->name('meter-readings.store');
    Route::post('meter-readings/import', [MeterReadingController::class, 'import'])->name('meter-readings.import');
    Route::get('meter-readings/template', [MeterReadingController::class, 'downloadTemplate'])->name('meter-readings.template');

    // Bills
    Route::get('bills', [StaffBillController::class, 'index'])->name('bills.index');
    Route::get('bills/{bill}', [StaffBillController::class, 'show'])->name('bills.show');

    // Payments
    Route::get('payments', [StaffPaymentController::class, 'index'])->name('payments.index');
    Route::post('payments/cash', [StaffPaymentController::class, 'recordCash'])->name('payments.cash');
    Route::patch('payments/{payment}/verify', [StaffPaymentController::class, 'verify'])->name('payments.verify');

    // Receipts
    Route::get('receipts/{payment}', [ReceiptController::class, 'show'])->name('receipts.show');
});
