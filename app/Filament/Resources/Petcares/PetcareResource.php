<?php

namespace App\Filament\Resources\Petcares;

use App\Filament\Resources\Petcares\Pages\CreatePetcare;
use App\Filament\Resources\Petcares\Pages\EditPetcare;
use App\Filament\Resources\Petcares\Pages\ListPetcares;
use App\Filament\Resources\Petcares\Pages\ViewPetcare;
use App\Filament\Resources\Petcares\Schemas\PetcareForm;
use App\Filament\Resources\Petcares\Schemas\PetcareInfolist;
use App\Filament\Resources\Petcares\Tables\PetcaresTable;
use App\Models\Petcare;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use UnitEnum;

class PetcareResource extends Resource
{
    protected static ?string $model = Petcare::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMapPin;

    protected static string|UnitEnum|null $navigationGroup = 'Directory';
    protected static ?string $navigationLabel = 'Petcares';

    protected static ?string $modelLabel = 'Petcare';
    protected static ?string $pluralModelLabel = 'Petcares';

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return PetcareForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return PetcareInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PetcaresTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index'  => ListPetcares::route('/'),
            'create' => CreatePetcare::route('/create'),
            'view'   => ViewPetcare::route('/{record}'),
            'edit'   => EditPetcare::route('/{record}/edit'),
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
