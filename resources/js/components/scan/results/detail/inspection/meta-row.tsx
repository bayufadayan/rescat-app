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

    const hasAiContent = Boolean(detail?.description || detail?.advice)
    const hasLabel = Boolean(detail?.label)
    const showAiUnavailable = hasLabel && !hasAiContent

    return (
        <div className='w-full space-y-3'>
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

            {showAiUnavailable && (
                <div className='w-full bg-gray-100 rounded-xl border border-gray-300 px-4 py-3 shadow-sm'>
                    <div className='flex items-start gap-2'>
                        <svg className='w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        <div className='flex-1'>
                            <p className='text-sm font-medium text-gray-700'>Deskripsi & Saran AI Tidak Tersedia</p>
                            <p className='text-xs text-gray-600 mt-1'>
                                AI tidak dapat menghasilkan rekomendasi saat ini. Kemungkinan karena limit request tercapai atau layanan sedang sibuk. Hasil klasifikasi tetap tersedia.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {detail?.description && (
                <div className='w-full bg-blue-50 rounded-xl border border-blue-200 px-4 py-3 shadow-sm'>
                    <div className='flex items-start gap-2'>
                        <svg className='w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        <div className='flex-1'>
                            <p className='text-sm font-semibold text-blue-900 mb-1'>Deskripsi Hasil</p>
                            <p className='text-sm text-blue-800 leading-relaxed'>{detail.description}</p>
                        </div>
                    </div>
                </div>
            )}

            {detail?.advice && (
                <div className='w-full bg-amber-50 rounded-xl border border-amber-200 px-4 py-3 shadow-sm'>
                    <div className='flex items-start gap-2'>
                        <svg className='w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' />
                        </svg>
                        <div className='flex-1'>
                            <p className='text-sm font-semibold text-amber-900 mb-1'>Saran Perawatan</p>
                            <p className='text-sm text-amber-800 leading-relaxed'>{detail.advice}</p>
                        </div>
                    </div>
                </div>
            )}

            {hasAiContent && (
                <div className='flex items-center justify-end gap-2 text-xs text-gray-500'>
                    <svg className='w-3.5 h-3.5' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z' />
                    </svg>
                    <span>Generated by Groq AI</span>
                </div>
            )}
        </div>
    )
}
