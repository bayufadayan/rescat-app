<?php

namespace App\Filament\Resources\ScanImages\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ScanImageForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('scan_id')
                    ->required(),
                TextInput::make('img_original_id'),
                TextInput::make('img_original_url'),
                TextInput::make('img_bounding_box_id'),
                TextInput::make('img_bounding_box_url'),
                TextInput::make('img_roi_id'),
                TextInput::make('img_roi_url'),
                TextInput::make('img_remove_bg_id'),
                TextInput::make('img_remove_bg_url'),
            ]);
    }
}
