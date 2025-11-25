<?php

namespace App\Filament\Resources\ScanResultDetails\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class ScanResultDetailForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('scan_result_id')
                    ->required(),
                TextInput::make('criteria')
                    ->required(),
                TextInput::make('score')
                    ->required()
                    ->numeric(),
                TextInput::make('remarks')
                    ->required(),
                Textarea::make('description')
                    ->columnSpanFull(),
                Textarea::make('advice')
                    ->columnSpanFull(),
                TextInput::make('photo_url'),
            ]);
    }
}
