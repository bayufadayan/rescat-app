export type ScanSelection = 'face' | 'full';
export type ScanType = 'quick' | 'detail';

const LABELS: Record<string, string> = {
    'face:quick': 'Face only — Quick scan',
    'face:detail': 'Face only — Detail scan',
    'full:quick': 'Full body — Quick scan',
    'full:detail': 'Full body — Detail scan',
};

const STEPS: Record<string, string[]> = {
    'face:quick': [
        'Pastikan pencahayaan cukup dan wajah terlihat jelas.',
        'Posisikan perangkat setinggi mata dan stabil.',
        'Bersihkan lensa kamera sebelum memulai.',
        'Usahakan wajah kucing lurus menatap kamera.',
        'Hindari gerakan cepat selama pemindaian.',
        'Pastikan baterai dan koneksi internet stabil.',
        'Ulangi pemindaian bila diminta sistem.',
        'Disarankan menggunakan flash agar wajah terlihat jelas.',
    ],
    'face:detail': ['Mode ini masih dalam pengembangan.'],
    'full:quick': ['Mode ini masih dalam pengembangan.'],
    'full:detail': ['Mode ini masih dalam pengembangan.'],
};

export function getScanPresetLabel(
    sel: ScanSelection | null,
    type: ScanType | null,
): string {
    if (!sel || !type) return 'Pilih tipe terlebih dahulu';
    return LABELS[`${sel}:${type}`] ?? 'Preset tidak dikenal';
}

export function getSteps(
    sel: ScanSelection | null,
    type: ScanType | null,
): string[] {
    if (!sel || !type) return [];
    return STEPS[`${sel}:${type}`] ?? [];
}
