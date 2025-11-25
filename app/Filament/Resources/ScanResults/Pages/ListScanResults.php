<?php

namespace App\Filament\Resources\ScanResults\Pages;

use App\Filament\Resources\ScanResults\ScanResultResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListScanResults extends ListRecords
{
    protected static string $resource = ScanResultResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
