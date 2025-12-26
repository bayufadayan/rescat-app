<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CheckupReport extends Model
{
    use HasFactory, HasUlids;

    protected $table = 'checkup_reports';
    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'scan_session_id',
        'user_id',
        'category',
        'reasons',
        'description',
        'contact',
        'status',
        'admin_notes',
    ];

    protected $casts = [
        'reasons' => 'array',
    ];

    // ================= RELATIONS =================
    public function scanSession()
    {
        return $this->belongsTo(ScanSession::class, 'scan_session_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
