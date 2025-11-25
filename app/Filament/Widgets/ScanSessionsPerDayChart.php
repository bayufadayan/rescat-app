<?php

namespace App\Filament\Widgets;

use App\Models\ScanSession;
use Carbon\Carbon;
use Filament\Widgets\ChartWidget;

class ScanSessionsPerDayChart extends ChartWidget
{
    
    protected static ?int $sort = 2;
    public function getHeading(): ?string
    {
        return 'Scan Sessions (Last 14 days)';
    }

    protected int|string|array $columnSpan = [
        'md' => 4,
        'xl' => 4,
    ];

    protected function getData(): array
    {
        $days = 14;
        $start = now()->subDays($days - 1)->startOfDay();
        $end = now()->endOfDay();

        // Ambil data harian (simple & aman)
        $rows = ScanSession::query()
            ->whereBetween('created_at', [$start, $end])
            ->get()
            ->groupBy(fn ($row) => Carbon::parse($row->created_at)->format('Y-m-d'))
            ->map->count();

        $labels = [];
        $data = [];

        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $key = $date->format('Y-m-d');

            $labels[] = $date->format('d M');
            $data[] = $rows[$key] ?? 0;
        }

        return [
            'datasets' => [
                [
                    'label' => 'Sessions',
                    'data' => $data,
                ],
            ],
            'labels' => $labels,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
