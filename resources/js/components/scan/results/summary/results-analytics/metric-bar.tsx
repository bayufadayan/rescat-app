import React, { useMemo } from "react";
import { useScanResultContext } from '@/contexts/scan-result-context';
import { ORDERED_SCAN_AREAS } from '@/constants/scan-areas';

export default function MetricBar() {
    const { details, areaMeta } = useScanResultContext();
    const bars = useMemo(() => {
        const map = new Map(details.map((detail) => [detail.area_name, detail]));
        return ORDERED_SCAN_AREAS.map((area) => {
            const detail = map.get(area);
            const percent = detail?.confidence_score ? Math.round((detail.confidence_score ?? 0) * 100) : 0;
            const abnormal = (detail?.label ?? '').toLowerCase() === 'abnormal';
            return {
                key: area,
                label: areaMeta[area].label,
                percent,
                color: abnormal ? '#EF4444' : '#22C55E',
            };
        });
    }, [details, areaMeta]);

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-3">
            {bars.map((bar) => (
                <div key={bar.key}>
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                        <span>{bar.label}</span>
                        <span className="font-semibold text-slate-800">{bar.percent}%</span>
                    </div>
                    <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="absolute left-0 top-0 h-full rounded-full transition-all"
                            style={{
                                width: `${bar.percent}%`,
                                backgroundColor: bar.color,
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
