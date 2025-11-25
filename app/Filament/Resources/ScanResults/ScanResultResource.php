<?php

namespace App\Filament\Resources\ScanResults;

use App\Filament\Resources\ScanResults\Pages\CreateScanResult;
use App\Filament\Resources\ScanResults\Pages\EditScanResult;
use App\Filament\Resources\ScanResults\Pages\ListScanResults;
use App\Filament\Resources\ScanResults\Pages\ViewScanResult;
use App\Filament\Resources\ScanResults\Schemas\ScanResultForm;
use App\Filament\Resources\ScanResults\Schemas\ScanResultInfolist;
use App\Filament\Resources\ScanResults\Tables\ScanResultsTable;
use App\Models\ScanResult;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use UnitEnum;

class ScanResultResource extends Resource
{
    protected static ?string $model = ScanResult::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedClipboardDocumentCheck;

    protected static string|UnitEnum|null $navigationGroup = 'Cats & Scans';
    protected static ?string $navigationLabel = 'Scan Results';

    protected static ?string $modelLabel = 'Scan Result';
    protected static ?string $pluralModelLabel = 'Scan Results';

    protected static ?string $recordTitleAttribute = 'label';

    public static function form(Schema $schema): Schema
    {
        return ScanResultForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return ScanResultInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ScanResultsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListScanResults::route('/'),
            'create' => CreateScanResult::route('/create'),
            'view'   => ViewScanResult::route('/{record}'),
            'edit'   => EditScanResult::route('/{record}/edit'),
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