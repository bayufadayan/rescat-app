<?php

namespace App\Filament\Resources\ScanResultDetails\Pages;

use App\Filament\Resources\ScanResultDetails\ScanResultDetailResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListScanResultDetails extends ListRecords
{
    protected static string $resource = ScanResultDetailResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
