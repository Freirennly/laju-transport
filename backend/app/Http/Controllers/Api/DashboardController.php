<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Mengambil statistik dashboard admin
     */
    public function index()
    {
        // 1. Statistik Utama
        $pendapatan = Reservation::where('payment_status', 'paid')->sum('total_price');
        $totalReservasi = Reservation::count();
        $totalUser = User::where('role', 'user')->count();

        // 2. Data Grafik (6 Bulan Terakhir)
        $chartData = Reservation::select(
            DB::raw("DATE_FORMAT(created_at, '%Y-%m') as month_year"),
            DB::raw('SUM(total_price) as total')
        )
        ->where('payment_status', 'paid')
        ->where('created_at', '>=', Carbon::now()->subMonths(6))
        ->groupBy('month_year')
        ->orderBy('month_year', 'ASC')
        ->get()
        ->map(function ($item) {
            return [
                'name' => Carbon::createFromFormat('Y-m', $item->month_year)->format('M Y'),
                'total' => (int) $item->total
            ];
        });

        // 3. Transaksi Terakhir
        $recentBookings = Reservation::with('user')
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'pendapatan' => $pendapatan,
            'total_reservasi' => $totalReservasi,
            'user_count' => $totalUser,
            'chart_data' => $chartData,
            'recent_bookings' => $recentBookings
        ]);
    }
}