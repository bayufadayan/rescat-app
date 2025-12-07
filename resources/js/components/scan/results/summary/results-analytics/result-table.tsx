import React, { useMemo } from 'react'
import { useScanResultContext } from '@/contexts/scan-result-context'
import { ORDERED_SCAN_AREAS } from '@/constants/scan-areas'

export default function ResultTable() {
    const { details, areaMeta } = useScanResultContext()
    const rows = useMemo(() => {
        const map = new Map(details.map((detail) => [detail.area_name, detail]))
        return ORDERED_SCAN_AREAS.map((area) => ({
            label: areaMeta[area].label,
            detail: map.get(area),
        }))
    }, [details, areaMeta])

    const statusLabel = (value?: string | null) => {
        if (!value) return 'Belum tersedia'
        return value.toLowerCase() === 'abnormal' ? 'Abnormal' : 'Normal'
    }

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 text-slate-600 text-sm">
                    <tr>
                        <th className="px-4 py-3 font-semibold">Area</th>
                        <th className="px-4 py-3 font-semibold text-right">Hasil</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(({ label, detail }) => {
                        const status = statusLabel(detail?.label)
                        const isAbnormal = (detail?.label ?? '').toLowerCase() === 'abnormal'
                        return (
                            <tr key={label} className="border-t border-slate-100 hover:bg-slate-50/70 transition-colors">
                                <td className="px-4 py-3 text-slate-800">{label}</td>
                                <td className={`px-4 py-3 text-right font-semibold ${isAbnormal ? 'text-rose-600' : 'text-emerald-600'}`}>
                                    {status}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}
