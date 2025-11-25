<?php

namespace App\Filament\Widgets;

use App\Models\ScanSession;
use Filament\Widgets\ChartWidget;

class ScanStatusDoughnutChart extends ChartWidget
{
    public function getHeading(): ?string
    {
        return 'Scan Status Distribution';
    }

    protected static ?int $sort = 3;

    protected int|string|array $columnSpan = [
        'md' => 4,
        'xl' => 2,
    ];

    protected function getData(): array
    {
        $counts = ScanSession::query()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        $labels = array_keys($counts);
        $data = array_values($counts);

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
        return 'doughnut';
    }
}
