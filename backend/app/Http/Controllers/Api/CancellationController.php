<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reservation;
use App\Models\CancellationRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class CancellationController extends Controller
{
    // User mengajukan pembatalan
public function requestCancellation(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|min:5', 
        ]);

        $reservation = Reservation::where('user_id', Auth::id())->findOrFail($id);

        // Hanya boleh cancel jika status BOOKED atau PAID
        if (!in_array($reservation->status, ['BOOKED', 'PAID'])) {
            return response()->json([
                'message' => 'Tiket tidak dapat dibatalkan karena status saat ini adalah: ' . $reservation->status
            ], 400); 
        }

        // Cek apakah sudah pernah mengajukan cancel sebelumnya?
        $existingRequest = CancellationRequest::where('reservation_id', $id)->where('status', 'pending')->first();
        if ($existingRequest) {
                return response()->json(['message' => 'Anda sudah mengajukan pembatalan untuk tiket ini.'], 400);
        }

        // Proses Simpan
        CancellationRequest::create([
            'reservation_id' => $reservation->id,
            'reason' => $request->reason,
            'status' => 'pending'
        ]);

        $reservation->update(['status' => 'CANCEL_REQUESTED']);

        return response()->json(['message' => 'Permintaan pembatalan berhasil dikirim.']);
    }

    // Admin melihat list pembatalan
    public function index()
    {
        $requests = CancellationRequest::with(['reservation.user'])
            ->where('status', 'pending')
            ->get();
            
        return response()->json($requests);
    }

    // ADMIN: PROSES (APPROVE / REJECT)
    public function process(Request $request, $id)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
            'admin_note' => 'nullable|string' 
        ]);

        return DB::transaction(function () use ($request, $id) {
            $cancel = CancellationRequest::lockForUpdate()->findOrFail($id);
            $reservation = $cancel->reservation;
            $schedule = $reservation->schedule;

            // FIX: Cek status case-insensitive
            if (strtoupper($cancel->status) !== 'PENDING') {
                return response()->json(['message' => 'Request sudah diproses sebelumnya.'], 400);
            }

            if ($request->action === 'approve') {
                // Return Stock
                if($schedule) {
                    $schedule->increment('capacity', $reservation->passengers_count);
                }
                
                $reservation->update(['status' => 'CANCELLED', 'payment_status' => 'refunded']);
                $cancel->update(['status' => 'APPROVED']);
            } else {
                // Reject
                $reservation->update(['status' => 'PAID']); // Kembalikan ke PAID (bukan BOOKED jika sudah bayar)
                $cancel->update(['status' => 'REJECTED']);
            }

            $cancel->update(['admin_note' => $request->input('note') ?? $request->input('admin_note')]);

            return response()->json(['message' => 'Berhasil diproses']);
        });
    }
}