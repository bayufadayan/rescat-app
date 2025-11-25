<?php

namespace App\Filament\Resources\Petcares\Pages;

use App\Filament\Resources\Petcares\PetcareResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPetcare extends EditRecord
{
    protected static string $resource = PetcareResource::class;

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
