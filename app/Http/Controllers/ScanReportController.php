<?php

namespace App\Http\Controllers;

use App\Models\ScanSession;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class ScanReportController extends Controller
{
    public function download(Request $request, $sessionId)
    {
        // Load session dengan relasi
        $session = ScanSession::with(['result.details', 'cat', 'user'])
            ->findOrFail($sessionId);

        // Hitung statistik
        $result = $session->result;
        $details = $result ? $result->details : collect([]);
        
        $normalCount = $details->filter(function ($detail) {
            return strtolower($detail->label ?? '') === 'normal';
        })->count();
        
        $abnormalCount = $details->filter(function ($detail) {
            return strtolower($detail->label ?? '') === 'abnormal';
        })->count();
        
        $totalCount = $details->count();
        $normalPercent = $totalCount > 0 ? ($normalCount / $totalCount) * 100 : 0;

        // Generate PDF
        $pdf = Pdf::loadView('pdf.scan-report', [
            'session' => $session,
            'result' => $result,
            'normalCount' => $normalCount,
            'abnormalCount' => $abnormalCount,
            'normalPercent' => $normalPercent,
        ]);

        // Set paper size dan orientation
        $pdf->setPaper('a4', 'portrait');

        // Generate filename
        $filename = 'Rescat_Laporan_' . $sessionId . '_' . date('Ymd_His') . '.pdf';

        // Download PDF
        return $pdf->download($filename);
    }
}
