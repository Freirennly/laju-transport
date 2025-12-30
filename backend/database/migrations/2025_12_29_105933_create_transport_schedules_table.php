<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('transport_schedules', function (Blueprint $table) {
            $table->id();
            $table->string('route'); // Pastikan baris-baris ini ada!
            $table->dateTime('departure_time');
            $table->integer('capacity');
            $table->decimal('price', 10, 2);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transport_schedules');
    }
};
