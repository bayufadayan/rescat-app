import React, { useMemo } from "react";
import ThumbTabItem from "./thumb-tabs/thumb-tab-item";
import { useScanResultContext } from '@/contexts/scan-result-context';
import { ORDERED_SCAN_AREAS } from '@/constants/scan-areas';

export default function ThumbTabs() {
    const { details, activeArea, setActiveArea, areaMeta } = useScanResultContext();
    const detailMap = useMemo(() => new Map(details.map((detail) => [detail.area_name, detail])), [details]);

    return (
        <div className="relative">
            <div
                className="w-full flex gap-3 overflow-x-auto scroll-smooth px-4 py-2 custom-scroll"
                role="tablist"
                aria-label="Thumbnail tabs"
            >
                {ORDERED_SCAN_AREAS.map((area) => {
                    const detail = detailMap.get(area);
                    return (
                        <ThumbTabItem
                            key={area}
                            label={areaMeta[area].label}
                            image={detail?.img_roi_area_url}
                            status={detail?.label ?? null}
                            active={activeArea === area}
                            onClick={() => setActiveArea(area)}
                        />
                    );
                })}
            </div>
        </div>
    );
}
