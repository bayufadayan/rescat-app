import React, { useMemo } from 'react'
import type { ScanResultDetailPayload } from '@/types/scan-result'

type Props = {
    detail: ScanResultDetailPayload | null
    areaLabel: string
}

const DATE_FORMATTER = new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
})

const toSentence = (value: string | null | undefined) => {
    if (!value) return 'Menunggu analisis'
    return value
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export default function MetaRow({ detail, areaLabel }: Props) {
    const meta = useMemo(() => {
        const confidence =
            typeof detail?.confidence_score === 'number'
                ? `${(detail.confidence_score * 100).toFixed(1)}%`
                : 'Belum tersedia'

        const updatedAt = detail?.updated_at
            ? DATE_FORMATTER.format(new Date(detail.updated_at))
            : 'Belum diperbarui'

        return [
            { label: 'Area Pemeriksaan', value: areaLabel },
            { label: 'Status', value: toSentence(detail?.label) },
            { label: 'Confidence', value: confidence },
            { label: 'Pembaruan Terakhir', value: updatedAt }
        ]
    }, [detail, areaLabel])

    return (
        <div className='w-full bg-gray-50 rounded-xl border border-gray-200 shadow-sm overflow-hidden'>
            <table className='w-full border-collapse'>
                <tbody>
                    {meta.map((item) => (
                        <tr key={item.label} className='border-b border-gray-200 last:border-none'>
                            <th className='text-left px-4 py-3 w-1/3 font-semibold text-gray-700 bg-gray-100'>
                                {item.label}
                            </th>
                            <td className='px-4 py-3 text-gray-800'>{item.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
