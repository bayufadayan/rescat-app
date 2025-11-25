<?php

namespace App\Filament\Resources\ScanImages\Pages;

use App\Filament\Resources\ScanImages\ScanImageResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListScanImages extends ListRecords
{
    protected static string $resource = ScanImageResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
