<?php

namespace App\Filament\Resources\ScanResultDetails\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class ScanResultDetailInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('id')
                    ->label('ID'),
                TextEntry::make('scan_result_id'),
                TextEntry::make('criteria'),
                TextEntry::make('score')
                    ->numeric(),
                TextEntry::make('remarks'),
                TextEntry::make('photo_url'),
                TextEntry::make('deleted_at')
                    ->dateTime(),
                TextEntry::make('created_at')
                    ->dateTime(),
                TextEntry::make('updated_at')
                    ->dateTime(),
            ]);
    }
}
