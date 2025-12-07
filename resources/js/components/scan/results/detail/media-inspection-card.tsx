import React, { useMemo } from 'react'
import MediaViewer from './inspection/media-viewer'
import MetaRow from './inspection/meta-row'
import NotesTextArea from './inspection/notes-text-area'
import { useScanResultContext } from '@/contexts/scan-result-context'

export default function MediaInspectionCard() {
    const { details, activeArea, areaMeta } = useScanResultContext()
    const activeDetail = useMemo(() => {
        if (!details.length) return null
        if (!activeArea) return details[0]
        return details.find((detail) => detail.area_name === activeArea) ?? details[0]
    }, [details, activeArea])

    const label = activeDetail ? areaMeta[activeDetail.area_name as keyof typeof areaMeta]?.label ?? activeDetail.area_name : 'Area'

    return (
        <div className='px-4 py-4 rounded-2xl overflow-hidden shadow-md bg-white flex flex-col w-full gap-4'>
            <h3 className='text-[#074DE5] font-bold text-center'>Hasil Analisis</h3>
            <MediaViewer detail={activeDetail} areaLabel={label} />
            <MetaRow detail={activeDetail} areaLabel={label} />
            <NotesTextArea detail={activeDetail} areaLabel={label} />
        </div>
    )
}
