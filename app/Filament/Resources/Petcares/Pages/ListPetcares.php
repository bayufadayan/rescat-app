<?php

namespace App\Filament\Resources\Petcares\Pages;

use App\Filament\Resources\Petcares\PetcareResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPetcares extends ListRecords
{
    protected static string $resource = PetcareResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
