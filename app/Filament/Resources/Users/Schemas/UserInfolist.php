<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class UserInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('User')
                ->columns(2)
                ->schema([
                    ImageEntry::make('avatar')
                        ->label('Avatar')
                        ->disk('public')
                        ->visibility('public')
                        ->circular()
                        ->columnSpanFull(),

                    TextEntry::make('name')->label('Name'),
                    TextEntry::make('email')->label('Email'),
                    TextEntry::make('nickname')->label('Nickname')->placeholder('-'),

                    TextEntry::make('email_verified_at')
                        ->label('Email Verified At')
                        ->dateTime('d M Y H:i')
                        ->placeholder('-'),

                    TextEntry::make('google_id')->label('Google ID')->placeholder('-'),

                    TextEntry::make('created_at')->label('Created')->dateTime('d M Y H:i'),
                    TextEntry::make('updated_at')->label('Updated')->since(),
                ]),
        ]);
    }
}
