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

    const [captureBusy, setCaptureBusy] = useState(false);
    const [captureStep, setCaptureStep] = useState<"capture" | "upload">("capture");

    const { supported, torchOn, setTorch, refreshSupport } = useTorch(webcamRef);

    const handleMediaReady = (): void => {
        setReady(true);
        refreshSupport();
    };

    const handleCapture = useCallback(async (): Promise<void> => {
        if (captureBusy) return;

        const video: HTMLVideoElement | undefined = webcamRef.current?.video as HTMLVideoElement | undefined;
        const container = containerRef.current;
        const frame = frameRef.current;
        if (!video || !container || !frame) return;
        if (video.videoWidth === 0 || video.videoHeight === 0) return;

        try {
            setCaptureBusy(true);
            setCaptureStep("capture");

            const containerRect = container.getBoundingClientRect();
            const frameRect = frame.getBoundingClientRect();

            const { sx, sy, sw, sh } = computeCropFromOverlay({
                containerRect,
                frameRect,
                videoWidth: video.videoWidth,
                videoHeight: video.videoHeight,
            });

            const squareCanvas = drawToSquareCanvas(video, sx, sy, Math.round(sw), Math.round(sh), 720);
            const initialBlob = await canvasToBlob(squareCanvas, "image/jpeg", 0.92);
            const result = await compressWithBackoff(initialBlob, 500);

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

            setCaptureStep("upload");

            const filename = `shot-${Date.now()}.jpg`;
            const file = dataUrlToFile(previewDataUrl, filename, result.mime || "image/jpeg");

            const uploaded = await uploadToContent(file, "original-photo");

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

            setLastShot(uploaded.url);

            window.location.href = route("scan.details");
        } catch (e) {
            console.error(e);
            alert("Gagal mengunggah gambar. Coba ulangi.");
            setCaptureBusy(false);
        }
    }, [route, captureBusy]);

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

            <div className="relative p-0 w-full h-screen">
                <CameraStage
                    webcamRef={webcamRef}
                    frameRef={frameRef}
                    containerRef={containerRef}
                    isReady={ready}
                    mirrored={front}
                    onUserMedia={handleMediaReady}
                    onUserMediaError={(e) => setError(typeof e === 'string' ? e : (e as Error)?.message ?? 'Camera error')}
                />

                {captureBusy && (
                    <div className="absolute inset-0 z-30 grid place-items-center bg-black/35 backdrop-blur-[2px]">
                        <div className="w-[85%] max-w-sm rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-white shadow-lg">
                            <div className="flex items-center gap-3">
                                <span className="h-6 w-6 rounded-full border-2 border-white/70 border-t-transparent animate-spin" aria-hidden="true" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">
                                        {captureStep === "capture" ? "Sedang mengambil gambar" : "Sedang mengunggah foto"}
                                    </span>
                                    <span className="text-xs text-white/80">
                                        {captureStep === "capture"
                                            ? "Tahan posisi dan jangan bergerak..."
                                            : "Sebentar ya, sedang memproses..."}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <WarningBanner>Pastikan wajah kucing terlihat pada kotak terang.</WarningBanner>

            <div className="absolute inset-x-0 bottom-6 z-20 flex w-full h-16 justify-center items-center">
                <BottomBar onCapture={handleCapture} onFlip={flipCamera} lastShot={lastShot} capturing={captureBusy} />
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
