<?php

namespace App\Filament\Resources\ScanResults\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ScanResultForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('scan_id')
                    ->required(),
                TextInput::make('total_score')
                    ->required()
                    ->numeric(),
                TextInput::make('label')
                    ->required(),
            ]);
    }
}
