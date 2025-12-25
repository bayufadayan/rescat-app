import React from "react";
import { useScanResultContext } from '@/contexts/scan-result-context';

export default function FinalScore() {
    const { summary } = useScanResultContext();
    const { normalCount, abnormalCount, totalCount } = summary;

    return (
        <div className="text-center select-none space-y-3">
            <div className="flex items-center justify-center gap-6">
                <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold text-green-600">
                        {normalCount}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                        Normal
                    </div>
                </div>
                
                <div className="text-gray-400 text-2xl font-light">/</div>
                
                <div className="flex flex-col items-center">
                    <div className="text-2xl font-bold text-red-600">
                        {abnormalCount}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">
                        Abnormal
                    </div>
                </div>
            </div>
            
            <div className="text-sm text-gray-500">
                dari {totalCount} area yang dianalisis
            </div>
        </div>
    );
}
