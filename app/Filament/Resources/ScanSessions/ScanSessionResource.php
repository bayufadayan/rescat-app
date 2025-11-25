<?php

namespace App\Filament\Resources\ScanSessions;

use App\Filament\Resources\ScanSessions\Pages\CreateScanSession;
use App\Filament\Resources\ScanSessions\Pages\EditScanSession;
use App\Filament\Resources\ScanSessions\Pages\ListScanSessions;
use App\Filament\Resources\ScanSessions\Pages\ViewScanSession;
use App\Filament\Resources\ScanSessions\Schemas\ScanSessionForm;
use App\Filament\Resources\ScanSessions\Schemas\ScanSessionInfolist;
use App\Filament\Resources\ScanSessions\Tables\ScanSessionsTable;
use App\Models\ScanSession;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use UnitEnum;

class ScanSessionResource extends Resource
{
    protected static ?string $model = ScanSession::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedQrCode;

    protected static string|UnitEnum|null $navigationGroup = 'Cats & Scans';
    protected static ?string $navigationLabel = 'Scan Sessions';

    protected static ?string $modelLabel = 'Scan Session';
    protected static ?string $pluralModelLabel = 'Scan Sessions';

    protected static ?string $recordTitleAttribute = 'id';

    public static function form(Schema $schema): Schema
    {
        return ScanSessionForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return ScanSessionInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ScanSessionsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListScanSessions::route('/'),
            'create' => CreateScanSession::route('/create'),
            'view'   => ViewScanSession::route('/{record}'),
            'edit'   => EditScanSession::route('/{record}/edit'),
        ];
    }

    public static function getRecordRouteBindingEloquentQuery(): Builder
    {
        // supaya record yang trashed masih bisa di-view/edit/restore
        return parent::getRecordRouteBindingEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
