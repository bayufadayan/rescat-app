import React, { useEffect, useRef, useState } from 'react';
import { useRoute } from 'ziggy-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

type BottomBarProps = {
    onCapture: () => void;
    onFlip: () => void;
    lastShot: string | null;
    capturing: boolean;
};

export default function BottomBar({ onCapture, onFlip, lastShot, capturing }: BottomBarProps) {
    const route = useRoute();
    const fileRef = useRef<HTMLInputElement | null>(null);

    const [flash, setFlash] = useState(false);
    const [shake, setShake] = useState(false);
    const [flipAnim, setFlipAnim] = useState(false);
    const [justCaptured, setJustCaptured] = useState(false);
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [actualSize, setActualSize] = useState({ width: 0, height: 0 });
    const [galleryLoading, setGalleryLoading] = useState(false);

    const openFile = () => {
        if (navigator.vibrate) navigator.vibrate(8);
        fileRef.current?.click();
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;

        setGalleryLoading(true);
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const minSize = 700;
                if (Math.max(img.width, img.height) < minSize) {
                    setActualSize({ width: img.width, height: img.height });
                    setShowSizeModal(true);
                    setGalleryLoading(false);
                    return;
                }
                try {
                    sessionStorage.setItem('scan:toCrop', String(reader.result));
                } catch { /* Error State */}
                window.location.href = route('scan.crop');
            };
            img.onerror = () => setGalleryLoading(false);
            img.src = String(reader.result);
        };
        reader.onerror = () => setGalleryLoading(false);
        reader.readAsDataURL(f);
    };

    const handleFlipClick = () => {
        if (navigator.vibrate) navigator.vibrate(10);
        setFlipAnim(true);
        onFlip();
        window.setTimeout(() => setFlipAnim(false), 520);
    };

    const handleCaptureClick = () => {
        if (capturing) return;

        if (navigator.vibrate) navigator.vibrate([18, 10, 18]);
        setShake(true);
        window.setTimeout(() => setShake(false), 260);

        setFlash(true);
        window.setTimeout(() => setFlash(false), 140);

        onCapture();
    };

    useEffect(() => {
        if (!lastShot) return;
        if (!capturing) return;

        setJustCaptured(true);
        if (navigator.vibrate) navigator.vibrate(12);

        const t = window.setTimeout(() => setJustCaptured(false), 650);
        return () => window.clearTimeout(t);
    }, [lastShot, capturing]);

    return (
        <>
            <style>{`
        @keyframes rescat-shake {
          0% { transform: translate3d(0,0,0); }
          20% { transform: translate3d(-1.5px, 0, 0); }
          40% { transform: translate3d(1.5px, 0, 0); }
          60% { transform: translate3d(-1px, 0, 0); }
          80% { transform: translate3d(1px, 0, 0); }
          100% { transform: translate3d(0,0,0); }
        }
      `}</style>

            <div className="pointer-events-auto w-full z-20 flex items-center justify-between gap-8 md:gap-16 px-6 max-w-md">
                <div className="h-12 w-12 overflow-hidden rounded-lg">
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                    <button
                        type="button"
                        onClick={openFile}
                        disabled={galleryLoading}
                        className={[
                            "group relative grid h-12 w-12 place-items-center rounded-xl",
                            "bg-white/10 border border-white/20 backdrop-blur-sm",
                            "transition-all duration-200 ease-out",
                            "hover:bg-white/15 hover:border-white/30",
                            "active:scale-[0.94] active:translate-y-[1px]",
                            galleryLoading ? "opacity-50 cursor-not-allowed" : "",
                        ].join(" ")}
                        aria-label="Buka galeri"
                    >
                        <span
                            className="pointer-events-none absolute -inset-[1px] rounded-xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-60"
                            style={{
                                background: "radial-gradient(70% 70% at 50% 0%, rgba(255,255,255,0.35), transparent 60%)",
                            }}
                            aria-hidden
                        />
                        {galleryLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                        ) : (
                            <img src="/images/icon/gallery-icon.svg" alt="gallery-icon" className="relative" />
                        )}
                    </button>
                </div>

                <button
                    type="button"
                    aria-label="Ambil Gambar"
                    onClick={handleCaptureClick}
                    disabled={capturing}
                    className={[
                        "relative grid h-22 w-22 place-items-center rounded-full",
                        "bg-[#2C2C2C] p-2 border-4 border-[#7B7B7B] shadow-lg",
                        "transition-all duration-200 ease-out",
                        "active:scale-[0.96] active:translate-y-[1px]",
                        capturing ? "cursor-wait opacity-95" : "hover:shadow-xl",
                    ].join(" ")}
                    style={shake ? { animation: "rescat-shake 260ms ease-in-out 1" } : undefined}
                >
                    <span
                        className={[
                            "pointer-events-none absolute inset-0 rounded-full bg-white transition-opacity duration-150",
                            flash ? "opacity-25" : "opacity-0",
                        ].join(" ")}
                        aria-hidden
                    />

                    <figure className="relative w-full h-full aspect-square bg-transparent rounded-full overflow-hidden grid place-items-center">
                        {capturing ? (
                            <span className="grid place-items-center">
                                <span className="h-6 w-6 rounded-full border-2 border-white/60 border-t-transparent animate-spin" aria-hidden="true" />
                            </span>
                        ) : justCaptured ? (
                            <span className="text-white text-xl leading-none" aria-hidden="true">✓</span>
                        ) : (
                            <img
                                src="/images/icon/shutter-icon.svg"
                                alt="shutter-icon"
                                className="w-full h-full object-cover"
                            />
                        )}
                    </figure>
                </button>

                <button
                    type="button"
                    className={[
                        "group relative flex h-12 w-12 items-center justify-center rounded-xl",
                        "bg-white/10 border border-white/20 backdrop-blur-sm",
                        "transition-all duration-200 ease-out",
                        "hover:bg-white/15 hover:border-white/30",
                        "active:scale-[0.94] active:translate-y-[1px]",
                    ].join(" ")}
                    title="Rotate Camera"
                    onClick={handleFlipClick}
                    aria-label="Ganti kamera"
                >
                    <span
                        className="pointer-events-none absolute -inset-[1px] rounded-xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-60"
                        style={{
                            background: "radial-gradient(70% 70% at 50% 0%, rgba(168,85,247,0.35), transparent 60%)",
                        }}
                        aria-hidden
                    />
                    <img
                        src="/images/icon/rotate-camera-icon.svg"
                        alt="rotate-camera-icon"
                        className={[
                            "relative transition-transform duration-500 ease-in-out",
                            flipAnim ? "rotate-[180deg]" : "rotate-0",
                        ].join(" ")}
                    />
                </button>
            </div>
            {/* Size validation modal */}
            <Dialog open={showSizeModal} onOpenChange={setShowSizeModal}>
                <DialogContent className="bg-neutral-900 border-white/20 text-white max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">Ukuran Gambar Terlalu Kecil</DialogTitle>
                        <DialogDescription className="text-white/70 text-sm mt-2">
                            Gambar yang dipilih memiliki resolusi {actualSize.width} × {actualSize.height}px.
                            <br /><br />
                            Minimal resolusi yang dibutuhkan adalah <span className="font-semibold text-cyan-400">700px</span> pada salah satu sisi untuk hasil scan yang optimal.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            onClick={() => setShowSizeModal(false)}
                            className="w-full h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
                        >
                            Mengerti
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>        </>
    );
}
