<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TransportSchedule extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'route',
        'departure_time',
        'capacity',
        'price',
        'status'
    ];

    protected $casts = [
        'departure_time' => 'datetime', 
        'price' => 'decimal:2',
    ];

    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }
}