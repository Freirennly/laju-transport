<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TransportSchedule;
use App\Models\Reservation;
use App\Models\User;

class PublicStatsController extends Controller
{
    public function index()
    {
        return response()->json([
            'status' => true,
            'data' => [
                'total_rute' => TransportSchedule::where('status', 'active')->count(),
                'penumpang_puas' => Reservation::where('status', 'CHECKED_IN')->count(),
                'mitra_kami' => 1, 
                'total_user' => User::where('role', 'user')->count()
            ]
        ]);
    }
}