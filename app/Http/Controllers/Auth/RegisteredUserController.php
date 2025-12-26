<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;
use App\Models\ScanSession;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'avatar_seed' => ['nullable', 'string', 'max:50'], // Guest avatar seed dari localStorage
        ]);

        $user = DB::transaction(function () use ($validated) {
            $roleUser = Role::findOrCreate('user', 'web');

            $user = User::create([
                'name'     => $validated['name'],
                'email'    => strtolower($validated['email']),
                'password' => Hash::make($validated['password']),
                'avatar'   => $validated['avatar_seed'] ?? null, // Simpan seed sebagai avatar
            ]);

            $user->assignRole($roleUser);

            return $user;
        });

        event(new Registered($user));

        Auth::login($user);

        // Transfer guest scan sessions dari localStorage ke user baru
        if ($request->has('session_ids') && is_array($request->input('session_ids'))) {
            $sessionIds = $request->input('session_ids');
            ScanSession::whereIn('id', $sessionIds)
                ->whereNull('user_id')
                ->update(['user_id' => $user->id]);
        }

        // Skip email verification and redirect to intended URL or home
        return redirect()->intended('/');
    }
}
