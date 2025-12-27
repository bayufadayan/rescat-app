import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

type Props = {
    src: string;
    alt: string;
    isOpen: boolean;
    onClose: () => void;
    onNext?: () => void;
    onPrev?: () => void;
    showNavigation?: boolean;
};

export default function ImageZoomModal({ src, alt, isOpen, onClose, onNext, onPrev, showNavigation = false }: Props) {
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setScale(1);
            setPosition({ x: 0, y: 0 });
            setSlideDirection(null);
        }
    }, [isOpen]);

    useEffect(() => {
        if (slideDirection) {
            const timer = setTimeout(() => setSlideDirection(null), 300);
            return () => clearTimeout(timer);
        }
    }, [slideDirection]);

    const handleNext = () => {
        if (onNext) {
            setSlideDirection('left');
            setScale(1);
            setPosition({ x: 0, y: 0 });
            setTimeout(onNext, 150);
        }
    };

    const handlePrev = () => {
        if (onPrev) {
            setSlideDirection('right');
            setScale(1);
            setPosition({ x: 0, y: 0 });
            setTimeout(onPrev, 150);
        }
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setScale(prev => Math.max(1, Math.min(4, prev + delta)));
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            // Pinch zoom preparation
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            containerRef.current?.setAttribute('data-pinch-distance', distance.toString());
        } else if (e.touches.length === 1 && scale > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.touches[0].clientX - position.x,
                y: e.touches[0].clientY - position.y,
            });
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const distance = Math.hypot(
                touch2.clientX - touch1.clientX,
                touch2.clientY - touch1.clientY
            );
            const prevDistance = parseFloat(containerRef.current?.getAttribute('data-pinch-distance') || '0');
            if (prevDistance > 0) {
                const scaleDelta = (distance - prevDistance) / 200;
                setScale(prev => Math.max(1, Math.min(4, prev + scaleDelta)));
            }
            containerRef.current?.setAttribute('data-pinch-distance', distance.toString());
        } else if (isDragging && e.touches.length === 1 && scale > 1) {
            e.preventDefault();
            setPosition({
                x: e.touches[0].clientX - dragStart.x,
                y: e.touches[0].clientY - dragStart.y,
            });
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
        containerRef.current?.removeAttribute('data-pinch-distance');
        if (scale === 1) {
            setPosition({ x: 0, y: 0 });
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (scale > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && scale > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y,
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(src);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = alt.replace(/\s+/g, '_') + '.jpg';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            // Fallback: open in new tab
            window.open(src, '_blank');
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
                className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
            >
                <X className="w-6 h-6" />
            </button>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                }}
                className="absolute top-4 right-20 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                title="Download gambar"
            >
                <Download className="w-6 h-6" />
            </button>

            {/* Navigation Arrows */}
            {showNavigation && onPrev && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 hover:scale-110 rounded-full text-white transition-all backdrop-blur-sm"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>
            )}
            {showNavigation && onNext && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/10 hover:bg-white/20 hover:scale-110 rounded-full text-white transition-all backdrop-blur-sm"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
            )}

            <div
                ref={containerRef}
                className="relative w-full h-full flex items-center justify-center overflow-hidden touch-none"
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <img
                    src={src}
                    alt={alt}
                    className={`max-w-full max-h-full object-contain transition-all duration-300 select-none ${
                        slideDirection === 'left' ? 'animate-slide-out-left' : 
                        slideDirection === 'right' ? 'animate-slide-out-right' : 
                        'animate-slide-in'
                    }`}
                    style={{
                        transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                        cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
                    }}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm">
                Zoom: {(scale * 100).toFixed(0)}%
            </div>
        </div>
    );
}
