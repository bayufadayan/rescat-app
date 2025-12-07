import React from 'react'
import type { ScanResultDetailPayload } from '@/types/scan-result'

type Props = {
    detail: ScanResultDetailPayload | null
    areaLabel: string
}

const FALLBACK = '/images/dummy/cat-original.png'

export default function MediaViewer({ detail, areaLabel }: Props) {
    const roi = detail?.img_roi_area_url ?? FALLBACK
    const gradcam = detail?.img_gradcam_url ?? null

    return (
        <div className='w-full flex flex-col md:flex-row gap-3'>
            <figure className='w-full md:w-1/2 rounded-xl overflow-hidden border border-slate-200'>
                <img src={roi} alt={`ROI ${areaLabel}`} className='w-full h-full object-cover' />
                <figcaption className='px-3 py-2 text-xs text-slate-600 bg-slate-50 border-t border-slate-200'>
                    ROI — {areaLabel}
                </figcaption>
            </figure>
            {gradcam && (
                <figure className='w-full md:w-1/2 rounded-xl overflow-hidden border border-slate-200'>
                    <img src={gradcam} alt={`Grad-CAM ${areaLabel}`} className='w-full h-full object-cover' />
                    <figcaption className='px-3 py-2 text-xs text-slate-600 bg-slate-50 border-t border-slate-200'>
                        Grad-CAM
                    </figcaption>
                </figure>
            )}
        </div>
    )
}
