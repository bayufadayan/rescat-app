<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use Spatie\Permission\Models\Role;

class GoogleAuthController extends Controller
{
    public function redirect(): RedirectResponse
    {
        /** @var \Laravel\Socialite\Two\GoogleProvider $google */
        $google = Socialite::driver('google');
        $google->scopes(['email', 'profile']);

        return $google->redirect();
    }

    public function callback(): RedirectResponse
    {
        $googleUser = Socialite::driver('google')->user();
        $email = strtolower($googleUser->getEmail());

        $user = DB::transaction(function () use ($googleUser, $email) {
            // 1) Sudah linked?
            $linked = User::where('google_id', $googleUser->getId())->first();
            if ($linked) {
                $linked->update([
                    'google_token'         => $googleUser->token ?? null,
                    'google_refresh_token' => $googleUser->refreshToken ?? null,
                    'avatar'               => $linked->avatar ?: $googleUser->avatar,
                ]);

                if (is_null($linked->email_verified_at)) {
                    $linked->markEmailAsVerified();
                }

                return $linked;
            }

            // 2) Ada akun dengan email yang sama? → link-kan
            $existing = User::where('email', $email)->first();
            if ($existing) {
                $existing->update([
                    'google_id'            => $googleUser->getId(),
                    'google_token'         => $googleUser->token ?? null,
                    'google_refresh_token' => $googleUser->refreshToken ?? null,
                    'avatar'               => $existing->avatar ?: $googleUser->avatar,
                ]);

                if (is_null($existing->email_verified_at)) {
                    $existing->markEmailAsVerified();
                }

                return $existing;
            }

            // 3) Buat user baru
            $user = User::create([
                'name'                 => $googleUser->getName() ?: Str::before($email, '@'),
                'email'                => $email,
                'password'             => Hash::make(Str::random(32)),
                'google_id'            => $googleUser->getId(),
                'google_token'         => $googleUser->token ?? null,
                'google_refresh_token' => $googleUser->refreshToken ?? null,
                'avatar'               => $googleUser->avatar,
            ]);

            Role::findOrCreate('user', 'web');
            $user->assignRole('user');

            $user->markEmailAsVerified();

            return $user;
        });

        Auth::login($user, remember: true);
        request()->session()->regenerate();

        // Admin harus full page load ke Filament, bukan Inertia redirect
        if ($user->hasRole('admin')) {
            return redirect()->away(route('filament.admin.pages.dashboard'));
        }

        // User biasa pakai Inertia redirect
        return redirect()->intended(route('dashboard', absolute: false));
    }
}
