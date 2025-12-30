<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reservation;
use Illuminate\Support\Facades\DB; // Wajib ada untuk transaction
// Pastikan file ActivityLogger sudah dibuat di folder App/Helpers
use App\Helpers\ActivityLogger; 

class PaymentController extends Controller
{
    // USER: BAYAR (SANDBOX)
    public function sandboxPay($id)
    {
        $reservation = Reservation::findOrFail($id);

        if ($reservation->payment_status === 'paid') {
            return response()->json([
                'status' => false,
                'message' => 'Reservasi sudah dibayar sebelumnya'
            ], 400);
        }

        // Update Payment & Status Utama
        $reservation->update([
            'payment_method' => 'sandbox',
            'payment_status' => 'paid',
            'status' => 'PAID' // Update status utama jadi PAID agar tiket valid
        ]);

        // Catat Log (Opsional: Cek jika class ada agar tidak error)
        if (class_exists(ActivityLogger::class)) {
            ActivityLogger::log('Payment', 'PAID', "User melakukan pembayaran untuk kode: {$reservation->booking_code}");
        }

        return response()->json([
            'status' => true,
            'message' => 'Pembayaran berhasil',
            'data' => [
                'booking_code' => $reservation->booking_code,
                'status' => $reservation->status,
                'payment_status' => $reservation->payment_status,
                'amount' => $reservation->total_price
            ]
        ]);
    }

    // ADMIN: REFUND MANUAL
    public function refund($reservationId)
    {
        // Gunakan Transaction agar aman (rollback jika error)
        return DB::transaction(function () use ($reservationId) {
            $reservation = Reservation::with('schedule')->findOrFail($reservationId);

            // Validasi
            if ($reservation->payment_status !== 'paid') {
                return response()->json([
                    'status' => false,
                    'message' => 'Hanya transaksi LUNAS yang bisa di-refund'
                ], 400);
            }

            if ($reservation->payment_status === 'refunded') {
                return response()->json([
                    'status' => false,
                    'message' => 'Transaksi sudah direfund sebelumnya'
                ], 400);
            }

            // 1. Update Status Pembayaran
            $reservation->payment_status = 'refunded';
            
            // 2. Update Status Reservasi & Kembalikan Kuota
            if ($reservation->status !== 'CANCELLED') {
                $reservation->status = 'CANCELLED';
                
                // PENTING: Kembalikan Kuota Kursi ke Jadwal
                if ($reservation->schedule) {
                    $reservation->schedule->increment('capacity', $reservation->passengers_count);
                }
            }

            $reservation->save();

            // 3. Update Status Request Pembatalan (Jika ada request dari user)
            if ($reservation->cancellation) {
                $reservation->cancellation->update([
                    'status' => 'APPROVED',
                    'admin_note' => 'Refund processed successfully by Admin'
                ]);
            }

            // Catat Log
            if (class_exists(ActivityLogger::class)) {
                ActivityLogger::log('Refund', 'PROCESSED', "Admin memproses refund untuk kode: {$reservation->booking_code}");
            }

            return response()->json([
                'status' => true,
                'message' => 'Refund berhasil. Dana dikembalikan & kuota kursi dipulihkan.'
            ]);
        });
    }
}