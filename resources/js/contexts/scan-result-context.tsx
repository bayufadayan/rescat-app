import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type {
    ScanResultDetailPayload,
    ScanResultPayload,
    ScanSessionPayload,
} from '@/types/scan-result';
import { ORDERED_SCAN_AREAS, SCAN_AREA_META, type ScanAreaKey } from '@/constants/scan-areas';

export type ScanResultContextValue = {
    session: ScanSessionPayload;
    result: ScanResultPayload | null;
    details: ScanResultDetailPayload[];
    heroImage: string;
    activeArea: string | null;
    setActiveArea: (next: string) => void;
    summary: {
        abnormalCount: number;
        remark: string;
        averageConfidence: number;
        averagePercent: number;
    };
    areaMeta: typeof SCAN_AREA_META;
};

const ScanResultContext = createContext<ScanResultContextValue | undefined>(undefined);

const FALLBACK_IMAGE = '/images/dummy/cat-original.png';

function sortDetails(details: ScanResultDetailPayload[]): ScanResultDetailPayload[] {
    const orderMap = ORDERED_SCAN_AREAS.reduce<Record<string, number>>((acc, key, idx) => {
        acc[key] = idx;
        return acc;
    }, {});

    return details.slice().sort((a, b) => {
        const aOrder = orderMap[a.area_name as ScanAreaKey] ?? 99;
        const bOrder = orderMap[b.area_name as ScanAreaKey] ?? 99;
        return aOrder - bOrder;
    });
}

export const ScanResultProvider: React.FC<{
    session: ScanSessionPayload;
    result: ScanResultPayload | null;
    children: React.ReactNode;
}> = ({ session, result, children }) => {
    const orderedDetails = useMemo(() => sortDetails(result?.details ?? []), [result]);
    const [activeArea, setActiveArea] = useState<string | null>(orderedDetails[0]?.area_name ?? null);

    useEffect(() => {
        if (!orderedDetails.length) {
            setActiveArea(null);
            return;
        }
        if (!activeArea || !orderedDetails.some((detail) => detail.area_name === activeArea)) {
            setActiveArea(orderedDetails[0].area_name);
        }
    }, [orderedDetails, activeArea]);

    const abnormalCount = useMemo(
        () => orderedDetails.filter((detail) => (detail.label ?? '').toLowerCase() === 'abnormal').length,
        [orderedDetails]
    );

    const averageConfidence = useMemo(() => {
        if (!orderedDetails.length) return 0;
        const total = orderedDetails.reduce((sum, detail) => sum + (detail.confidence_score ?? 0), 0);
        return total / orderedDetails.length;
    }, [orderedDetails]);

    const summaryRemark = result?.remarks ?? 'Sedang dianalisis';

    const heroImage =
        result?.img_landmark_url ??
        session.images?.[0]?.img_roi_url ??
        session.images?.[0]?.img_original_url ??
        FALLBACK_IMAGE;

    const value = useMemo<ScanResultContextValue>(() => ({
        session,
        result: result ?? null,
        details: orderedDetails,
        heroImage,
        activeArea,
        setActiveArea,
        summary: {
            abnormalCount,
            remark: summaryRemark,
            averageConfidence,
            averagePercent: Math.round(averageConfidence * 10000) / 100,
        },
        areaMeta: SCAN_AREA_META,
    }), [
        session,
        result,
        orderedDetails,
        heroImage,
        activeArea,
        abnormalCount,
        summaryRemark,
        averageConfidence,
    ]);

    return <ScanResultContext.Provider value={value}>{children}</ScanResultContext.Provider>;
};

export function useScanResultContext(): ScanResultContextValue {
    const ctx = useContext(ScanResultContext);
    if (!ctx) {
        throw new Error('useScanResultContext must be used inside ScanResultProvider');
    }
    return ctx;
}
