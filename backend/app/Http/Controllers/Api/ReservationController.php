<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;  
use Illuminate\Support\Str;
use App\Models\Reservation;
use App\Models\TransportSchedule;
use App\Http\Resources\ReservationResource;

/**
 * ReservationController
 * Handle semua operasi reservasi: create, read, check-in, payment
 */
class ReservationController extends Controller
{
    /**
     * LIST RIWAYAT RESERVASI USER
     * GET /api/my-reservations
     * 
     * @param Request $request
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function myReservations(Request $request)
    {
        // Load dengan relasi untuk menghindari N+1 query
        $reservations = Reservation::with(['schedule', 'user'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        // Transform ke ReservationResource (yang sudah handle null)
        return ReservationResource::collection($reservations);
    }

    /**
     * CREATE RESERVASI BARU
     * POST /api/reservations
     * 
     * Body:
     * {
     *   "transport_schedule_id": 1,
     *   "passengers_count": 2
     * }
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'transport_schedule_id' => 'required|exists:transport_schedules,id',
            'passengers_count' => 'required|integer|min:1|max:10'
        ]);

        return DB::transaction(function () use ($request) {
            // Lock jadwal untuk mencegah race condition
            $schedule = TransportSchedule::lockForUpdate()
                ->findOrFail($request->transport_schedule_id);

            // Validasi jadwal aktif
            if ($schedule->status !== 'active') {
                return response()->json([
                    'message' => 'Jadwal tidak aktif'
                ], 400);
            }

            // Validasi kapasitas
            if ($schedule->capacity < $request->passengers_count) {
                return response()->json([
                    'message' => 'Kapasitas tidak mencukupi. Tersisa: ' . $schedule->capacity
                ], 400);
            }

            // Kurangi kapasitas
            $schedule->capacity -= $request->passengers_count;
            $schedule->save();

            // Hitung total harga
            $totalPrice = $schedule->price * $request->passengers_count;

            // Create reservasi
            $reservation = Reservation::create([
                'user_id' => $request->user()->id,
                'transport_schedule_id' => $request->transport_schedule_id,
                'passengers_count' => $request->passengers_count,
                'booking_code' => 'TRX-' . strtoupper(Str::random(8)),
                'qr_token' => Str::uuid(),
                'total_price' => $totalPrice,
                'status' => 'BOOKED',
                'payment_status' => 'unpaid'
            ]);

            // Load relasi untuk response
            $reservation->load(['schedule', 'user']);

            return response()->json(
                new ReservationResource($reservation),
                201
            );
        });
    }

    /**
     * CHECK-IN RESERVASI
     * POST /api/check-in
     * 
     * Body:
     * {
     *   "booking_code": "TRX-ABC12345",
     *   "email": "user@example.com"
     * }
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkIn(Request $request)
    {
        $request->validate([
            'booking_code' => 'required|string',
            'email' => 'nullable|email' // Email opsional jika via staff, wajib jika public
        ]);

        // 1. Cari Data Reservasi
        $reservation = Reservation::with(['schedule', 'user'])
            ->where('booking_code', $request->booking_code)
            ->first();

        if (!$reservation) {
            return response()->json(['message' => 'Kode booking tidak ditemukan.'], 404);
        }

        // 2. Validasi Email (Hanya untuk Public Check-in)
        // Jika request membawa email, validasi harus cocok.
        if ($request->has('email') && $request->email) {
            if (strtolower($reservation->user->email) !== strtolower($request->email)) {
                return response()->json(['message' => 'Email tidak sesuai dengan data pemesanan.'], 400);
            }
        }

        // 3. Validasi Status
        // Izinkan jika status BOOKED (belum bayar tapi mau checkin? tergantung kebijakan) atau PAID (sudah lunas)
        if (!in_array($reservation->status, ['BOOKED', 'PAID'])) {
            if ($reservation->status === 'CHECKED_IN') {
                return response()->json(['message' => 'Penumpang ini SUDAH check-in sebelumnya.'], 400);
            }
            if ($reservation->status === 'CANCELLED') {
                return response()->json(['message' => 'Tiket telah DIBATALKAN.'], 400);
            }
        }

        // 4. Update Status
        $reservation->update([
            'status' => 'CHECKED_IN',
            'checked_in_at' => now()
        ]);

        return response()->json([
            'message' => 'Check-in berhasil',
            'data' => [
                'booking_code' => $reservation->booking_code,
                'passenger_name' => $reservation->user->name,
                'route' => $reservation->schedule->route,
                'status' => 'CHECKED_IN'
            ]
        ]);
    }


    /**
     * GET DETAIL SATU RESERVASI
     * GET /api/reservations/{id}
     * 
     * @param int $id
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id, Request $request)
    {
        try {
            $reservation = Reservation::with(['schedule', 'user'])
                ->where('id', $id)
                ->where('user_id', $request->user()->id)
                ->firstOrFail();

            return response()->json(new ReservationResource($reservation));

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::warning('Reservation not found: ' . $id);
            return response()->json([
                'message' => 'Reservasi tidak ditemukan'
            ], 404);
        }
    }
    /**
     * UNDO CHECK-IN RESERVASI
     * POST /api/staff/undo-checkin/{id}
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function undoCheckIn($id)
    {
        $reservation = Reservation::findOrFail($id);

        if ($reservation->status !== 'CHECKED_IN') {
            return response()->json(['message' => 'Hanya status CHECKED_IN yang bisa dibatalkan.'], 400);
        }

        // Kembalikan status berdasarkan pembayaran
        $newStatus = ($reservation->payment_status === 'paid') ? 'PAID' : 'BOOKED';

        $reservation->update([
            'status' => $newStatus,
            'checked_in_at' => null
        ]);

        return response()->json([
            'message' => 'Check-in berhasil dibatalkan.',
            'data' => $reservation
        ]);
    }
}