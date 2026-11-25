<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\CustomerManagementController;
use App\Http\Controllers\Admin\AdminBillController;
use App\Http\Controllers\Admin\AdminMeterReadingController;
use App\Http\Controllers\Admin\AdminPaymentController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\AnnouncementController;

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {

    // Dashboard
    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    // User Management (Staff/Accounts)
    Route::get('users', [UserManagementController::class, 'index'])->name('users.index');
    Route::get('users/create', [UserManagementController::class, 'create'])->name('users.create');
    Route::post('users', [UserManagementController::class, 'store'])->name('users.store');
    Route::get('users/{user}/edit', [UserManagementController::class, 'edit'])->name('users.edit');
    Route::put('users/{user}', [UserManagementController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [UserManagementController::class, 'destroy'])->name('users.destroy');

    // Customer Management (Households)
    Route::get('customers', [CustomerManagementController::class, 'index'])->name('customers.index');
    Route::get('customers/create', [CustomerManagementController::class, 'create'])->name('customers.create');
    Route::post('customers', [CustomerManagementController::class, 'store'])->name('customers.store');
    Route::get('customers/{customer}', [CustomerManagementController::class, 'show'])->name('customers.show');
    Route::get('customers/{customer}/edit', [CustomerManagementController::class, 'edit'])->name('customers.edit');
    Route::put('customers/{customer}', [CustomerManagementController::class, 'update'])->name('customers.update');
    Route::delete('customers/{customer}', [CustomerManagementController::class, 'destroy'])->name('customers.destroy');
    Route::post('customers/{customer}/link-account', [CustomerManagementController::class, 'linkAccount'])->name('customers.link-account');

    // Billing Management
    Route::get('bills', [AdminBillController::class, 'index'])->name('bills.index');
    Route::get('bills/{bill}', [AdminBillController::class, 'show'])->name('bills.show');
    Route::delete('bills/{bill}', [AdminBillController::class, 'destroy'])->name('bills.destroy');

    // Meter Readings
    Route::get('meter-readings', [\App\Http\Controllers\Admin\AdminMeterReadingController::class, 'index'])->name('meter-readings.index');
    Route::get('meter-readings/create', [\App\Http\Controllers\Admin\AdminMeterReadingController::class, 'create'])->name('meter-readings.create');
    Route::post('meter-readings', [\App\Http\Controllers\Admin\AdminMeterReadingController::class, 'store'])->name('meter-readings.store');
    Route::post('meter-readings/import', [\App\Http\Controllers\Admin\AdminMeterReadingController::class, 'import'])->name('meter-readings.import');
    Route::get('meter-readings/template', [\App\Http\Controllers\Admin\AdminMeterReadingController::class, 'downloadTemplate'])->name('meter-readings.template');
    // Bulk actions are registered before the {reading} routes so the literal
    // 'bulk-approve' / 'bulk-delete' segments are never caught by route model
    // binding as reading ids.
    Route::post('meter-readings/bulk-approve', [\App\Http\Controllers\Admin\AdminMeterReadingController::class, 'bulkApprove'])->name('meter-readings.bulk-approve');
    Route::delete('meter-readings/bulk-delete', [\App\Http\Controllers\Admin\AdminMeterReadingController::class, 'bulkDestroy'])->name('meter-readings.bulk-delete');
    Route::post('meter-readings/{reading}/approve', [\App\Http\Controllers\Admin\AdminMeterReadingController::class, 'approve'])->name('meter-readings.approve');
    Route::get('meter-readings/{reading}/edit', [\App\Http\Controllers\Admin\AdminMeterReadingController::class, 'edit'])->name('meter-readings.edit');
    Route::put('meter-readings/{reading}', [\App\Http\Controllers\Admin\AdminMeterReadingController::class, 'update'])->name('meter-readings.update');
    Route::delete('meter-readings/{reading}', [\App\Http\Controllers\Admin\AdminMeterReadingController::class, 'destroy'])->name('meter-readings.destroy');

    // Payment Management
    Route::get('payments', [AdminPaymentController::class, 'index'])->name('payments.index');
    Route::post('payments/{payment}/confirm-cash', [AdminPaymentController::class, 'confirmCash'])->name('payments.confirm-cash');
    Route::post('payments/{payment}/reject-cash', [AdminPaymentController::class, 'rejectCash'])->name('payments.reject-cash');

    // Reports
    Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('activity-log', [\App\Http\Controllers\Admin\ActivityLogController::class, 'index'])->name('activity-log');

    // Settings
    Route::get('settings', [SettingsController::class, 'index'])->name('settings.index');
    Route::put('settings', [SettingsController::class, 'update'])->name('settings.update');

    // Announcements
    Route::resource('announcements', \App\Http\Controllers\Admin\AnnouncementController::class);
});
