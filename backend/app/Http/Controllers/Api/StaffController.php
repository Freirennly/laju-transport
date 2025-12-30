<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reservation;
use App\Models\TransportSchedule;
use Carbon\Carbon;

class StaffController extends Controller
{
    /**
     * Get Bookings for Today (Manifest)
     * Mengambil semua reservasi yang jadwalnya HARI INI
     */
    public function getTodayBookings()
    {
        $today = Carbon::today()->toDateString();

        $bookings = Reservation::with(['user', 'schedule'])
            ->whereHas('schedule', function ($query) use ($today) {
                $query->whereDate('departure_time', $today);
            })
            ->whereIn('status', ['BOOKED', 'PAID', 'CHECKED_IN']) 
            ->orderBy('status', 'asc') 
            ->get();

        return response()->json([
            'status' => true,
            'data' => $bookings
        ]);
    }

    /**
     * Staff Check-in via Code/QR
     * Logic sama dengan Public check-in tapi tanpa validasi email ketat
     */
    public function checkInQR(Request $request)
    {
        $request->validate([
            'booking_code' => 'required|string'
        ]);

        $reservation = Reservation::with(['user', 'schedule'])
            ->where('booking_code', $request->booking_code)
            ->first();

        if (!$reservation) {
            return response()->json(['message' => 'Kode booking tidak ditemukan.'], 404);
        }

        // Cek status
        if ($reservation->status === 'CHECKED_IN') {
            return response()->json(['message' => 'Penumpang ini SUDAH check-in.'], 400);
        }

        if (!in_array($reservation->status, ['BOOKED', 'PAID'])) {
            return response()->json(['message' => 'Status tiket tidak valid: ' . $reservation->status], 400);
        }

        // Update
        $reservation->update([
            'status' => 'CHECKED_IN',
            'checked_in_at' => now()
        ]);

        return response()->json([
            'message' => 'Check-in berhasil',
            'data' => $reservation
        ]);
    }
}