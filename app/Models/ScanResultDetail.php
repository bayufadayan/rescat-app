<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;

class ScanResultDetail extends Model
{
    use HasFactory, SoftDeletes, HasUlids;

    protected $table = 'scan_result_details';

    protected $fillable = [
        'scan_result_id',
        'area_name',
        'confidence_score',
        'label',
        'description',
        'advice',
        'img_roi_area_id',
        'img_roi_area_url',
        'img_gradcam_id',
        'img_gradcam_url',
    ];

    protected $casts = [
        'confidence_score' => 'float',
        'area_name'        => 'string',
        'label'            => 'string',
    ];

    public function result()
    {
        return $this->belongsTo(ScanResult::class, 'scan_result_id');
    }
}
