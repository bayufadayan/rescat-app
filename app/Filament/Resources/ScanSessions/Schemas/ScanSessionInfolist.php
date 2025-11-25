<?php

namespace App\Filament\Resources\ScanSessions\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ScanSessionInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Session')
                ->columns(2)
                ->schema([
                    TextEntry::make('id')->label('ID'),
                    TextEntry::make('status')->label('Status')->badge(),
                    TextEntry::make('checkup_type')->label('Checkup Type')->badge(),
                    TextEntry::make('scan_type')->label('Scan Type')->placeholder('-'),

                    TextEntry::make('user.name')->label('User'),
                    TextEntry::make('cat.name')->label('Cat'),

                    TextEntry::make('location')->label('Location')->columnSpanFull()->placeholder('-'),
                    TextEntry::make('latitude')->label('Latitude')->placeholder('-'),
                    TextEntry::make('longitude')->label('Longitude')->placeholder('-'),

                    TextEntry::make('informer')->label('Informer')->columnSpanFull()->placeholder('-'),
                    TextEntry::make('notes')->label('Notes')->columnSpanFull()->placeholder('-'),

                    TextEntry::make('created_at')->label('Created')->dateTime('d M Y H:i'),
                    TextEntry::make('updated_at')->label('Updated')->since(),
                ]),
        ]);
    }
}
