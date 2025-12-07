import React from "react";
import { useScanResultContext } from '@/contexts/scan-result-context';

export default function FinalScore() {
    const { summary } = useScanResultContext();
    const score = summary.averagePercent;
    const label = summary.remark;

    return (
        <div className="text-center select-none">
            <div
                className="font-extrabold text-[64px] leading-none text-[#0057FF]"
                style={{ lineHeight: 1 }}
            >
                {score.toFixed(2).replace(".", ",")}
            </div>
            <div className="mt-2 text-lg font-semibold text-[#0057FF]">
                {label}
            </div>
        </div>
    );
}
