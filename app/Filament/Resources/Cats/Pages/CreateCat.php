<?php

namespace App\Filament\Resources\Cats\Pages;

use App\Filament\Resources\Cats\CatResource;
use Filament\Resources\Pages\CreateRecord;

class CreateCat extends CreateRecord
{
    protected static string $resource = CatResource::class;

    protected function getRedirectUrl(): string
    {
        return static::$resource::getUrl('index');
    }
}
