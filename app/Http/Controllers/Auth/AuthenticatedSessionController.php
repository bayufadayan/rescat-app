<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;
use Symfony\Component\HttpFoundation\Response as SymfonyResponse;
use App\Models\ScanSession;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): SymfonyResponse
    {
        $user = $request->validateCredentials();

        if (Features::enabled(Features::twoFactorAuthentication()) && $user->hasEnabledTwoFactorAuthentication()) {
            $request->session()->put([
                'login.id' => $user->getKey(),
                'login.remember' => $request->boolean('remember'),
            ]);

            return to_route('two-factor.login');
        }

        // Simpan avatar seed jika user belum punya avatar
        if (!$user->avatar && $request->has('avatar_seed')) {
            $user->update([
                'avatar' => $request->input('avatar_seed')
            ]);
        }

        Auth::login($user, $request->boolean('remember'));

        $request->session()->regenerate();

        // Transfer guest scan sessions dari localStorage ke user yang login
        if ($request->has('session_ids') && is_array($request->input('session_ids'))) {
            $sessionIds = $request->input('session_ids');
            ScanSession::whereIn('id', $sessionIds)
                ->whereNull('user_id')
                ->update(['user_id' => $user->id]);
        }

        if ($user->hasRole('admin')) {
            return Inertia::location(route('filament.admin.pages.dashboard'));
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
