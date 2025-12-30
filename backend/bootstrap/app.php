<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php', 
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        
        // 1. Daftarkan Middleware Alias
        $middleware->alias([
            'is_admin' => \App\Http\Middleware\IsAdmin::class,
        ]);

        // 2. Fix Redirect Guests (Agar tidak ke 'login' page yang tidak ada)
        $middleware->redirectGuestsTo(fn (Request $request) => 
            $request->expectsJson() ? null : route('login_fallback')
        );

    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();