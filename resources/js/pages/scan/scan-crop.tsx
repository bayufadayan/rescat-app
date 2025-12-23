/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { useRoute } from "ziggy-js";
import { drawToSquareCanvas, canvasToBlob, compressWithBackoff } from "@/lib/helper/compress";
import { uploadToContent } from "@/lib/helper/content";
import { dataUrlToFile } from "@/lib/helper/dataUrlToFile";
import { ZoomIn, ZoomOut, RotateCcw, Check, X, ImageIcon, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

type Area = { x: number; y: number; width: number; height: number };

export default function ScanCrop() {
    const route = useRoute();
    const [src, setSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [area, setArea] = useState<Area | null>(null);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState<string>("");
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [actualSize, setActualSize] = useState({ width: 0, height: 0 });
    const [backLoading, setBackLoading] = useState(false);
    const [changeLoading, setChangeLoading] = useState(false);
    const fileRef = React.useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        try {
            const v = sessionStorage.getItem("scan:toCrop");
            if (v) setSrc(v);
        } catch {
            /* ignore */
        }
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;

        setChangeLoading(true);
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const minSize = 700;
                if (Math.max(img.width, img.height) < minSize) {
                    setActualSize({ width: img.width, height: img.height });
                    setShowSizeModal(true);
                    setChangeLoading(false);
                    return;
                }
                try {
                    sessionStorage.setItem('scan:toCrop', String(reader.result));
                    setSrc(String(reader.result));
                    setChangeLoading(false);
                } catch { 
                    setChangeLoading(false);
                }
            };
            img.onerror = () => setChangeLoading(false);
            img.src = String(reader.result);
        };
        reader.onerror = () => setChangeLoading(false);
        reader.readAsDataURL(f);
    };

    const handleBack = () => {
        setBackLoading(true);
        setTimeout(() => {
            window.history.back();
        }, 150);
    };

    const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
        setArea(croppedAreaPixels);
    }, []);

    const doCrop = useCallback(async () => {
        if (!src || !area || busy) return;
        setErr("");
        setBusy(true);
        try {
            // Load image
            const image = await new Promise<HTMLImageElement>((resolve, reject) => {
                const i = new Image();
                i.onload = () => resolve(i);
                i.onerror = reject;
                i.src = src;
            });

            // Render hasil crop → square 1000px (jika > 1000px)
            const targetSize = Math.max(image.width, image.height) > 1000 ? 1000 : Math.max(image.width, image.height);
            const squareCanvas = drawToSquareCanvas(
                image,
                area.x,
                area.y,
                area.width,
                area.height,
                targetSize
            );

            // Blob awal, lalu kompres ≤ 500KB
            const initialBlob = await canvasToBlob(squareCanvas, "image/jpeg", 0.92);
            const result = await compressWithBackoff(initialBlob, 500);

            const previewDataUrl = result.dataUrl;
            const meta = {
                width: result.width,
                height: result.height,
                mime: result.mime,
                quality: result.quality,
                sizeBytes: result.sizeBytes,
                createdAt: new Date().toISOString(),
                source: "gallery-crop",
            };

            // Siapkan File dari dataURL hasil kompres
            const filename = `shot-crop-${Date.now()}.jpg`;
            const file = dataUrlToFile(previewDataUrl, filename, result.mime || "image/jpeg");

            // Upload ke content service (FormData: bucket → file)
            const uploaded = await uploadToContent(file, "original-photo");
            // uploaded: { id, bucket, filename, originalName, mime, size, createdAt, url }

            // Simpan ke localStorage (ID & URL) + meta (tanpa base64)
            localStorage.setItem(
                "scan:original",
                JSON.stringify({
                    id: uploaded.id,
                    url: uploaded.url,
                    bucket: uploaded.bucket,
                    filename: uploaded.filename,
                    mime: uploaded.mime,
                    size: uploaded.size,
                    createdAt: uploaded.createdAt,
                })
            );
            localStorage.setItem("scan:meta", JSON.stringify(meta));

            // Bersihkan session lama
            sessionStorage.removeItem("scan:toCrop");

            // Lanjut ke details
            window.location.href = route("scan.details");
        } catch (e: any) {
            console.error(e);
            setErr(e?.message || "Gagal memproses/unggah gambar.");
            setBusy(false);
        }
    }, [src, area, busy, route]);

    const content = useMemo(() => {
        if (!src) {
            return (
                <div className="relative w-full h-[70vh] bg-gradient-to-b from-neutral-950 to-neutral-900 rounded-2xl overflow-hidden border border-white/10 flex flex-col items-center justify-center gap-6">
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-6 rounded-full bg-white/5 border border-white/10">
                            <ImageIcon className="h-16 w-16 text-white/40" />
                        </div>
                        <div className="text-center">
                            <p className="text-white/60 text-sm">Tidak ada gambar untuk di-crop</p>
                            <p className="text-white/40 text-xs mt-1">Pilih foto dari galeri atau kembali</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => window.history.back()}
                            variant="outline"
                            className="h-10 px-6 rounded-lg border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali
                        </Button>
                        <Button
                            onClick={() => fileRef.current?.click()}
                            className="h-10 px-6 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
                        >
                            <ImageIcon className="h-4 w-4" />
                            Pilih Foto
                        </Button>
                    </div>
                </div>
            );
        }
        return (
            <div className="relative w-full h-[70vh] bg-gradient-to-b from-neutral-950 to-neutral-900 rounded-2xl overflow-hidden border border-white/10">
                <Cropper
                    image={src}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                    showGrid={true}
                    restrictPosition={true}
                    cropShape="rect"
                    style={{
                        containerStyle: {
                            background: 'transparent',
                        },
                        cropAreaStyle: {
                            border: '2px solid rgba(34, 211, 238, 0.8)',
                            boxShadow: '0 0 20px rgba(34, 211, 238, 0.4), inset 0 0 20px rgba(34, 211, 238, 0.1)',
                        },
                    }}
                />
                
                {/* Zoom indicator */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-sm font-medium text-white/90">
                    {Math.round(zoom * 100)}%
                </div>

                {/* Grid overlay hint */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-xs text-white/70">
                    Geser & pinch untuk sesuaikan
                </div>
            </div>
        );
    }, [src, crop, zoom, onCropComplete]);

    return (
        <div className="min-h-dvh w-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white flex flex-col">
            {/* Header */}
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Sesuaikan Crop
                </h1>
                <p className="text-sm text-white/60 mt-1">Pastikan objek berada di dalam area crop</p>
            </div>

            {/* Crop area */}
            <div className="flex-1 px-4">{content}</div>

            {/* Zoom controls */}
            <div className="px-6 py-4 flex items-center justify-center gap-4">
                <Button
                    onClick={() => setZoom(Math.max(1, zoom - 0.1))}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-white/5 border-white/20 hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-200"
                    disabled={busy || zoom <= 1}
                >
                    <ZoomOut className="h-5 w-5" />
                </Button>

                <div className="flex-1 max-w-md relative">
                    <input
                        type="range"
                        min={1}
                        max={3}
                        step={0.01}
                        value={zoom}
                        onChange={(e) => setZoom(parseFloat(e.target.value))}
                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r 
                            [&::-webkit-slider-thumb]:from-cyan-400 [&::-webkit-slider-thumb]:to-blue-500 
                            [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-cyan-500/50
                            [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform
                            [&::-webkit-slider-thumb]:hover:scale-110
                            [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full 
                            [&::-moz-range-thumb]:bg-gradient-to-r [&::-moz-range-thumb]:from-cyan-400 
                            [&::-moz-range-thumb]:to-blue-500 [&::-moz-range-thumb]:border-0
                            [&::-moz-range-thumb]:shadow-lg [&::-moz-range-thumb]:shadow-cyan-500/50
                            [&::-moz-range-thumb]:cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, rgba(34, 211, 238, 0.3) 0%, rgba(34, 211, 238, 0.3) ${((zoom - 1) / 2) * 100}%, rgba(255, 255, 255, 0.1) ${((zoom - 1) / 2) * 100}%, rgba(255, 255, 255, 0.1) 100%)`
                        }}
                    />
                </div>

                <Button
                    onClick={() => setZoom(Math.min(3, zoom + 0.1))}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-white/5 border-white/20 hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-200"
                    disabled={busy || zoom >= 3}
                >
                    <ZoomIn className="h-5 w-5" />
                </Button>

                <Button
                    onClick={() => {
                        setZoom(1);
                        setCrop({ x: 0, y: 0 });
                    }}
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-white/5 border-white/20 hover:bg-white/10 hover:border-amber-500/50 transition-all duration-200"
                    disabled={busy}
                    title="Reset zoom & posisi"
                >
                    <RotateCcw className="h-5 w-5" />
                </Button>
            </div>

            {/* Error message */}
            {err && (
                <div className="px-4 pb-2 text-center">
                    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg text-sm">
                        {err}
                    </div>
                </div>
            )}

            {/* Action buttons */}
            <div className="p-6 flex items-center justify-center gap-3">
                <Button
                    onClick={handleBack}
                    variant="outline"
                    className="h-10 px-6 rounded-lg border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-200 cursor-pointer"
                    disabled={busy || backLoading}
                >
                    {backLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                    ) : (
                        <>
                            <X className="h-4 w-4" />
                            Batal
                        </>
                    )}
                </Button>
                {src && (
                    <Button
                        onClick={() => fileRef.current?.click()}
                        variant="outline"
                        className="h-10 px-6 rounded-lg border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all duration-200 cursor-pointer"
                        disabled={busy || changeLoading}
                    >
                        {changeLoading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                        ) : (
                            <>
                                <ImageIcon className="h-4 w-4" />
                                Ganti
                            </>
                        )}
                    </Button>
                )}
                <Button 
                    onClick={doCrop} 
                    className="h-10 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    disabled={busy}
                >
                    {busy ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                            Memproses...
                        </>
                    ) : (
                        <>
                            <Check className="h-4 w-4" />
                            Pakai Foto
                        </>
                    )}
                </Button>
            </div>

            {/* Hidden file input */}
            <input 
                ref={fileRef} 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileSelect} 
            />

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
            </Dialog>
        </div>
    );
}
