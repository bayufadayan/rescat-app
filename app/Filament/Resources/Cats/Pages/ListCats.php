<?php

namespace App\Filament\Resources\Cats\Pages;

use App\Filament\Resources\Cats\CatResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListCats extends ListRecords
{
    protected static string $resource = CatResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
