<?php

namespace App\Filament\Widgets;

use App\Models\ScanSession;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestScanSessions extends BaseWidget
{
    
    protected static ?int $sort = 4;
    public function getHeading(): ?string
    {
        return 'Latest Scan Sessions';
    }

    protected int|string|array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                ScanSession::query()->latest()
            )
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->copyable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('user.name')
                    ->label('User')
                    ->searchable(),

                TextColumn::make('cat.name')
                    ->label('Cat')
                    ->searchable(),

                TextColumn::make('checkup_type')
                    ->label('Checkup Type')
                    ->badge(),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge(),

                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('d M Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->defaultPaginationPageOption(10);
    }
}
