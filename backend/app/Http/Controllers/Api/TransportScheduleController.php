<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TransportSchedule; // <--- INI WAJIB ADA (SOLUSI ERROR MERAH)

class TransportScheduleController extends Controller
{
    // LIST (User & Admin)
    public function index()
    {
        return response()->json(
            TransportSchedule::where('status', 'active')
                ->orderBy('departure_time', 'asc')
                ->get()
        );
    }

    // DETAIL
    public function show($id)
    {
        $schedule = TransportSchedule::findOrFail($id);
        return response()->json($schedule);
    }

    // CREATE (Admin)
    public function store(Request $request)
    {
        $request->validate([
            'route' => 'required|string',
            'departure_time' => 'required|date',
            'capacity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0'
        ]);

        $schedule = TransportSchedule::create($request->all());

        return response()->json([
            'message' => 'Jadwal berhasil ditambahkan',
            'data' => $schedule
        ], 201);
    }

    // UPDATE (Admin)
    public function update(Request $request, $id)
    {
        $schedule = TransportSchedule::findOrFail($id);

        $request->validate([
            'route' => 'sometimes|string',
            'departure_time' => 'sometimes|date',
            'capacity' => 'sometimes|integer|min:1',
            'price' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:active,inactive'
        ]);

        $schedule->update($request->all());

        return response()->json([
            'message' => 'Jadwal berhasil diperbarui',
            'data' => $schedule
        ]);
    }

    // DELETE (Admin)
    public function destroy($id)
    {
        TransportSchedule::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Jadwal berhasil dihapus'
        ]);
    }
}