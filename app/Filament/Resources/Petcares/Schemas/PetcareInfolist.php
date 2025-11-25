<?php

namespace App\Filament\Resources\Petcares\Schemas;

use Filament\Infolists\Components\KeyValueEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class PetcareInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Info')
                ->columns(2)
                ->schema([
                    TextEntry::make('name')->label('Name'),
                    TextEntry::make('phone')->label('Phone')->placeholder('-'),
                    TextEntry::make('address')->label('Address')->columnSpanFull()->placeholder('-'),

                    TextEntry::make('latitude')->label('Latitude')->placeholder('-'),
                    TextEntry::make('longitude')->label('Longitude')->placeholder('-'),

                    TextEntry::make('created_at')->label('Created')->dateTime('d M Y H:i'),
                    TextEntry::make('updated_at')->label('Updated')->since(),
                ]),

            Section::make('Opening Hours')
                ->schema([
                    KeyValueEntry::make('opening_hours')
                        ->label('')
                        ->columnSpanFull(),
                ]),
        ]);
    }
}
