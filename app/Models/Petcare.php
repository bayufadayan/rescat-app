<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Petcare extends Model
{
    use SoftDeletes;

    protected $table = 'petcares';

    protected $fillable = [
        'name',
        'address',
        'phone',
        'latitude',
        'longitude',
        'opening_hours',
        'vet_name',
        'vet_phone',
        'vet_specialization',
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'opening_hours' => 'array',
    ];
}
