import React, { useMemo } from 'react'
import AnalysisGrid from './analysis/analysis-grid'
import { useScanResultContext } from '@/contexts/scan-result-context'
import { ORDERED_SCAN_AREAS } from '@/constants/scan-areas'

export default function AnalysisTile() {
    const { details, areaMeta, activeArea, setActiveArea } = useScanResultContext()
    const detailMap = useMemo(
        () => new Map(details.map((detail) => [detail.area_name, detail])),
        [details]
    )

    return (
        <div className='w-full'>
            <h4 className='text-gray-800 font-semibold mb-3'>Daftar Analisis Gambar</h4>

            <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                {ORDERED_SCAN_AREAS.map((area) => (
                    <AnalysisGrid
                        key={area}
                        detail={detailMap.get(area) ?? null}
                        label={areaMeta[area].label}
                        active={activeArea === area}
                        onClick={() => setActiveArea(area)}
                    />
                ))}
            </div>
        </div>
    )
}
