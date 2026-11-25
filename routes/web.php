<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Index');
})->name('Index');

Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

Route::get('/feedback', function () {
    return Inertia::render('Feedback');
})->name('feedback');

Route::get('/terms', function () {
    return Inertia::render('TermsConditions');
})->name('terms');

Route::get('/privacy', function () {
    return Inertia::render('PrivacyPolicy');
})->name('privacy');

Route::get('/api/announcements', [\App\Http\Controllers\PublicAnnouncementController::class, 'index']);
Route::post('/api/announcements/{announcement}/read', [\App\Http\Controllers\PublicAnnouncementController::class, 'markAsRead'])->middleware('auth');
Route::post('/fcm/token', [\App\Http\Controllers\FcmController::class, 'updateToken'])->middleware('auth');

use App\Http\Controllers\AdminNotificationController;

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    Route::get('bills', [\App\Http\Controllers\BillController::class, 'index'])->name('bills.index');
    Route::get('bills/{bill}', [\App\Http\Controllers\BillController::class, 'show'])->name('bills.show');
    Route::get('payments', [\App\Http\Controllers\PaymentController::class, 'index'])->name('payments.index');
    Route::post('payments', [\App\Http\Controllers\PaymentController::class, 'store'])->name('payments.store');

    // Admin Notifications
    Route::get('/api/admin/notifications', [AdminNotificationController::class, 'index']);
    Route::post('/api/admin/notifications/{id}/read', [AdminNotificationController::class, 'markAsRead']);
    Route::post('/api/admin/notifications/read-all', [AdminNotificationController::class, 'markAllAsRead']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/staff.php';
