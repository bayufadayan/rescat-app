/* eslint-disable @typescript-eslint/no-explicit-any */
function cleanStr(v: string | null, fallback: string) {
    if (!v) return fallback;
    try {
        const parsed = JSON.parse(v);
        if (typeof parsed === 'string') return parsed;
    } catch {
        // ignore
    }

    return v;
}

export function buildSessionPayload(
    address: any,
    coords: { lat: number; lon: number } | null,
    opts?: { informer?: string; notes?: string; cat_id?: string | null },
) {
    const scanOption = cleanStr(localStorage.getItem('scanOption'), 'face');
    const scanType = cleanStr(localStorage.getItem('scanType'), 'quick');

    const original = safeParseLS('scan:original');
    const bb = safeParseLS('scan:bounding-box');
    const roi = safeParseLS('scan:roi');

    const locationStr =
        (address?.display as string) ??
        (coords ? `${coords.lat}, ${coords.lon}` : null);

    console.log('Dari session Payload');

    return {
        scan_type: scanOption,
        checkup_type: scanType,

        latitude: coords?.lat ?? null,
        longitude: coords?.lon ?? null,
        location: locationStr ?? null,

        informer: opts?.informer ?? null,
        notes: opts?.notes ?? null,
        cat_id: opts?.cat_id ?? null,

        images: {
            img_original_id: original?.id ?? null,
            img_original_url: original?.url ?? null,
            img_bounding_box_id: bb?.id ?? null,
            img_bounding_box_url: bb?.url ?? null,
            img_roi_id: roi?.id ?? null,
            img_roi_url: roi?.url ?? null,
        },
    };
}

function safeParseLS(key: string) {
    try {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : null;
    } catch {
        return null;
    }
}
