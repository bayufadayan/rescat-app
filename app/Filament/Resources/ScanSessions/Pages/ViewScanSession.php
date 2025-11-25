<?php

namespace App\Filament\Resources\ScanSessions\Pages;

use App\Filament\Resources\ScanSessions\ScanSessionResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewScanSession extends ViewRecord
{
    protected static string $resource = ScanSessionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
            Actions\DeleteAction::make(),
            Actions\RestoreAction::make(),
            Actions\ForceDeleteAction::make(),
        ];
    }
}
