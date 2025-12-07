<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;

class ScanResult extends Model
{
    use HasFactory, SoftDeletes, HasUlids;

    protected $table = 'scan_results';

    protected $fillable = [
        'scan_id',
        'remarks',
        'img_landmark_id',
        'img_landmark_url',
    ];

    protected $casts = [
        'remarks'         => 'string',
        'img_landmark_id' => 'string',
        'img_landmark_url'=> 'string',
    ];

    public function session()
    {
        return $this->belongsTo(ScanSession::class, 'scan_id', 'id');
    }

    public function details()
    {
        return $this->hasMany(ScanResultDetail::class, 'scan_result_id');
    }
}
