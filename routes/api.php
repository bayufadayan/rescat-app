<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Api\CheckupReportController;
use App\Http\Controllers\Api\PetcareController;
use App\Http\Controllers\ScanController;

Route::post('/storage/upload', function (Request $req) {
    $token = env('UPLOAD_TOKEN', null);
    if ($token && $req->header('X-API-KEY') !== $token) {
        return response()->json(['ok' => false, 'message' => 'Unauthorized'], 401);
    }

    $req->validate([
        'file' => 'required|image|mimes:jpg,jpeg,png|max:2048',
    ]);

    $path = $req->file('file')->storePublicly('public/rescat');
    $url = Storage::url($path);
    return response()->json(['ok' => true, 'url' => $url], 200);
});

Route::post('/checkup-reports', [CheckupReportController::class, 'store'])->name('api.checkup-reports.store');
Route::get('/petcares', [PetcareController::class, 'index'])->name('api.petcares.index');

// Public endpoint for guest to fetch session by ID
Route::get('/scan/session/{id}', [ScanController::class, 'getSessionById'])->name('api.scan.session');

// Scan sessions for authenticated users
Route::middleware('auth')->group(function () {
    Route::post('/scan/transfer-sessions', [ScanController::class, 'transferGuestSessions'])->name('api.scan.transfer');
    Route::get('/scan/sessions', [ScanController::class, 'getUserSessions'])->name('api.scan.sessions');
});
