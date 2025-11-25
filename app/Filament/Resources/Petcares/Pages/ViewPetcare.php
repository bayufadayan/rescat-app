<?php

namespace App\Filament\Resources\Petcares\Pages;

use App\Filament\Resources\Petcares\PetcareResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewPetcare extends ViewRecord
{
    protected static string $resource = PetcareResource::class;

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
