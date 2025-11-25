<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('User')
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

                    TextInput::make('email')
                        ->label('Email')
                        ->email()
                        ->required()
                        ->maxLength(255)
                        ->unique(ignoreRecord: true),

                    TextInput::make('nickname')
                        ->label('Nickname')
                        ->maxLength(255),

                    FileUpload::make('avatar')
                        ->label('Avatar')
                        ->image()
                        ->disk('public')
                        ->directory('users/avatars')
                        ->visibility('public')
                        ->imageEditor()
                        ->columnSpanFull(),

                    // read-only fields (kalau ada)
                    TextInput::make('google_id')
                        ->label('Google ID')
                        ->disabled()
                        ->dehydrated(false)
                        ->columnSpanFull(),

                    TextInput::make('email_verified_at')
                        ->label('Email Verified At')
                        ->disabled()
                        ->dehydrated(false),
                ]),
        ]);
    }
}
