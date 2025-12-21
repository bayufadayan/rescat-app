<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserRole
{
    /**
     * Handle an incoming request.
     *
     * Middleware ini memastikan:
     * - Admin hanya bisa akses route /admin/*
     * - User biasa hanya bisa akses route user (dashboard, settings, scan, dll)
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // Jika tidak ada user (guest), lanjutkan ke middleware auth
        if (!$user) {
            return $next($request);
        }

        // Jika user adalah admin, redirect ke admin dashboard
        if ($user->hasRole('admin')) {
            return redirect()->route('filament.admin.pages.dashboard');
        }

        // Jika user biasa, lanjutkan request
        return $next($request);
    }
}
