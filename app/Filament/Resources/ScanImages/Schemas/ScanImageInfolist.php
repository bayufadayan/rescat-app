<?php

namespace App\Filament\Resources\ScanImages\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class ScanImageInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('id')
                    ->label('ID'),
                TextEntry::make('scan_id'),
                TextEntry::make('img_original_id'),
                TextEntry::make('img_original_url'),
                TextEntry::make('img_bounding_box_id'),
                TextEntry::make('img_bounding_box_url'),
                TextEntry::make('img_roi_id'),
                TextEntry::make('img_roi_url'),
                TextEntry::make('img_remove_bg_id'),
                TextEntry::make('img_remove_bg_url'),
                TextEntry::make('deleted_at')
                    ->dateTime(),
                TextEntry::make('created_at')
                    ->dateTime(),
                TextEntry::make('updated_at')
                    ->dateTime(),
            ]);
    }
}
