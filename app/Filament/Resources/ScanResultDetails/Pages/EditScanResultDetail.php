<?php

namespace App\Filament\Resources\ScanResultDetails\Pages;

use App\Filament\Resources\ScanResultDetails\ScanResultDetailResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\RestoreAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditScanResultDetail extends EditRecord
{
    protected static string $resource = ScanResultDetailResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
            ForceDeleteAction::make(),
            RestoreAction::make(),
        ];
    }
}
