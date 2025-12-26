<?php

namespace App\Http\Controllers;

use App\Models\Petcare;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PetcareController extends Controller
{
    public function index()
    {
        $petcares = Petcare::all();

        return Inertia::render('petcares/petcares-list', [
            'petcares' => $petcares,
        ]);
    }

    public function show($id)
    {
        $petcare = Petcare::findOrFail($id);

        return Inertia::render('petcares/petcare-detail', [
            'petcare' => $petcare,
        ]);
    }
}
