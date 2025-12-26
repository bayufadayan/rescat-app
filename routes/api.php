<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Api\CheckupReportController;

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
