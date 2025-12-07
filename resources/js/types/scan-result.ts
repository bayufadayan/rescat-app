export type ScanStatusValue = 'processing' | 'done' | 'failed';

export type ScanImagePayload = {
    id: string;
    img_original_id?: string | null;
    img_original_url?: string | null;
    img_roi_id?: string | null;
    img_roi_url?: string | null;
    img_remove_bg_id?: string | null;
    img_remove_bg_url?: string | null;
    created_at?: string;
    updated_at?: string;
};

export type ScanResultDetailPayload = {
    id: string;
    scan_result_id: string;
    area_name: string;
    confidence_score: number | null;
    label: string | null;
    description?: string | null;
    advice?: string | null;
    img_roi_area_id?: string | null;
    img_roi_area_url?: string | null;
    img_gradcam_id?: string | null;
    img_gradcam_url?: string | null;
    created_at?: string;
    updated_at?: string;
};

export type ScanResultPayload = {
    id: string;
    scan_id: string;
    remarks: string | null;
    img_landmark_id?: string | null;
    img_landmark_url?: string | null;
    details: ScanResultDetailPayload[];
    created_at?: string;
    updated_at?: string;
};

export type ScanSessionPayload = {
    id: string;
    status: ScanStatusValue;
    scan_type?: string;
    checkup_type?: string;
    created_at?: string;
    updated_at?: string;
    images: ScanImagePayload[];
    result?: ScanResultPayload | null;
};
