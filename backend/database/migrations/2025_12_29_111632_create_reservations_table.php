<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * MIGRATION CLEAN UNTUK RESERVATIONS TABLE
     * 
     * Gunakan setelah:
     * 1. Hapus semua migration lama yang modifikasi reservations
     * 2. Buat migration baru ini (create_reservations_table)
     * 3. Jalankan: php artisan migrate:fresh
     * 
     * Struktur ini FINAL & TIDAK ADA DUPLIKASI
     */
    
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            
            // Foreign Keys
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();
            
            $table->foreignId('transport_schedule_id')
                ->constrained('transport_schedules')
                ->cascadeOnDelete();

            // Booking Info
            $table->string('booking_code')->unique();
            $table->uuid('qr_token')->nullable()->unique();
            
            // Passenger & Price
            $table->integer('passengers_count');
            $table->decimal('total_price', 12, 2)->default(0);

            // Status & Payment
            $table->enum('status', [
                'BOOKED',
                'PAID',
                'CANCELLED',
                'CHECKED_IN',
                'CANCEL_REQUESTED'
            ])->default('BOOKED');
            
            $table->enum('payment_method', ['sandbox'])->nullable();
            $table->enum('payment_status', [
                'unpaid',
                'paid',
                'refunded'
            ])->default('unpaid');

            // Check-in
            $table->timestamp('checked_in_at')->nullable();
            
            // Soft Delete & Timestamps
            $table->softDeletes();
            $table->timestamps();

            // Indexes untuk fast lookup
            $table->index('user_id');
            $table->index('transport_schedule_id');
            $table->index('status');
            $table->index('payment_status');
            $table->index('booking_code');
            $table->index('qr_token');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};