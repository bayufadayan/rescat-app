// deretan ikon (mata, hidung, dll)
import React, { useMemo } from 'react';
import SymptomIcon from './symptom-icon';
import { useScanResultContext } from '@/contexts/scan-result-context';
import { ORDERED_SCAN_AREAS } from '@/constants/scan-areas';

export default function SymptomIconPicker() {
    const { details, areaMeta } = useScanResultContext();
    const detailMap = useMemo(() => new Map(details.map((detail) => [detail.area_name, detail])), [details]);

    return (
        <div className='absolute bottom-0 flex flex-wrap w-full max-w-full justify-between bg-transparent px-3 py-4 gap-2'>
            {ORDERED_SCAN_AREAS.map((area) => {
                const meta = areaMeta[area];
                const detail = detailMap.get(area);
                const label = (detail?.label ?? '').toLowerCase();
                const status = detail ? (label === 'abnormal' ? 'abnormal' : 'normal') : 'pending';

                return (
                    <SymptomIcon
                        key={area}
                        status={status}
                        label={`${meta.label} — ${status === 'abnormal' ? 'perlu perhatian' : 'normal'}`}
                    >
                        <img 
                            src={meta.icon} 
                            alt={meta.label} 
                            onContextMenu={(e) => e.preventDefault()}
                            draggable={false}
                        />
                    </SymptomIcon>
                );
            })}
        </div>
    );
}
