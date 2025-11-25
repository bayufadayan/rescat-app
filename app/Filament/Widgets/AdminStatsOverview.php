<?php

namespace App\Filament\Widgets;

use App\Models\Article;
use App\Models\Cat;
use App\Models\Petcare;
use App\Models\ScanSession;
use App\Models\User;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class AdminStatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;

    // Biar full-width (nggak “setengah kartu”)
    protected int|string|array $columnSpan = 'full';

    protected function getStats(): array
    {
        $scan7DaysTrend = $this->scanTrend(days: 7);

        return [
            Stat::make('Users', User::query()->count())
                ->description('Total pengguna')
                ->descriptionIcon('heroicon-m-users'),

            Stat::make('Cats', Cat::query()->count())
                ->description('Total kucing terdaftar')
                ->descriptionIcon('heroicon-m-heart'),

            Stat::make('Scan Sessions', ScanSession::query()->count())
                ->description('Total sesi scan')
                ->descriptionIcon('heroicon-m-qr-code')
                ->chart($scan7DaysTrend),

            Stat::make('Processing', ScanSession::processing()->count())
                ->description('Yang lagi diproses')
                ->descriptionIcon('heroicon-m-arrow-path')
                ->color('warning'),

            Stat::make('Done', ScanSession::done()->count())
                ->description('Selesai diproses')
                ->descriptionIcon('heroicon-m-check-circle')
                ->color('success'),

            Stat::make('Articles', Article::query()->count())
                ->description('Konten artikel')
                ->descriptionIcon('heroicon-m-document-text'),

            Stat::make('Petcares', Petcare::query()->count())
                ->description('Data petcare')
                ->descriptionIcon('heroicon-m-map-pin'),
        ];
    }

    private function scanTrend(int $days = 7): array
    {
        $start = now()->subDays($days - 1)->startOfDay();
        $end = now()->endOfDay();

        $raw = ScanSession::query()
            ->whereBetween('created_at', [$start, $end])
            ->get()
            ->groupBy(fn ($row) => Carbon::parse($row->created_at)->format('Y-m-d'))
            ->map->count()
            ->toArray();

        $trend = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $dateKey = now()->subDays($i)->format('Y-m-d');
            $trend[] = $raw[$dateKey] ?? 0;
        }

        return $trend;
    }
}
