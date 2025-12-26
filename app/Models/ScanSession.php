<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use App\Enums\ScanStatus;
use App\Enums\CheckupType;
use Illuminate\Database\Eloquent\Builder;

class ScanSession extends Model
{
    use HasFactory, SoftDeletes, HasUlids;

    protected $table = 'scan_sessions';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'cat_id',
        'scan_type',      
        'checkup_type',   
        'status',         
        'latitude',       
        'longitude',      
        'location',       
        'informer',       
        'notes',          
    ];

    protected $casts = [
        'checkup_type' => CheckupType::class,
        'status'       => ScanStatus::class,
        'latitude'     => 'float',
        'longitude'    => 'float',
    ];

    /** Route binding pakai kolom "id" */
    public function getRouteKeyName(): string
    {
        return 'id';
    }

    // ================= RELATIONS =================
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cat()
    {
        return $this->belongsTo(Cat::class);
    }

    public function images()
    {
        return $this->hasMany(ScanImage::class, 'scan_id', 'id');
    }

    public function result()
    {
        return $this->hasOne(ScanResult::class, 'scan_id', 'id');
    }

    public function checkupReports()
    {
        return $this->hasMany(CheckupReport::class, 'scan_session_id', 'id');
    }

    // ================= SOFT DELETE CASCADE =================
    protected static function booted()
    {
        static::deleting(function (self $session) {
            $session->images()->get()->each->delete();

            if ($session->result) {
                $session->result->details()->get()->each->delete();
                $session->result->delete();
            }

            if (method_exists($session, 'isForceDeleting') && $session->isForceDeleting()) {
                $session->images()->withTrashed()->get()->each->forceDelete();
                if ($session->result) {
                    $session->result->details()->withTrashed()->get()->each->forceDelete();
                    $session->result->forceDelete();
                }
            }
        });
    }

    // ================= SCOPES =================
    public function scopeProcessing($query)
    {
        return $query->where('status', ScanStatus::Processing);
    }

    public function scopeDone($query)
    {
        return $query->where('status', ScanStatus::Done);
    }
}
