<?php

namespace App\Filament\Resources\Cats\Pages;

use App\Filament\Resources\Cats\CatResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCat extends EditRecord
{
    protected static string $resource = CatResource::class;

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