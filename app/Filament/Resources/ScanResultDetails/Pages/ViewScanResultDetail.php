<?php

namespace App\Filament\Resources\ScanResultDetails\Pages;

use App\Filament\Resources\ScanResultDetails\ScanResultDetailResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewScanResultDetail extends ViewRecord
{
    protected static string $resource = ScanResultDetailResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
