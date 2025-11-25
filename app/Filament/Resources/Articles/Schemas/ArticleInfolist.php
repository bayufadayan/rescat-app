<?php

namespace App\Filament\Resources\Articles\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class ArticleInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Meta')
                    ->columns(2)
                    ->schema([
                        TextEntry::make('title')->label('Title'),
                        TextEntry::make('slug')->label('Slug'),
                        TextEntry::make('author.name')->label('Author'),
                        TextEntry::make('created_at')->label('Created')->dateTime('d M Y H:i'),
                        TextEntry::make('updated_at')->label('Updated')->since(),
                    ]),

                Section::make('Content')
                    ->schema([
                        TextEntry::make('content')
                            ->label('Content')
                            ->html()
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}
