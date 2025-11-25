<?php

namespace App\Filament\Resources\ScanSessions\Pages;

use App\Filament\Resources\ScanSessions\ScanSessionResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditScanSession extends EditRecord
{
    protected static string $resource = ScanSessionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
            Actions\RestoreAction::make(),
            Actions\ForceDeleteAction::make(),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return static::$resource::getUrl('view', ['record' => $this->record]);
    }
}
