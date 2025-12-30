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
        Schema::table('users', function (Blueprint $table) {
            // INI YANG DITAMBAHKAN:
            // Menambah kolom 'role' setelah kolom 'password'
            // Default-nya adalah 'user', opsinya cuma 'admin' atau 'user'
            $table->enum('role', ['admin', 'user'])->default('user')->after('password');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // INI UNTUK MENGHAPUS KOLOM JIKA ROLLBACK
            $table->dropColumn('role');
        });
    }
};