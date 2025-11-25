<?php

namespace App\Filament\Resources\ScanSessions\Pages;

use App\Filament\Resources\ScanSessions\ScanSessionResource;
use Filament\Resources\Pages\CreateRecord;

class CreateScanSession extends CreateRecord
{
    protected static string $resource = ScanSessionResource::class;

    protected function getRedirectUrl(): string
    {
        return static::$resource::getUrl('index');
    }
}
