import React from 'react'
import SubjectPhotoCard from './photo-preview/subject-photo-card'
import SymptomIconPicker from './photo-preview/symptom-icon-picker'
import { useScanResultContext } from '@/contexts/scan-result-context'

export default function PhotoViewer() {
    const { heroImage, heroImageRemoveBg } = useScanResultContext()
    return (
        <div className='w-full bg-neutral-800 h-auto aspect-square max-w-lg rounded-2xl overflow-hidden relative'>
            <SubjectPhotoCard src={heroImage} maskSrc={heroImageRemoveBg} />
            <SymptomIconPicker />
        </div>
    )
}
