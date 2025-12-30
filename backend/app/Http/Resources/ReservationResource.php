<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;


class ReservationResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'booking_code' => (string) $this->booking_code,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'passengers_count' => (int) $this->passengers_count,
            'total_price' => (float) $this->total_price,
            
            'checked_in_at' => ($this->checked_in_at instanceof Carbon) 
                ? $this->checked_in_at->toIso8601String() 
                : null,
                
            'created_at' => ($this->created_at instanceof Carbon) 
                ? $this->created_at->toIso8601String() 
                : null,
            
            'qr_token' => $this->qr_token,
            
            'schedule' => [
                'id' => $this->schedule?->id,
                'route' => $this->schedule?->route ?? 'Jadwal Tidak Ditemukan (Dihapus)',
                'departure_time' => ($this->schedule?->departure_time instanceof Carbon)
                    ? $this->schedule->departure_time->toIso8601String()
                    : null,
                'arrival_time' => ($this->schedule?->arrival_time instanceof Carbon)
                    ? $this->schedule->arrival_time->toIso8601String()
                    : null,
                'price' => (float) ($this->schedule?->price ?? 0),
                'capacity' => (int) ($this->schedule?->capacity ?? 0),
            ],
            
            'user' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name ?? 'Pengguna Terhapus',
                'email' => $this->user?->email ?? '-',
                'phone' => $this->user?->phone ?? '-',
            ],
        ];
    }
}