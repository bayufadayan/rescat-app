<?php

namespace App\Filament\Resources\Petcares\Schemas;

use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PetcareForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Petcare')
                ->columnSpanFull()
                ->columns([
                    'default' => 1,
                    'lg' => 2,
                ])
                ->schema([
                    TextInput::make('name')
                        ->label('Name')
                        ->required()
                        ->maxLength(255),

                    TextInput::make('phone')
                        ->label('Phone')
                        ->tel()
                        ->maxLength(50),

                    Textarea::make('address')
                        ->label('Address')
                        ->rows(3)
                        ->columnSpanFull(),

                    TextInput::make('latitude')
                        ->label('Latitude')
                        ->numeric()
                        ->step('0.000001')
                        ->placeholder('-6.200000'),

                    TextInput::make('longitude')
                        ->label('Longitude')
                        ->numeric()
                        ->step('0.000001')
                        ->placeholder('106.816666'),

                    KeyValue::make('opening_hours')
                        ->label('Opening Hours')
                        ->keyLabel('Day')
                        ->valueLabel('Hours')
                        ->addActionLabel('Add day')
                        ->columnSpanFull()
                        ->helperText('Contoh: Monday => 09:00-17:00'),
                ]),
        ]);
    }
}
