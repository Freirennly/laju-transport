<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; 
return new class extends Migration
{
    public function up()
    {
        // 1. Soft Deletes
        Schema::table('transport_schedules', function (Blueprint $table) {
            $table->softDeletes();
        });
        Schema::table('users', function (Blueprint $table) {
            $table->softDeletes();
        });

        // 2. Tabel Reviews
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('reservation_id')->constrained();
            $table->integer('rating');
            $table->text('comment')->nullable();
            $table->timestamps();
        });

        // 3. Tabel Settings
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->string('value');
            $table->timestamps();
        });

        // Seed default setting (Ini yang bikin error sebelumnya)
        DB::table('settings')->insert([
            ['key' => 'maintenance_mode', 'value' => 'false', 'created_at' => now(), 'updated_at' => now()]
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('settings');
        Schema::table('transport_schedules', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
        Schema::table('users', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};