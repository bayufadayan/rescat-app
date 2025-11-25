<?php

namespace App\Filament\Resources\Cats\Schemas;

use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class CatInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Cat')
                ->columns(2)
                ->schema([
                    ImageEntry::make('avatar')
                        ->label('Avatar')
                        ->visibility('public')
                        ->circular()
                        ->columnSpanFull(),

                    TextEntry::make('name')->label('Name'),
                    TextEntry::make('breed')->label('Breed')->placeholder('-'),
                    TextEntry::make('gender')->label('Gender'),
                    TextEntry::make('birth_date')->label('Birth Date')->date('d M Y'),
                    TextEntry::make('user.name')->label('Owner'),
                ]),
        ]);
    }
}
