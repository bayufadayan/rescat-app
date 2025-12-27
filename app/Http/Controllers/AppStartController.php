<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class AppStartController extends Controller
{
    public function root()
    {
        if (Session::get('splash_seen')) {
            return Inertia::render('main');
        }
        return Inertia::render('splash');
    }

    public function setSplashSeen()
    {
        Session::put('splash_seen', true);
        return redirect('/');
        // return response()->json(['status' => 'ok']);
    }

    public function onboarding()
    {
        return Inertia('onboarding/onboarding-page');
    }

    public function history()
    {
        return Inertia('history/history');
    }
}
