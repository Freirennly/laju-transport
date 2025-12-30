<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth; 
class NotificationController extends Controller
{
    // Ambil notifikasi milik user yang login
    public function index()
    {
        // Ganti auth()->id() menjadi Auth::id() agar error hilang
        $notifications = Notification::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->take(10) 
            ->get();

        return response()->json($notifications);
    }

    // Tandai sudah dibaca
    public function markRead($id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', Auth::id()) // ✅ Gunakan Auth::id()
            ->firstOrFail();

        $notification->update(['is_read' => true]);

        return response()->json(['message' => 'Notification read']);
    }
}