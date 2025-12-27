<?php

use App\Http\Controllers\AppStartController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ScanController;
use App\Http\Controllers\ScanReportController;
use App\Http\Controllers\PetcareController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\Auth\GoogleAuthController;
use App\Http\Controllers\CatController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [AppStartController::class, 'root'])->name('home');
Route::post('/set-splash', [AppStartController::class, 'setSplashSeen']);
Route::get('/onboarding', [AppStartController::class, 'onboarding'])->middleware('guest')->name('onboarding');
Route::get('/history', [AppStartController::class, 'history'])->name('history');
Route::get('/thankyou', function () {
    return Inertia::render('thankyou/thankyou');
})->name('thankyou');
Route::prefix('scan')->group(function () {
    Route::get('/', [ScanController::class, 'index'])->name('scan');
    Route::get('/options', [ScanController::class, 'options'])->name('scan.options');
    Route::get('/capture', [ScanController::class, 'capture'])->name('scan.capture');
    Route::get('/crop', [ScanController::class, 'crop'])->name('scan.crop');
    Route::post('/analyze', [ScanController::class, 'analyze'])->name('scan.analyze');
    Route::get('/details', [ScanController::class, 'details'])->name('scan.details');
    Route::post('/sessions', [ScanController::class, 'storeSession'])->name('scan.sessions.store');
    Route::get('/process', [ScanController::class, 'processIndex'])->name('scan.process.index');
    Route::get('/process/{scan_session}', [ScanController::class, 'process'])->name('scan.process');
    Route::post('/process/{scan_session}/remove-bg', [ScanController::class, 'processRemoveBg'])->name('scan.process.removebg');
    Route::get('/process/{scan_session}/status', [ScanController::class, 'processStatus'])->name('scan.process.status');
    Route::get('/results', [ScanController::class, 'results'])->name('scan.results');
    Route::get('/result/{scan_session}', [ScanController::class, 'resultShow'])->name('scan.result');
    Route::get('/removebg', [ScanController::class, 'removebg'])->name('scan.removebg');
    Route::get('/removebg-server', [ScanController::class, 'removebgServerPage'])->name('scan.removebg.server');
    Route::post('/removebg-server/process', [ScanController::class, 'removeBgServerProcess'])->name('scan.removebg.server.process');
});

// Scan Report Download
Route::get('/scan-reports/{sessionId}/download', [ScanReportController::class, 'download'])
    ->name('scan.reports.download');

// Petcares
Route::prefix('petcares')->group(function () {
    Route::get('/', [PetcareController::class, 'index'])->name('petcares');
    Route::get('/{id}', [PetcareController::class, 'show'])->name('petcares.show');
});

// Articles
Route::prefix('articles')->group(function () {
    Route::get('/', [ArticleController::class, 'index'])->name('articles');
    Route::get('/{slug}', [ArticleController::class, 'show'])->name('articles.show');
});

Route::middleware('guest')->group(function () {
    Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])
        ->name('google.redirect');
});

Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])
    ->name('google.callback');

Route::middleware(['auth', 'verified', 'user'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Cat Management Routes
    Route::prefix('cats')->group(function () {
        Route::get('/', [CatController::class, 'index'])->name('cats.index');
        Route::get('/create', [CatController::class, 'create'])->name('cats.create');
        Route::post('/', [CatController::class, 'store'])->name('cats.store');
        Route::get('/{cat}', [CatController::class, 'show'])->name('cats.show');
        Route::get('/{cat}/edit', [CatController::class, 'edit'])->name('cats.edit');
        Route::put('/{cat}', [CatController::class, 'update'])->name('cats.update');
        Route::delete('/{cat}', [CatController::class, 'destroy'])->name('cats.destroy');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
