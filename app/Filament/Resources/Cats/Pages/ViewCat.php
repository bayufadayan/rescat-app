<?php

namespace App\Filament\Resources\Cats\Pages;

use App\Filament\Resources\Cats\CatResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewCat extends ViewRecord
{
    protected static string $resource = CatResource::class;

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
