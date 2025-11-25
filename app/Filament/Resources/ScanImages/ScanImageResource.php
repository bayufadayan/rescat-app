<?php

namespace App\Filament\Resources\ScanImages;

use App\Filament\Resources\ScanImages\Pages\CreateScanImage;
use App\Filament\Resources\ScanImages\Pages\EditScanImage;
use App\Filament\Resources\ScanImages\Pages\ListScanImages;
use App\Filament\Resources\ScanImages\Pages\ViewScanImage;
use App\Filament\Resources\ScanImages\Schemas\ScanImageForm;
use App\Filament\Resources\ScanImages\Schemas\ScanImageInfolist;
use App\Filament\Resources\ScanImages\Tables\ScanImagesTable;
use App\Models\ScanImage;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use UnitEnum;

class ScanImageResource extends Resource
{
    protected static ?string $model = ScanImage::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedPhoto;

    protected static string|UnitEnum|null $navigationGroup = 'Cats & Scans';
    protected static ?string $navigationLabel = 'Scan Images';

    protected static ?string $modelLabel = 'Scan Image';
    protected static ?string $pluralModelLabel = 'Scan Images';

    protected static ?string $recordTitleAttribute = 'scan_id';

    public static function form(Schema $schema): Schema
    {
        return ScanImageForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return ScanImageInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ScanImagesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListScanImages::route('/'),
            'create' => CreateScanImage::route('/create'),
            'view'   => ViewScanImage::route('/{record}'),
            'edit'   => EditScanImage::route('/{record}/edit'),
        ];
    }

    public static function getRecordRouteBindingEloquentQuery(): Builder
    {
        return parent::getRecordRouteBindingEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
