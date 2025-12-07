import React from 'react'
import type { ScanResultDetailPayload } from '@/types/scan-result'

type Props = {
    detail: ScanResultDetailPayload | null
    areaLabel: string
}

export default function NotesTextArea({ detail, areaLabel }: Props) {
    const description = detail?.advice || detail?.description

    const placeholder = `Belum ada catatan tambahan untuk area ${areaLabel}.`;

    return (
        <div className='w-full bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-4'>
            <h4 className='text-gray-700 font-semibold mb-2'>Catatan</h4>
            <div className='text-gray-800 text-sm leading-relaxed whitespace-pre-line'>
                {(description || placeholder).trim()}
            </div>
        </div>
    )
}
