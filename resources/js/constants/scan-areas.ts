export type ScanAreaKey = 'left_eye' | 'right_eye' | 'mouth' | 'left_ear' | 'right_ear';

export const ORDERED_SCAN_AREAS: ScanAreaKey[] = [
    'left_eye',
    'right_eye',
    'mouth',
    'left_ear',
    'right_ear',
];

export const SCAN_AREA_META: Record<ScanAreaKey, { label: string; shortLabel: string; icon: string; accent: string }> = {
    left_eye: {
        label: 'Mata Kiri',
        shortLabel: 'Mata Kiri',
        icon: '/images/icon/result-cat-eyes-icon.png',
        accent: '#0ea5e9',
    },
    right_eye: {
        label: 'Mata Kanan',
        shortLabel: 'Mata Kanan',
        icon: '/images/icon/result-cat-eyes-icon.png',
        accent: '#38bdf8',
    },
    mouth: {
        label: 'Mulut',
        shortLabel: 'Mulut',
        icon: '/images/icon/result-cat-mouth-icon.png',
        accent: '#f97316',
    },
    left_ear: {
        label: 'Telinga Kiri',
        shortLabel: 'Telinga Kiri',
        icon: '/images/icon/result-cat-ears-icon.png',
        accent: '#fb7185',
    },
    right_ear: {
        label: 'Telinga Kanan',
        shortLabel: 'Telinga Kanan',
        icon: '/images/icon/result-cat-ears-icon.png',
        accent: '#ec4899',
    },
};

export const areaLabel = (key: string): string => {
    const normalized = key as ScanAreaKey;
    return SCAN_AREA_META[normalized]?.label ?? key;
};
