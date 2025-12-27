<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Cat;
use App\Models\Petcare;
use App\Models\ScanSession;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get user's cats
        $catsCount = Cat::where('user_id', $user->id)->count();
        
        // Get user's scan sessions
        $scansCount = ScanSession::where('user_id', $user->id)->count();
        
        // Get recent scans (last 5)
        $recentScans = ScanSession::where('user_id', $user->id)
            ->with(['result.details', 'cat'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($session) {
                $resultsCount = 0;
                $hasAbnormal = false;
                
                if ($session->result && $session->result->details) {
                    $resultsCount = $session->result->details->count();
                    $hasAbnormal = $session->result->details->filter(function ($detail) {
                        $label = strtolower($detail->label ?? '');
                        return !in_array($label, ['healthy', 'sehat', 'normal']);
                    })->isNotEmpty();
                }
                
                return [
                    'id' => $session->id,
                    'cat_name' => $session->cat?->name ?? 'Unknown Cat',
                    'created_at' => $session->created_at->format('d M Y, H:i'),
                    'results_count' => $resultsCount,
                    'has_abnormal' => $hasAbnormal,
                ];
            });

        // Get recent articles (last 6)
        $recentArticles = Article::orderBy('created_at', 'desc')
            ->limit(6)
            ->get()
            ->map(function ($article) {
                return [
                    'id' => $article->id,
                    'slug' => $article->slug,
                    'title' => $article->title,
                    'image' => $article->image,
                    'created_at' => $article->created_at->format('d M Y'),
                ];
            });

        // Get health score (percentage of healthy scans)
        $healthScore = 100;
        if ($scansCount > 0) {
            $healthyScans = ScanSession::where('user_id', $user->id)
                ->whereHas('result.details', function ($query) {
                    $query->whereIn('label', ['healthy', 'sehat', 'normal']);
                })
                ->count();
            $healthScore = round(($healthyScans / $scansCount) * 100);
        }

        return Inertia::render('dashboard', [
            'stats' => [
                'cats_count' => $catsCount,
                'scans_count' => $scansCount,
                'health_score' => $healthScore,
            ],
            'recent_scans' => $recentScans,
            'recent_articles' => $recentArticles,
        ]);
    }
}
