<?php

namespace App\Filament\Resources\Petcares\Pages;

use App\Filament\Resources\Petcares\PetcareResource;
use Filament\Resources\Pages\CreateRecord;

class CreatePetcare extends CreateRecord
{
    protected static string $resource = PetcareResource::class;

    protected function getRedirectUrl(): string
    {
        return static::$resource::getUrl('index');
    }
}
