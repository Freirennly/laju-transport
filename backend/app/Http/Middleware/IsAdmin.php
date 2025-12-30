<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class IsAdmin
 * * Middleware untuk membatasi akses hanya kepada pengguna dengan peran Administrator.
 */
class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Validasi keberadaan user dan pengecekan role
        if (!$user || $user->role !== 'admin') {
            return response()->json([
                'status'  => false,
                'message' => 'Access denied. Administrator privileges required.'
            ], 403);
        }

        return $next($request);
    }
}