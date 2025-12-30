<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Reservation;

class ReportController extends Controller
{
    public function exportBookings()
    {
        $data = Reservation::with(['user', 'schedule'])->orderBy('created_at', 'desc')->get();
        
        $csvHeader = ["Tanggal", "Kode Booking", "Nama Penumpang", "Rute", "Status", "Harga"];
        $csvData = [];

        foreach ($data as $row) {
            $csvData[] = [
                $row->created_at->format('Y-m-d H:i'),
                $row->booking_code,
                $row->user->name ?? 'Guest',
                $row->schedule->route ?? '-',
                $row->status,
                $row->total_price
            ];
        }

        $callback = function() use ($csvHeader, $csvData) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $csvHeader);
            foreach ($csvData as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, [
            "Content-Type" => "text/csv",
            "Content-Disposition" => "attachment; filename=laporan_reservasi_" . date('Y-m-d') . ".csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ]);
    }
}