<?php

namespace App\Filament\Resources\ScanResultDetails;

use App\Filament\Resources\ScanResultDetails\Pages\CreateScanResultDetail;
use App\Filament\Resources\ScanResultDetails\Pages\EditScanResultDetail;
use App\Filament\Resources\ScanResultDetails\Pages\ListScanResultDetails;
use App\Filament\Resources\ScanResultDetails\Pages\ViewScanResultDetail;
use App\Filament\Resources\ScanResultDetails\Schemas\ScanResultDetailForm;
use App\Filament\Resources\ScanResultDetails\Schemas\ScanResultDetailInfolist;
use App\Filament\Resources\ScanResultDetails\Tables\ScanResultDetailsTable;
use App\Models\ScanResultDetail;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use UnitEnum;

class ScanResultDetailResource extends Resource
{
    protected static ?string $model = ScanResultDetail::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;

    protected static string|UnitEnum|null $navigationGroup = 'Cats & Scans';
    protected static ?string $navigationLabel = 'Scan Result Details';

    protected static ?string $modelLabel = 'Scan Result Detail';
    protected static ?string $pluralModelLabel = 'Scan Result Details';

    protected static ?string $recordTitleAttribute = 'criteria';

    public static function form(Schema $schema): Schema
    {
        return ScanResultDetailForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return ScanResultDetailInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ScanResultDetailsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListScanResultDetails::route('/'),
            'create' => CreateScanResultDetail::route('/create'),
            'view'   => ViewScanResultDetail::route('/{record}'),
            'edit'   => EditScanResultDetail::route('/{record}/edit'),
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
