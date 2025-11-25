<?php

namespace App\Filament\Resources\ScanSessions\Schemas;

use App\Enums\CheckupType;
use App\Enums\ScanStatus;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ScanSessionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Scan Session')
                ->columnSpanFull()
                ->columns([
                    'default' => 1,
                    'lg' => 2,
                ])
                ->schema([
                    Select::make('user_id')
                        ->label('User')
                        ->relationship('user', 'name')
                        ->searchable()
                        ->preload()
                        ->required(),

                    Select::make('cat_id')
                        ->label('Cat')
                        ->relationship('cat', 'name')
                        ->searchable()
                        ->preload()
                        ->required(),

                    TextInput::make('scan_type')
                        ->label('Scan Type')
                        ->maxLength(50)
                        ->helperText('Isi sesuai kebutuhan (misal: camera / gallery / etc).'),

                    Select::make('checkup_type')
                        ->label('Checkup Type')
                        ->options(self::enumOptions(CheckupType::class))
                        ->required(),

                    Select::make('status')
                        ->label('Status')
                        ->options(self::enumOptions(ScanStatus::class))
                        ->required(),

                    TextInput::make('location')
                        ->label('Location (Text)')
                        ->maxLength(255)
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

                    TextInput::make('informer')
                        ->label('Informer')
                        ->maxLength(255)
                        ->columnSpanFull(),

                    Textarea::make('notes')
                        ->label('Notes')
                        ->rows(4)
                        ->columnSpanFull(),
                ]),
        ]);
    }

    /**
     * Buat options enum yang aman (value => label).
     * Works walau enum kamu belum implement HasLabel.
     */
    private static function enumOptions(string $enumClass): array
    {
        $options = [];

        foreach ($enumClass::cases() as $case) {
            $value = property_exists($case, 'value') ? $case->value : $case->name;
            $label = str_replace('_', ' ', $case->name);
            $label = ucwords(strtolower($label));

            $options[$value] = $label;
        }

        return $options;
    }
}
