<?php

use Illuminate\Support\Facades\Route; 
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TransportScheduleController;
use App\Http\Controllers\Api\ReservationController; 
use App\Http\Controllers\Api\CancellationController;
use App\Http\Controllers\Api\DashboardController; 
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\AdvancedController;
use App\Http\Controllers\Api\ReportController; 

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- FALLBACK ROUTE (PENTING AGAR TIDAK CRASH) ---
Route::get('/login_fallback', function(){
    return response()->json(['message' => 'Unauthenticated.'], 401);
})->name('login_fallback');


// === PUBLIC ROUTES ===
Route::middleware('throttle:60,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::get('/schedules', [TransportScheduleController::class, 'index']);
    Route::get('/blogs', [BlogController::class, 'index']); 
    Route::get('/blogs/{slug}', [BlogController::class, 'show']);
    Route::get('/system/maintenance', [AdvancedController::class, 'checkMaintenance']);
    
    // Check-in Public
    Route::post('/check-in', [ReservationController::class, 'checkIn']);
});

// === PROTECTED ROUTES (User Login) ===
Route::middleware('auth:api')->group(function () {
    
    // Auth & Profile
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/password', [AuthController::class, 'changePassword']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markRead']);

    // User Reservation Flow
    Route::get('/my-reservations', [ReservationController::class, 'myReservations']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::post('/reservations/{id}/cancel', [CancellationController::class, 'requestCancellation']);
    Route::post('/reservations/{id}/pay', [PaymentController::class, 'sandboxPay']);
    Route::post('/reviews', [AdvancedController::class, 'submitReview']);

    // Staff Features
    Route::post('/staff/checkin-qr', [StaffController::class, 'checkInQR']);
    Route::post('/staff/checkin', [StaffController::class, 'checkInQR']);
    Route::get('/staff/bookings/today', [StaffController::class, 'getTodayBookings']);
    Route::get('/staff/manifest/{scheduleId}', [AdvancedController::class, 'getManifest']);
    Route::post('/staff/undo-checkin/{id}', [App\Http\Controllers\Api\ReservationController::class, 'undoCheckIn']);
});

// === ADMIN ROUTES ===
Route::middleware(['auth:api', 'is_admin'])->group(function () {
    
    // Dashboard & Stats
    Route::get('/admin/dashboard', [DashboardController::class, 'index']);
    Route::get('/admin/export/bookings', [ReportController::class, 'exportBookings']);

    // Manajemen Jadwal
    Route::post('/admin/schedules', [TransportScheduleController::class, 'store']);
    Route::put('/admin/schedules/{id}', [TransportScheduleController::class, 'update']);
    Route::delete('/admin/schedules/{id}', [TransportScheduleController::class, 'destroy']);
    
    // Manajemen Pembatalan & Refund
    Route::get('/admin/cancellations', [CancellationController::class, 'index']);
    Route::post('/admin/cancellations/{id}', [CancellationController::class, 'process']);
    Route::post('/admin/refund/{id}', [PaymentController::class, 'refund']);
    
    // Manajemen Blog
    Route::get('/admin/blogs', [BlogController::class, 'adminIndex']);
    Route::post('/admin/blogs', [BlogController::class, 'store']);
    Route::put('/admin/blogs/{id}', [BlogController::class, 'update']);
    Route::delete('/admin/blogs/{id}', [BlogController::class, 'destroy']);
    
    // Manajemen User
    Route::get('/admin/users', [UserController::class, 'index']);       
    Route::post('/admin/users', [UserController::class, 'store']);      
    Route::delete('/admin/users/{id}', [UserController::class, 'destroy']); 

    // System Config
    Route::post('/admin/trigger-reminders', [AdvancedController::class, 'triggerReminders']); 
    Route::post('/admin/maintenance', [AdvancedController::class, 'toggleMaintenance']);
});