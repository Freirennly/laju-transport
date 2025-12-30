<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * Class Reservation
 * Model utama untuk menyimpan data transaksi reservasi tiket.
 */
class Reservation extends Model
{
    use SoftDeletes; 

    protected $fillable = [
        'user_id',
        'transport_schedule_id',
        'booking_code',
        'passengers_count',
        'total_price',
        'payment_method',
        'payment_status',
        'status',
        'qr_token',
        'checked_in_at'
    ];

    /**
     * Casting tipe data otomatis.
     * checked_in_at dikonversi menjadi instance Carbon.
     */
    protected $casts = [
        'checked_in_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'total_price' => 'decimal:2',
    ];

    /**
     * Scope untuk mengambil reservasi yang masih aktif (belum dibatalkan).
     */
    public function scopeActive($query)
    {
        return $query->whereIn('status', ['BOOKED', 'PAID']);
    }

    /**
     * Relasi ke jadwal transportasi.
     * Menggunakan withTrashed() agar history tetap ada walau jadwal dihapus.
     */
    public function schedule(): BelongsTo
    {
        return $this->belongsTo(TransportSchedule::class, 'transport_schedule_id')->withTrashed();
    }

    /**
     * Relasi ke user pemesan.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id')->withTrashed();
    }

    public function cancellation(): HasOne
    {
        return $this->hasOne(CancellationRequest::class);
    }
}