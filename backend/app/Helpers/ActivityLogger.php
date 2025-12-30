<?php
namespace App\Helpers;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ActivityLogger
{
    public static function log($subject, $action, $description)
    {
        try {
            DB::table('activity_logs')->insert([
                'user_id' => Auth::id(), // Bisa null
                'subject' => $subject,
                'action' => $action,
                'description' => $description,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        } catch (\Exception $e) {
            
        }
    }
}