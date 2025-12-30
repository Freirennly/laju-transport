<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reservation;
use App\Models\TransportSchedule;
use App\Models\Notification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth; 
use Carbon\Carbon;

class AdvancedController extends Controller
{
    // ... function getManifest & triggerReminders tetap sama ...

    public function getManifest($scheduleId)
    {
        $schedule = TransportSchedule::withTrashed()->findOrFail($scheduleId);
        
        $passengers = Reservation::with('user')
            ->where('transport_schedule_id', $scheduleId)
            ->whereIn('status', ['PAID', 'CHECKED_IN'])
            ->get();

        return response()->json([
            'schedule_info' => $schedule,
            'total_passengers' => $passengers->sum('passengers_count'),
            'manifest' => $passengers
        ]);
    }

    public function triggerReminders()
    {
        $tomorrow = Carbon::tomorrow()->toDateString();
        $schedules = TransportSchedule::whereDate('departure_time', $tomorrow)->pluck('id');
        $bookings = Reservation::whereIn('transport_schedule_id', $schedules)
            ->where('status', 'PAID')
            ->get();

        $count = 0;
        foreach ($bookings as $booking) {
            Notification::create([
                'user_id' => $booking->user_id,
                'title' => 'Pengingat Perjalanan 🔔',
                'message' => "Halo, perjalanan Anda ke {$booking->schedule->route} dijadwalkan besok. Jangan lupa check-in!",
                'is_read' => false
            ]);
            $count++;
        }

        return response()->json(['message' => "Berhasil mengirim $count notifikasi reminder."]);
    }

    // 3️RATING & REVIEW (Disini Error Tadi)
    public function submitReview(Request $request)
    {
        $request->validate([
            'reservation_id' => 'required',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        DB::table('reviews')->insert([
            'user_id' => Auth::id(), 
            'reservation_id' => $request->reservation_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return response()->json(['message' => 'Terima kasih atas ulasan Anda!']);
    }

    // ... function toggleMaintenance & checkMaintenance tetap sama ...
    
    public function toggleMaintenance()
    {
        $setting = DB::table('settings')->where('key', 'maintenance_mode')->first();
        $newValue = $setting->value === 'true' ? 'false' : 'true';
        
        DB::table('settings')->where('key', 'maintenance_mode')->update(['value' => $newValue]);

        return response()->json(['status' => $newValue, 'message' => 'Mode maintenance diperbarui']);
    }

    public function checkMaintenance()
    {
        $setting = DB::table('settings')->where('key', 'maintenance_mode')->first();
        // Handle jika setting belum ada (first run)
        $isMaintenance = $setting ? $setting->value === 'true' : false;
        return response()->json(['maintenance' => $isMaintenance]);
    }
}