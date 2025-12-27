<?php

namespace App\Http\Controllers;

use App\Models\Cat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CatController extends Controller
{
    /**
     * Display a listing of user's cats
     */
    public function index()
    {
        $cats = Cat::where('user_id', Auth::id())
            ->withCount('scanSessions')
            ->latest()
            ->get()
            ->map(function ($cat) {
                return [
                    'id' => $cat->id,
                    'name' => $cat->name,
                    'breed' => $cat->breed,
                    'gender' => $cat->gender,
                    'birth_date' => $cat->birth_date?->format('Y-m-d'),
                    'avatar' => $cat->avatar,
                    'scan_sessions_count' => $cat->scan_sessions_count,
                    'age' => $cat->birth_date ? $cat->birth_date->diffInYears(now()) : null,
                ];
            });

        return Inertia::render('cats/my-cats', [
            'cats' => $cats,
        ]);
    }

    /**
     * Show the form for creating a new cat
     */
    public function create()
    {
        return Inertia::render('cats/create');
    }

    /**
     * Display the specified cat with scan history
     */
    public function show(Cat $cat)
    {
        // Ensure user owns this cat
        if ($cat->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $catData = [
            'id' => $cat->id,
            'name' => $cat->name,
            'breed' => $cat->breed,
            'gender' => $cat->gender,
            'birth_date' => $cat->birth_date?->format('Y-m-d'),
            'avatar' => $cat->avatar,
            'age' => $cat->birth_date ? $cat->birth_date->diffInYears(now()) : null,
        ];

        // Get scan sessions with results
        $scanSessions = $cat->scanSessions()
            ->with(['images', 'result.details'])
            ->latest()
            ->get()
            ->map(function ($session) {
                $firstImage = $session->images->first();
                $imageUrl = $firstImage ? ($firstImage->img_remove_bg_url ?? $firstImage->img_roi_url ?? $firstImage->img_original_url) : null;
                
                $allDetails = [];
                if ($session->result) {
                    $result = $session->result;
                    if ($result->details->count() > 0) {
                        foreach ($result->details as $detail) {
                            $allDetails[] = [
                                'area_name' => $detail->area_name,
                                'label' => $detail->label,
                                'confidence_score' => $detail->confidence_score,
                            ];
                        }
                    }
                }
                
                return [
                    'id' => $session->id,
                    'checkup_type' => $session->checkup_type,
                    'created_at' => $session->created_at->toISOString(),
                    'scan_images_count' => $session->images->count(),
                    'results_count' => count($allDetails),
                    'image_url' => $imageUrl,
                    'remarks' => $session->result?->remarks,
                    'results' => $allDetails,
                ];
            });

        return Inertia::render('cats/cat-detail', [
            'cat' => $catData,
            'scanSessions' => $scanSessions,
        ]);
    }

    /**
     * Show the form for editing the specified cat
     */
    public function edit(Cat $cat)
    {
        // Ensure user owns this cat
        if ($cat->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('cats/edit', [
            'cat' => [
                'id' => $cat->id,
                'name' => $cat->name,
                'breed' => $cat->breed,
                'gender' => $cat->gender,
                'birth_date' => $cat->birth_date?->format('Y-m-d'),
                'avatar' => $cat->avatar,
            ],
        ]);
    }

    /**
     * Store a newly created cat
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'breed' => 'nullable|string|max:255',
            'gender' => 'nullable|in:male,female',
            'birth_date' => 'nullable|date|before:today',
            'avatar' => 'nullable|image|max:2048', // 2MB max
        ]);

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('cats/avatars', 'public');
            $validated['avatar'] = '/storage/' . $path;
        }

        $cat = Cat::create([
            ...$validated,
            'user_id' => Auth::id(),
        ]);

        return redirect()->route('cats.show', $cat->id)
            ->with('success', 'Cat added successfully!');
    }

    /**
     * Update the specified cat
     */
    public function update(Request $request, Cat $cat)
    {
        // Ensure user owns this cat
        if ($cat->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'breed' => 'nullable|string|max:255',
            'gender' => 'nullable|in:male,female',
            'birth_date' => 'nullable|date|before:today',
            'avatar' => 'nullable|image|max:2048', // 2MB max
        ]);

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar if exists
            if ($cat->avatar && file_exists(public_path($cat->avatar))) {
                unlink(public_path($cat->avatar));
            }
            
            $path = $request->file('avatar')->store('cats/avatars', 'public');
            $validated['avatar'] = '/storage/' . $path;
        }

        $cat->update($validated);

        return redirect()->route('cats.show', $cat->id)
            ->with('success', 'Cat updated successfully!');
    }

    /**
     * Remove the specified cat
     */
    public function destroy(Cat $cat)
    {
        // Ensure user owns this cat
        if ($cat->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $cat->delete();

        return redirect()->route('cats.index')
            ->with('success', 'Cat removed successfully!');
    }

    /**
     * Get cats for dropdown (JSON API)
     */
    public function getCatsForDropdown()
    {
        $cats = Cat::where('user_id', Auth::id())
            ->select('id', 'name')
            ->latest()
            ->get();

        return response()->json([
            'ok' => true,
            'data' => $cats,
        ]);
    }
}
