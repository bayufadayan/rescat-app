import React, { useState, useRef, useEffect } from 'react'
import ImageZoomModal from './image-zoom-modal'
import type { ScanResultDetailPayload } from '@/types/scan-result'

type Props = {
    detail: ScanResultDetailPayload | null
    areaLabel: string
}

const FALLBACK = '/images/dummy/cat-original.png'

export default function MediaViewer({ detail, areaLabel }: Props) {
    const roi = detail?.img_roi_area_url ?? FALLBACK
    const gradcam = detail?.img_gradcam_url ?? null
    const [zoomImage, setZoomImage] = useState<{ src: string; alt: string; index: number } | null>(null)
    const [isHolding, setIsHolding] = useState(false)
    const holdTimerRef = useRef<NodeJS.Timeout | null>(null)
    const wasHoldingRef = useRef(false)
    
    const images = [
        { src: roi, alt: `ROI ${areaLabel}` },
        ...(gradcam ? [{ src: gradcam, alt: `Grad-CAM ${areaLabel}` }] : [])
    ]

    const handleHoldStart = () => {
        wasHoldingRef.current = false
        holdTimerRef.current = setTimeout(() => {
            setIsHolding(true)
            wasHoldingRef.current = true
        }, 500) // Hold for 500ms
    }

    const handleHoldEnd = () => {
        if (holdTimerRef.current) {
            clearTimeout(holdTimerRef.current)
            holdTimerRef.current = null
        }
        setIsHolding(false)
        // Reset wasHolding after a short delay to allow click event to check it
        setTimeout(() => {
            wasHoldingRef.current = false
        }, 100)
    }

    const handleClick = (src: string, alt: string, index: number) => {
        // Only open modal if user was NOT holding
        if (!wasHoldingRef.current) {
            setZoomImage({ src, alt, index })
        }
    }

    useEffect(() => {
        return () => {
            if (holdTimerRef.current) {
                clearTimeout(holdTimerRef.current)
            }
        }
    }, [])

    const handleNextImage = () => {
        if (!zoomImage) return
        const nextIndex = (zoomImage.index + 1) % images.length
        setZoomImage({ ...images[nextIndex], index: nextIndex })
    }

    const handlePrevImage = () => {
        if (!zoomImage) return
        const prevIndex = (zoomImage.index - 1 + images.length) % images.length
        setZoomImage({ ...images[prevIndex], index: prevIndex })
    }

    return (
        <>
            {/* Mobile: Hold to reveal GradCAM */}
            <div className='w-full md:hidden'>
                <div className='relative w-full'>
                    <figure 
                        className='w-full rounded-xl overflow-hidden border border-slate-200 cursor-pointer transition-all select-none'
                        onTouchStart={handleHoldStart}
                        onTouchEnd={handleHoldEnd}
                        onMouseDown={handleHoldStart}
                        onMouseUp={handleHoldEnd}
                        onMouseLeave={handleHoldEnd}
                        onClick={() => handleClick(roi, `ROI ${areaLabel}`, 0)}
                    >
                        {/* ROI Image - Always visible */}
                        <div className='relative w-full aspect-square'>
                            <img 
                                src={roi} 
                                alt={`ROI ${areaLabel}`} 
                                className='w-full h-full object-cover'
                                onContextMenu={(e) => e.preventDefault()}
                                draggable={false}
                            />
                            
                            {/* Info Text Overlay */}
                            <div className='absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/50 to-transparent'>
                                <p className='text-white text-[10px] leading-tight drop-shadow-lg'>
                                    💡 Tahan untuk lihat area penilaian AI
                                </p>
                            </div>

                            {/* GradCAM Overlay - Revealed on hold */}
                            {gradcam && (
                                <div 
                                    className={`absolute inset-0 transition-all duration-500 ${
                                        isHolding 
                                            ? 'opacity-100 scale-100' 
                                            : 'opacity-0 scale-95 pointer-events-none'
                                    }`}
                                >
                                    <img 
                                        src={gradcam} 
                                        alt={`Grad-CAM ${areaLabel}`} 
                                        className='w-full h-full object-cover'
                                        onContextMenu={(e) => e.preventDefault()}
                                        draggable={false}
                                    />
                                    <div className='absolute top-3 left-3 px-3 py-1.5 bg-sky-500/90 backdrop-blur-sm rounded-full'>
                                        <span className='text-white text-xs font-semibold'>Area Penilaian AI</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <figcaption className='px-3 py-2 text-xs text-slate-600 bg-slate-50 border-t border-slate-200'>
                            {isHolding ? 'Grad-CAM' : `ROI — ${areaLabel}`}
                        </figcaption>
                    </figure>
                </div>
            </div>

            {/* Desktop: Hold to reveal GradCAM */}
            <div className='hidden md:flex gap-6 justify-center w-full px-8 lg:px-16'>
                <div className='w-1/2 max-w-2xl relative'>
                    <figure 
                        className='w-full rounded-xl overflow-hidden border border-slate-200 cursor-pointer hover:border-sky-400 transition-all select-none'
                        onMouseDown={handleHoldStart}
                        onMouseUp={handleHoldEnd}
                        onMouseLeave={handleHoldEnd}
                        onClick={() => handleClick(roi, `ROI ${areaLabel}`, 0)}
                    >
                        {/* ROI Image */}
                        <div className='relative w-full aspect-square'>
                            <img 
                                src={roi} 
                                alt={`ROI ${areaLabel}`} 
                                className='w-full h-full object-cover'
                                onContextMenu={(e) => e.preventDefault()}
                                draggable={false}
                            />
                            
                            {/* Info Text Overlay */}
                            <div className='absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/50 to-transparent'>
                                <p className='text-white text-[11px] leading-tight drop-shadow-lg'>
                                    💡 Tahan untuk lihat area penilaian AI
                                </p>
                            </div>

                            {/* GradCAM Overlay */}
                            {gradcam && (
                                <div 
                                    className={`absolute inset-0 transition-all duration-500 ${
                                        isHolding 
                                            ? 'opacity-100 scale-100' 
                                            : 'opacity-0 scale-95 pointer-events-none'
                                    }`}
                                >
                                    <img 
                                        src={gradcam} 
                                        alt={`Grad-CAM ${areaLabel}`} 
                                        className='w-full h-full object-cover'
                                        onContextMenu={(e) => e.preventDefault()}
                                        draggable={false}
                                    />
                                    <div className='absolute top-3 left-3 px-3 py-1.5 bg-sky-500/90 backdrop-blur-sm rounded-full'>
                                        <span className='text-white text-xs font-semibold'>Area Penilaian AI</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <figcaption className='px-3 py-2 text-xs text-slate-600 bg-slate-50 border-t border-slate-200'>
                            {isHolding ? 'Grad-CAM' : `ROI — ${areaLabel}`}
                        </figcaption>
                    </figure>
                </div>

                {gradcam && (
                    <div className='w-1/2 max-w-2xl'>
                        <figure 
                            className='w-full rounded-xl overflow-hidden border border-slate-200 cursor-pointer hover:border-sky-400 transition-all'
                            onClick={() => handleClick(gradcam, `Grad-CAM ${areaLabel}`, 1)}
                        >
                            <img 
                                src={gradcam} 
                                alt={`Grad-CAM ${areaLabel}`} 
                                className='w-full h-full object-cover aspect-square'
                                onContextMenu={(e) => e.preventDefault()}
                                draggable={false}
                            />
                            <figcaption className='px-3 py-2 text-xs text-slate-600 bg-slate-50 border-t border-slate-200'>
                                Grad-CAM
                            </figcaption>
                        </figure>
                    </div>
                )}
            </div>

            <ImageZoomModal
                src={zoomImage?.src ?? ''}
                alt={zoomImage?.alt ?? ''}
                isOpen={!!zoomImage}
                onClose={() => setZoomImage(null)}
                onNext={images.length > 1 ? handleNextImage : undefined}
                onPrev={images.length > 1 ? handlePrevImage : undefined}
                showNavigation={images.length > 1}
            />
        </>
    )
}
