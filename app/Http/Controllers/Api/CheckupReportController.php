<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CheckupReport;
use App\Models\ScanSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckupReportController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'scan_session_id' => 'required|exists:scan_sessions,id',
            'category' => 'required|string|in:kualitas_foto,hasil_tidak_akurat,identitas_salah,lainnya',
            'reasons' => 'nullable|array',
            'description' => 'nullable|string|max:1000',
            'contact' => 'nullable|string|max:255',
        ]);

        // Guest user bisa lapor, user_id optional
        $userId = Auth::check() ? Auth::id() : null;
        
        $report = CheckupReport::create([
            'scan_session_id' => $validated['scan_session_id'],
            'user_id' => $userId,
            'category' => $validated['category'],
            'reasons' => $validated['reasons'] ?? null,
            'description' => $validated['description'] ?? null,
            'contact' => $validated['contact'] ?? null,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Laporan berhasil dikirim',
            'data' => $report,
        ], 201);
    }
}
