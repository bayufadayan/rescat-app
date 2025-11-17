import React, { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import Header from '@/components/scan/capture/header';
import WarningBanner from '@/components/scan/capture/warning-banner';
import BottomBar from '@/components/scan/capture/bottom-bar';
import CameraStage from '@/components/scan/capture/camera-stage';
import { computeCropFromOverlay } from '@/lib/helper/compute-crop-from-overlay';
import WatermarkBackground from '@/components/scan/capture/watermark-bg';
import { useTorch } from '@/hooks/use-torch';
import { useRoute } from 'ziggy-js';
import { drawToSquareCanvas, canvasToBlob, compressWithBackoff } from '@/lib/helper/compress';
import { uploadToContent } from "@/lib/helper/content";
import { dataUrlToFile } from "@/lib/helper/dataUrlToFile";

export default function ScanCapture() {
    const route = useRoute();
    const webcamRef = useRef<Webcam | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<HTMLDivElement>(null);

    const [ready, setReady] = useState<boolean>(false);
    const [front, setFront] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [lastShot, setLastShot] = useState<string | null>(null);

    const { supported, torchOn, setTorch, refreshSupport } = useTorch(webcamRef);

    const handleMediaReady = (): void => {
        setReady(true);
        refreshSupport();
    };

    const handleCapture = useCallback(async (): Promise<void> => {
        const video: HTMLVideoElement | undefined = webcamRef.current?.video as HTMLVideoElement | undefined;
        const container = containerRef.current;
        const frame = frameRef.current;
        if (!video || !container || !frame) return;
        if (video.videoWidth === 0 || video.videoHeight === 0) return;

        const containerRect = container.getBoundingClientRect();
        const frameRect = frame.getBoundingClientRect();

        const { sx, sy, sw, sh } = computeCropFromOverlay({
            containerRect,
            frameRect,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight,
        });

        // Render area video → square 720
        const squareCanvas = drawToSquareCanvas(video, sx, sy, Math.round(sw), Math.round(sh), 720);

        // Blob awal (kualitas tinggi), lalu kompres ≤ 500KB
        const initialBlob = await canvasToBlob(squareCanvas, "image/jpeg", 0.92);
        const result = await compressWithBackoff(initialBlob, 500);

        // Preview utk UI (pakai URL server nanti, sementara tampilkan hasil lokal dulu)
        const previewDataUrl = result.dataUrl;
        setLastShot(previewDataUrl);

        const meta = {
            width: result.width,
            height: result.height,
            mime: result.mime,
            quality: result.quality,
            sizeBytes: result.sizeBytes,
            createdAt: new Date().toISOString(),
            source: "camera",
        };

        try {
            // siapkan File untuk upload (dari dataUrl hasil kompres)
            const filename = `shot-${Date.now()}.jpg`;
            const file = dataUrlToFile(previewDataUrl, filename, result.mime || "image/jpeg");

            // upload → storage.rescat.life (FormData: bucket dulu, lalu file)
            const uploaded = await uploadToContent(file, "original-photo");
            // uploaded: { id, bucket, filename, originalName, mime, size, createdAt, url }

            // simpan ke localStorage (ID & URL; tanpa base64)
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

            // gunakan URL server untuk preview (opsional, agar konsisten)
            setLastShot(uploaded.url);

            // lanjut ke halaman berikutnya
            window.location.href = route("scan.details");
        } catch (e) {
            console.error(e);
            alert("Gagal mengunggah gambar. Coba ulangi.");
        }
    }, [route]);

    const flipCamera = (): void => setFront((p) => !p);

    return (
        <div className="relative min-h-dvh h-dvh w-full bg-neutral-800">
            <div className="w-full h-full fixed z-0">
                <WatermarkBackground />
            </div>

            <div className="absolute left-0 right-0 top-0 z-20 flex w-full h-16 justify-center items-center">
                <Header
                    showFlashlight={supported}
                    isFlashlightOn={torchOn}
                    onToggleFlashlight={() => setTorch(!torchOn)}
                />
            </div>

            <div className="p-0 w-full h-screen">
                <CameraStage
                    webcamRef={webcamRef}
                    frameRef={frameRef}
                    containerRef={containerRef}
                    isReady={ready}
                    mirrored={front}
                    onUserMedia={handleMediaReady}
                    onUserMediaError={(e) => setError(typeof e === 'string' ? e : (e as Error)?.message ?? 'Camera error')}
                />
            </div>

            <WarningBanner>Pastikan wajah kucing terlihat pada kotak terang.</WarningBanner>

            <div className="absolute inset-x-0 bottom-6 z-20 flex w-full h-16 justify-center items-center">
                <BottomBar onCapture={handleCapture} onFlip={flipCamera} lastShot={lastShot} />
            </div>

            {error && (
                <div className="fixed inset-x-0 bottom-0 z-30 px-4 pb-24">
                    <div className="mx-auto w-full max-w-md rounded-xl border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-200">
                        {error}
                    </div>
                </div>
            )}
        </div>
    );
}
