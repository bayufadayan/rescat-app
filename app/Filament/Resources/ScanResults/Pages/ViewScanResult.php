<?php

namespace App\Filament\Resources\ScanResults\Pages;

use App\Filament\Resources\ScanResults\ScanResultResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewScanResult extends ViewRecord
{
    protected static string $resource = ScanResultResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
