<?php

namespace App\Filament\Resources\ScanSessions\Pages;

use App\Filament\Resources\ScanSessions\ScanSessionResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListScanSessions extends ListRecords
{
    protected static string $resource = ScanSessionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
