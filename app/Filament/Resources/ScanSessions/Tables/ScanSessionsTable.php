<?php

namespace App\Filament\Resources\ScanSessions\Tables;

use App\Enums\CheckupType;
use App\Enums\ScanStatus;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ForceDeleteAction;
use Filament\Actions\ForceDeleteBulkAction;
use Filament\Actions\RestoreAction;
use Filament\Actions\RestoreBulkAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TrashedFilter;
use Filament\Tables\Table;

class ScanSessionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->copyable()
                    ->searchable()
                    ->toggleable(),

                TextColumn::make('cat.name')
                    ->label('Cat')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('user.name')
                    ->label('User')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->formatStateUsing(fn ($state) => self::formatEnumState($state))
                    ->sortable(),

                TextColumn::make('checkup_type')
                    ->label('Checkup')
                    ->badge()
                    ->formatStateUsing(fn ($state) => self::formatEnumState($state))
                    ->sortable(),

                TextColumn::make('scan_type')
                    ->label('Scan Type')
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->filters([
                TrashedFilter::make(),

                SelectFilter::make('status')
                    ->label('Status')
                    ->options(self::enumOptions(ScanStatus::class)),

                SelectFilter::make('checkup_type')
                    ->label('Checkup Type')
                    ->options(self::enumOptions(CheckupType::class)),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
                DeleteAction::make(),
                RestoreAction::make(),
                ForceDeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                    RestoreBulkAction::make(),
                    ForceDeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    private static function enumOptions(string $enumClass): array
    {
        $options = [];
        foreach ($enumClass::cases() as $case) {
            $value = property_exists($case, 'value') ? $case->value : $case->name;
            $label = ucwords(strtolower(str_replace('_', ' ', $case->name)));
            $options[$value] = $label;
        }
        return $options;
    }

    private static function formatEnumState($state): string
    {
        // Kadang state sudah berupa enum instance (karena cast), kadang string (tergantung context)
        if (is_object($state) && property_exists($state, 'name')) {
            return ucwords(strtolower(str_replace('_', ' ', $state->name)));
        }

        if (is_string($state)) {
            return ucwords(strtolower(str_replace('_', ' ', $state)));
        }

        return (string) $state;
    }
}
