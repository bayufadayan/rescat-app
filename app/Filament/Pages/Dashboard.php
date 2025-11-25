<?php

namespace App\Filament\Pages;

use Filament\Pages\Dashboard as BaseDashboard;

use App\Filament\Widgets\AdminStatsOverview;
use App\Filament\Widgets\ScanSessionsPerDayChart;
use App\Filament\Widgets\ScanStatusDoughnutChart;
use App\Filament\Widgets\LatestScanSessions;

class Dashboard extends BaseDashboard
{
    // Grid kolom dashboard (responsive)
    public function getColumns(): int|array
    {
        return [
            'md' => 4,
            'xl' => 6,
        ];
    }

    // Susunan widget biar rapi & urut
    public function getWidgets(): array
    {
        return [
            AdminStatsOverview::class,
            ScanSessionsPerDayChart::class,
            ScanStatusDoughnutChart::class,
            LatestScanSessions::class,
        ];
    }
}
