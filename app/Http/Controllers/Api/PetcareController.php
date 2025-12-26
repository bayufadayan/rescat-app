<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Petcare;
use Illuminate\Http\Request;

class PetcareController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
        ]);

        $petcares = Petcare::all();

        // Jika ada koordinat user, sort berdasarkan jarak
        if (isset($validated['latitude']) && isset($validated['longitude'])) {
            $userLat = $validated['latitude'];
            $userLng = $validated['longitude'];

            $petcares = $petcares->map(function ($petcare) use ($userLat, $userLng) {
                // Hitung jarak menggunakan Haversine formula
                $distance = $this->calculateDistance(
                    $userLat,
                    $userLng,
                    $petcare->latitude,
                    $petcare->longitude
                );
                
                $petcare->distance = $distance;
                return $petcare;
            })->sortBy('distance')->values();
        }

        return response()->json([
            'success' => true,
            'data' => $petcares,
        ]);
    }

    /**
     * Calculate distance between two coordinates using Haversine formula
     * Returns distance in kilometers
     */
    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        if (!$lat2 || !$lon2) {
            return PHP_INT_MAX; // Petcare tanpa koordinat diletakkan di akhir
        }

        $earthRadius = 6371; // Radius bumi dalam kilometer

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }
}
