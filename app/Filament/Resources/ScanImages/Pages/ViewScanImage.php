<?php

namespace App\Filament\Resources\ScanImages\Pages;

use App\Filament\Resources\ScanImages\ScanImageResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewScanImage extends ViewRecord
{
    protected static string $resource = ScanImageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
