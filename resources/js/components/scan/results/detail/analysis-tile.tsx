import React, { useMemo, useState } from 'react'
import ImageZoomModal from './inspection/image-zoom-modal'
import { useScanResultContext } from '@/contexts/scan-result-context'

type GalleryImage = {
    src: string
    alt: string
    label: string
}

export default function AnalysisTile() {
    const { details, session, result } = useScanResultContext()
    const [zoomImage, setZoomImage] = useState<{ src: string; alt: string; index: number } | null>(null)

    const galleryImages = useMemo<GalleryImage[]>(() => {
        const images: GalleryImage[] = []

        // Original Image
        const originalUrl = session.images?.[0]?.img_original_url
        if (originalUrl) {
            images.push({ src: originalUrl, alt: 'Gambar Asli', label: 'Original' })
        }

        // Removed BG
        const removeBgUrl = session.images?.[0]?.img_remove_bg_url
        if (removeBgUrl) {
            images.push({ src: removeBgUrl, alt: 'Background Removed', label: 'Remove BG' })
        }

        // ROI (Region of Interest)
        const roiUrl = session.images?.[0]?.img_roi_url
        if (roiUrl) {
            images.push({ src: roiUrl, alt: 'Region of Interest', label: 'ROI' })
        }

        // Landmark
        const landmarkUrl = result?.img_landmark_url
        if (landmarkUrl) {
            images.push({ src: landmarkUrl, alt: 'Landmark Detection', label: 'Landmark' })
        }

        // Bounding Box - cek juga di session.images[0]
        const bboxUrl = result?.img_bbox_url || session.images?.[0]?.img_bbox_url
        if (bboxUrl) {
            images.push({ src: bboxUrl, alt: 'Bounding Box', label: 'Bounding Box' })
        }

        // Per-area ROI and GradCAM
        details.forEach((detail) => {
            if (detail.img_roi_area_url) {
                images.push({
                    src: detail.img_roi_area_url,
                    alt: `ROI ${detail.area_name}`,
                    label: `ROI ${detail.area_name}`,
                })
            }
            if (detail.img_gradcam_url) {
                images.push({
                    src: detail.img_gradcam_url,
                    alt: `GradCAM ${detail.area_name}`,
                    label: `GradCAM ${detail.area_name}`,
                })
            }
        })

        return images
    }, [session, result, details])

    const handleNextImage = () => {
        if (!zoomImage) return
        const nextIndex = (zoomImage.index + 1) % galleryImages.length
        setZoomImage({ 
            src: galleryImages[nextIndex].src, 
            alt: galleryImages[nextIndex].alt,
            index: nextIndex 
        })
    }

    const handlePrevImage = () => {
        if (!zoomImage) return
        const prevIndex = (zoomImage.index - 1 + galleryImages.length) % galleryImages.length
        setZoomImage({ 
            src: galleryImages[prevIndex].src, 
            alt: galleryImages[prevIndex].alt,
            index: prevIndex 
        })
    }

    return (
        <>
            <div className='w-full'>
                <h4 className='text-gray-800 font-semibold mb-3'>Galeri Gambar Analisis</h4>

                <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
                    {galleryImages.map((img, idx) => (
                        <div
                            key={idx}
                            onClick={() => setZoomImage({ src: img.src, alt: img.alt, index: idx })}
                            className='relative aspect-square rounded-xl overflow-hidden border border-slate-200 cursor-pointer hover:border-sky-400 hover:shadow-lg transition-all group'
                        >
                            <img 
                                src={img.src} 
                                alt={img.alt} 
                                className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                                onContextMenu={(e) => e.preventDefault()}
                                draggable={false}
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end'>
                                <span className='text-white text-xs font-medium px-2 py-2 w-full'>
                                    {img.label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <ImageZoomModal
                src={zoomImage?.src ?? ''}
                alt={zoomImage?.alt ?? ''}
                isOpen={!!zoomImage}
                onClose={() => setZoomImage(null)}
                onNext={galleryImages.length > 1 ? handleNextImage : undefined}
                onPrev={galleryImages.length > 1 ? handlePrevImage : undefined}
                showNavigation={galleryImages.length > 1}
            />
        </>
    )
}
