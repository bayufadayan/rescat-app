import React from 'react'
import type { ScanResultDetailPayload } from '@/types/scan-result'

type Props = {
    detail: ScanResultDetailPayload | null
    label: string
    active: boolean
    onClick: () => void
}

const FALLBACK = '/images/dummy/cat-eye.png'

const toSentence = (value: string | null | undefined) => {
    if (!value) return 'Belum dianalisis'
    return value
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export default function AnalysisGrid({ detail, label, active, onClick }: Props) {
    const confidence =
        typeof detail?.confidence_score === 'number'
            ? `${Math.round(detail.confidence_score * 100)}%`
            : null

    return (
        <button
            type='button'
            onClick={onClick}
            className={`group flex flex-col items-center rounded-2xl border transition shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#074DE5] ${active ? 'border-[#074DE5] ring-1 ring-[#074DE5]' : 'border-slate-200 hover:border-[#074DE5]/40'}`}
        >
            <div className='relative w-full aspect-square overflow-hidden rounded-2xl bg-slate-200'>
                <img
                    src={detail?.img_roi_area_url ?? FALLBACK}
                    alt={label}
                    className='w-full h-full object-cover'
                />
                {confidence && (
                    <span className='absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wide bg-white/90 px-2 py-1 rounded-full text-slate-700'>
                        {confidence}
                    </span>
                )}
            </div>
            <div className='w-full text-left px-2 py-3'>
                <p className='text-sm font-semibold text-slate-800'>{label}</p>
                <p className='text-xs text-slate-500 truncate'>{toSentence(detail?.label)}</p>
            </div>
        </button>
    )
}
