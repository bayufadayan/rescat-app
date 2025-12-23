/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/*=============== COMPONENT ===============*/
import MediaPreview from "@/components/scan/details/media-preview";
import BottomForm from "@/components/scan/details/bottom-form";
import SideForm from "@/components/scan/details/side-form";

/*=============== UTILS AND TYPES ===============*/
import { useIsMobile } from "@/hooks/use-mobile";
import { getCsrfToken, postWithRetry, humanizeError } from "@/lib/helper/upload";
import { reverseGeocode } from "@/lib/helper/reverse-geocode";
import type { Coords, GeoStatus, Address } from "@/types/geo";
import type { CatApiResponse } from "@/types/scan";

/*=============== THIRD PARTY ===============*/
import { useRoute } from "ziggy-js";

/*=============== GLOBAL STATE ===============*/
type Phase = "idle" | "uploading" | "analyzing" | "success" | "fail";

type StoredOriginal = {
    id: string;
    url: string;
    bucket?: string;
    filename?: string;
    mime?: string;
    size?: number;
    createdAt?: number;
};

export default function ScanDetails() {
    const route = useRoute();
    const isMobile = useIsMobile();

    const toRelativeUrl = useCallback((url: string) => {
        if (!url) return url;
        try {
            const base = typeof window !== 'undefined' ? window.location.origin : undefined;
            const parsed = new URL(url, base);
            return `${parsed.pathname}${parsed.search}`;
        } catch {
            return url;
        }
    }, []);

    const [open, setOpen] = useState(true);
    const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");
    const [coords, setCoords] = useState<Coords | null>(null);
    const [addr, setAddr] = useState<Address | null>(null);
    const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
    const [phase, setPhase] = useState<Phase>("idle");
    const [errorMsg, setErrorMsg] = useState<string>("");

    const askLocation = async () => {
        setGeoStatus("locating");
        setAddr(null);
        try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 12000,
                    maximumAge: 0,
                });
            });

            const c = { lat: pos.coords.latitude, lon: pos.coords.longitude };
            setCoords(c);

            const a = await reverseGeocode(c);
            setAddr(a);

            setGeoStatus("ready");
            setUpdatedAt(new Date());
        } catch (e) {
            console.error(e);
            setGeoStatus("error");
        }
    };

    const clearLocation = () => {
        setCoords(null);
        setAddr(null);
        setUpdatedAt(null);
        setGeoStatus("idle");
    };

    useEffect(() => {
        askLocation();
    }, []);

    /** Guard: pastikan ada original (localStorage) atau sudah ada result (sessionStorage) */
    useEffect(() => {
        const hasOriginal = !!localStorage.getItem("scan:original");
        const hasResult = !!sessionStorage.getItem("scan:result");
        if (!hasOriginal && !hasResult) {
            window.location.href = toRelativeUrl(route("scan.capture"));
        }
    }, [route, toRelativeUrl]);

    const analyzeUrl = useMemo(() => toRelativeUrl(route("scan.analyze")), [route, toRelativeUrl]);
    const timeoutMs = useMemo(
        () => Number((import.meta as any).env?.VITE_SCAN_TIMEOUT_MS ?? 5000),
        []
    );

    /**
     * Ambil file dari URL storage → kirim ke analyze API (FormData "file")
     * Catatan: pastikan CORS di storage.rescat.life sudah mengizinkan fetch dari domain FE.
     */
    const analyzeOnce = useCallback(async () => {
        try {
            const raw = localStorage.getItem("scan:original");
            if (!raw) return;

            const original = JSON.parse(raw) as StoredOriginal;

            // Validasi ukuran jika tersedia dari storage metadata
            if (typeof original.size === "number" && original.size > 512 * 1024) {
                setPhase("fail");
                setErrorMsg("Ukuran gambar melebihi 512KB.");
                return;
            }

            setPhase("uploading");

            // Ambil blob dari URL (file yang sudah di-upload ke content service)
            const fetched = await fetch(original.url, { cache: "no-store" });
            if (!fetched.ok) {
                setPhase("fail");
                setErrorMsg("Gagal mengambil gambar dari storage.");
                return;
            }
            const blob = await fetched.blob();

            // Safety check kedua
            if (blob.size > 512 * 1024) {
                setPhase("fail");
                setErrorMsg("Ukuran gambar melebihi 512KB (dari storage).");
                return;
            }

            const fileName = original.filename ?? "capture.jpg";
            const fileType = blob.type || original.mime || "image/jpeg";

            const form = new FormData();
            form.append("file", new File([blob], fileName, { type: fileType }));

            setPhase("analyzing");
            const csrf = getCsrfToken();
            const res = await postWithRetry(
                analyzeUrl,
                form,
                csrf ? { "X-CSRF-TOKEN": csrf } : undefined,
                timeoutMs
            );

            let data: CatApiResponse | any;
            try {
                data = await res.json();
            } catch {
                setPhase("fail");
                setErrorMsg("Respons tidak valid dari server.");
                return;
            }

            if (!res.ok || (data as any)?.ok === false) {
                setPhase("fail");
                setErrorMsg(humanizeError((data as any)?.code, res.status));
                return;
            }

            setPhase("success");
            sessionStorage.setItem("scan:result", JSON.stringify(data));

            try {
                const faces = (data as any)?.faces || {};

                const bbId = faces.preview_id ?? faces.preview?.id ?? null;
                const bbUrl = faces.preview_url ?? faces.preview?.url ?? null;
                if (bbId || bbUrl) {
                    localStorage.setItem("scan:bounding-box", JSON.stringify({ id: bbId, url: bbUrl }));
                }

                const roiId = faces.roi_id ?? faces.roi?.id ?? null;
                const roiUrl = faces.roi_url ?? faces.roi?.url ?? null;
                if (roiId || roiUrl) {
                    localStorage.setItem("scan:roi", JSON.stringify({ id: roiId, url: roiUrl }));
                }
            } catch { /* noop */ }

            const rid = res.headers.get("X-Request-ID");
            if (rid) sessionStorage.setItem("scan:rid", rid);
        } catch (e: any) {
            console.error("analyzeOnce error:", e);
            setPhase("fail");
            setErrorMsg(
                e?.name === "AbortError"
                    ? "Timeout koneksi."
                    : e?.message ?? "Terjadi kesalahan."
            );
        }
    }, [analyzeUrl, timeoutMs]);

    /** Auto-run sekali pada mount bila ada original */
    const autoSentRef = useRef(false);
    useEffect(() => {
        if (autoSentRef.current) return;
        const hasOriginal = !!localStorage.getItem("scan:original");
        if (hasOriginal) {
            autoSentRef.current = true;
            void analyzeOnce();
        }
    }, [analyzeOnce]);

    /** Listen retry */
    useEffect(() => {
        const handler = () => analyzeOnce();
        window.addEventListener("scan:retry", handler);
        return () => window.removeEventListener("scan:retry", handler);
    }, [analyzeOnce]);

    return (
        <div className="min-h-dvh w-full bg-[#0da0ff] text-slate-900 flex justify-center relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="20" cy="20" r="1.5" fill="white" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-transparent to-cyan-500/20" />

            <div className="w-full justify-between min-h-dvh relative z-10">
                <div className="flex w-full h-full flex-col justify-center items-center lg:flex-row lg:items-start lg:justify-center px-4 pt-16 lg:px-0 lg:pt-0">
                    {/* Left / main visual */}
                    <div className="flex-1 w-full lg:h-screen lg:overflow-y-auto flex items-start justify-center">
                        <div className="w-full lg:px-6 lg:py-8">
                            <MediaPreview phase={phase} errorMsg={errorMsg} />
                        </div>
                    </div>

                    {isMobile && (
                        <div className="flex flex-1 px-0">
                            <BottomForm
                                open={open}
                                setOpen={setOpen}
                                status={geoStatus}
                                coords={coords}
                                address={addr}
                                updatedAt={updatedAt}
                                refreshLocation={askLocation}
                                clearLocation={clearLocation}
                                phase={phase}
                            />
                        </div>
                    )}

                    {!isMobile && (
                        <div className="hidden md:flex justify-end items-start h-screen sticky top-0">
                            <SideForm
                                status={geoStatus}
                                coords={coords}
                                address={addr}
                                updatedAt={updatedAt}
                                refreshLocation={askLocation}
                                clearLocation={clearLocation}
                                phase={phase}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
