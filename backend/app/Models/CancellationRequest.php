<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CancellationRequest extends Model
{
    protected $fillable = [
        'reservation_id',
        'reason',
        'status',
        'admin_note'
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}