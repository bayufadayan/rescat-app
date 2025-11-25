<?php

namespace App\Filament\Resources\Cats;

use App\Filament\Resources\Cats\Pages\CreateCat;
use App\Filament\Resources\Cats\Pages\EditCat;
use App\Filament\Resources\Cats\Pages\ListCats;
use App\Filament\Resources\Cats\Pages\ViewCat;
use App\Filament\Resources\Cats\Schemas\CatForm;
use App\Filament\Resources\Cats\Schemas\CatInfolist;
use App\Filament\Resources\Cats\Tables\CatsTable;
use App\Models\Cat;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use UnitEnum;

class CatResource extends Resource
{
    protected static ?string $model = Cat::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedHeart;

    protected static string|UnitEnum|null $navigationGroup = 'Cats & Scans';
    protected static ?string $navigationLabel = 'Cats';

    protected static ?string $modelLabel = 'Cat';
    protected static ?string $pluralModelLabel = 'Cats';

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return CatForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return CatInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CatsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListCats::route('/'),
            'create' => CreateCat::route('/create'),
            'view'   => ViewCat::route('/{record}'),
            'edit'   => EditCat::route('/{record}/edit'),
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