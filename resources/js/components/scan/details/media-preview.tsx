/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Check, X, AlertTriangle, Info, Loader2 } from "lucide-react";
import type { CatApiResponse, CatApiSuccessV1 } from "@/types/scan";

type Phase = "idle" | "uploading" | "analyzing" | "success" | "fail";
type Props = { phase?: Phase; errorMsg?: string };

type StoredOriginal = {
    id: string;
    url: string;
    bucket?: string;
    filename?: string;
    mime?: string;
    size?: number;
    createdAt?: number;
};

type StoredMeta = {
    width: number;
    height: number;
    mime: string;
    quality: number;
    sizeBytes: number;
    createdAt: string;
    source: string;
};

export default function MediaPreview({ phase = "idle", errorMsg = "" }: Props) {
    const [hero, setHero] = useState<string | null>(null);
    const [boundingBoxUrl, setBoundingBoxUrl] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [meta, setMeta] = useState<StoredMeta | null>(null);
    const [result, setResult] = useState<CatApiResponse | null>(null);
    const [summaryVisible, setSummaryVisible] = useState(false);

    useEffect(() => {
        try {
            // BACA dari localStorage (baru)
            const o = localStorage.getItem("scan:original");
            if (o) {
                const parsed = JSON.parse(o) as StoredOriginal;
                if (parsed?.url) setHero(parsed.url);
            }

            const m = localStorage.getItem("scan:meta");
            if (m) setMeta(JSON.parse(m) as StoredMeta);

            // Ambil bounding box URL jika ada
            const bb = localStorage.getItem("scan:bounding-box");
            if (bb) {
                const parsed = JSON.parse(bb);
                if (parsed?.url) setBoundingBoxUrl(parsed.url);
            }

            // Result tetap di sessionStorage (seperti alur lama)
            const r = sessionStorage.getItem("scan:result");
            if (r) setResult(JSON.parse(r));
        } catch {
            //
        }
    }, [phase]);

    // Auto slide ke bounding box saat sukses
    useEffect(() => {
        if (phase === "success" && boundingBoxUrl) {
            setCurrentImageIndex(1);
        }
    }, [phase, boundingBoxUrl]);

    const okRes: CatApiSuccessV1 | null =
        result && (result as any).ok === true ? (result as CatApiSuccessV1) : null;

    const verdict = useMemo(() => {
        if (phase === "uploading" || phase === "analyzing") return "loading" as const;
        if (phase === "fail") return "fail" as const;
        if (okRes) return okRes.can_proceed ? ("cat" as const) : ("noncat" as const);
        return "idle" as const;
    }, [phase, okRes]);

    function formatBytes(bytes: number) {
        if (!Number.isFinite(bytes) || bytes <= 0) return "–";
        const units = ["B", "KB", "MB", "GB"];
        let i = 0,
            val = bytes;
        while (val >= 1024 && i < units.length - 1) {
            val /= 1024;
            i++;
        }
        const fixed = i === 0 ? 0 : val < 10 ? 2 : 1;
        return `${val.toFixed(fixed)} ${units[i]}`;
    }

    const [requestId, setRequestId] = useState("");
    useEffect(() => {
        if (typeof window !== "undefined")
            setRequestId(sessionStorage.getItem("scan:rid") ?? "");
    }, [phase]);

    const isAnalyzing = phase === "uploading" || phase === "analyzing";

    const images = useMemo(() => {
        const imgs: string[] = [];
        if (hero) imgs.push(hero);
        if (boundingBoxUrl && phase === "success") imgs.push(boundingBoxUrl);
        return imgs;
    }, [hero, boundingBoxUrl, phase]);

    const hasMultipleImages = images.length > 1;

    return (
        <div className="w-full md:max-w-2xl max-w-full py-4 lg:py-0 relative flex flex-col lg:mt-10">
            {/* VERDICT OVERLAY */}
            <div
                className="h-20 w-20 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full z-20 shrink-0 grow-0 border-8 border-white transition-all grid place-items-center duration-300"
                style={{
                    top: "0",
                    background:
                        verdict === "cat"
                            ? "#16a34a"
                            : verdict === "noncat" || verdict === "fail"
                                ? "#ef4444"
                                : verdict === "loading"
                                    ? "rgba(0,0,0,0.55)"
                                    : "rgba(239,68,68,1)",
                }}
                aria-live="polite"
            >
                {verdict === "loading" && (
                    <Loader2 className="h-10 w-10 text-white animate-spin" strokeWidth={2.5} />
                )}
                {verdict === "cat" && <Check className="text-white size-12 animate-in fade-in zoom-in duration-300" strokeWidth={3} />}
                {(verdict === "noncat" || verdict === "fail" || verdict === "idle") && (
                    <X className="text-white size-12 animate-in fade-in zoom-in duration-300" strokeWidth={3} />
                )}
            </div>

            {/* IMAGE CARD WITH SLIDER */}
            <div className="w-full aspect-square bg-white border-8 border-white rounded-3xl overflow-hidden p-1 mx-auto max-w-[350px] md:max-w-[420px] shadow-xl">
                <div className="relative w-full h-full overflow-hidden rounded-2xl bg-neutral-200">
                    {/* Image Slider Container */}
                    <div className="relative w-full h-full overflow-hidden">
                        <div 
                            className="flex h-full transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                        >
                            {images.map((img, idx) => (
                                <div key={idx} className="min-w-full h-full flex-shrink-0">
                                    <img 
                                        src={img} 
                                        alt={idx === 0 ? "Original" : "Bounding Box"} 
                                        className="h-full w-full object-contain" 
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    {hasMultipleImages && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 rounded-full px-3 py-1.5 backdrop-blur-sm">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        idx === currentImageIndex 
                                            ? 'w-6 bg-white' 
                                            : 'w-2 bg-white/50 hover:bg-white/70'
                                    }`}
                                    aria-label={`View ${idx === 0 ? 'original' : 'bounding box'} image`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Image Label */}
                    {hasMultipleImages && (
                        <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                            {currentImageIndex === 0 ? 'Original' : 'Bounding Box'}
                        </div>
                    )}

                    <button
                        type="button"
                        className={`absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-lg shadow-md transition-all ${isAnalyzing ? "bg-black/20 cursor-not-allowed" : "bg-black/50 hover:bg-black/70"
                            }`}
                        title={isAnalyzing ? "Analyzing..." : "Retry"}
                        onClick={async () => {
                            if (isAnalyzing) return;

                            try {
                                // --- ambil id dari localStorage
                                const ids: string[] = [];

                                const original = localStorage.getItem("scan:original");
                                if (original) {
                                    const o = JSON.parse(original);
                                    if (o?.id) ids.push(o.id);
                                }

                                const roi = localStorage.getItem("scan:roi");
                                if (roi) {
                                    const r = JSON.parse(roi);
                                    if (r?.id) ids.push(r.id);
                                }

                                const bb = localStorage.getItem("scan:bounding-box");
                                if (bb) {
                                    const b = JSON.parse(bb);
                                    if (b?.id) ids.push(b.id);
                                }

                                // --- kirim DELETE request kalau ada ID
                                if (ids.length > 0) {
                                    await fetch("https://storage.rescat.life/api/files/selected", {
                                        method: "DELETE",
                                        headers: {
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({ ids }),
                                    }).catch((e) => console.warn("Delete error:", e));
                                }

                                // --- bersihkan local/session storage
                                localStorage.removeItem("scan:original");
                                localStorage.removeItem("scan:meta");
                                localStorage.removeItem("scan:bounding-box");
                                localStorage.removeItem("scan:roi");
                                sessionStorage.removeItem("scan:result");
                                sessionStorage.removeItem("scan:rid");
                            } catch (e) {
                                console.error("Retry cleanup error:", e);
                            }

                            // --- kembali ke halaman sebelumnya
                            window.history.back();
                        }}
                    >
                        <figure>
                            <img
                                src="/images/icon/camera-rollback-icon.svg"
                                alt="camera-rollback-icon.svg"
                            />
                        </figure>
                    </button>
                </div>
                {meta && (
                    <div className="px-3 py-1 mt-2 mx-auto w-fit rounded-full bg-white text-slate-700 text-xs shadow">
                        {`${formatBytes(meta.sizeBytes)} • ${meta.mime?.toUpperCase?.() || "JPEG"} q${meta.quality?.toFixed ? meta.quality.toFixed(1) : "?"
                            } • ${meta.width}×${meta.height}`}
                    </div>
                )}
            </div>

            {/* STATUS */}
            <div className="mt-3 flex w-full justify-center">
                {isAnalyzing ? (
                    <div className="flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm text-slate-700 shadow-md backdrop-blur-sm animate-pulse">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="font-medium">
                            {phase === "uploading" ? "Uploading..." : "Analyzing..."}
                        </span>
                    </div>
                ) : null}

                {okRes && (
                    <div
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300 ${okRes.can_proceed ? "bg-white text-green-700" : "bg-white text-red-700"
                            }`}
                    >
                        {okRes.can_proceed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        <span className="font-medium">
                            Terdeteksi {okRes.faces?.faces_count ?? 0} wajah kucing{okRes.faces?.faces_count === 1 ? "" : ""}
                        </span>
                    </div>
                )}

                {!okRes && phase === "fail" && (
                    <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-red-700 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-medium">Failed to analyze{errorMsg ? ` — ${errorMsg}` : ""}</span>
                        <button
                            type="button"
                            className="ml-1 rounded-md px-3 py-1 text-xs bg-red-50 border border-red-200 hover:bg-red-100 transition-colors"
                            onClick={() => window.dispatchEvent(new CustomEvent("scan:retry"))}
                        >
                            Retry
                        </button>
                    </div>
                )}
            </div>

            {requestId && (
                <div className="mt-1 text-[10px] text-white/80 text-center">rid: {requestId}</div>
            )}

            {/* RESULT SUMMARY - Toggle dengan chevron */}
            {okRes && (
                <div 
                    className="mt-6 w-full max-w-xl mx-auto overflow-hidden transition-all duration-500 ease-in-out"
                    style={{
                        maxHeight: summaryVisible ? '1000px' : '0px',
                        opacity: summaryVisible ? 1 : 0,
                    }}
                >
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Info className="h-5 w-5 text-blue-600" />
                                </div>
                                <span className="font-semibold text-slate-800">Face Detection Summary</span>
                            </div>
                        
                        <div className="text-sm text-slate-700 space-y-2">
                                <div className="flex justify-between py-1">
                                    <span className="font-medium text-slate-600">Faces Count:</span>
                                    <span className="font-semibold">{okRes.faces?.faces_count ?? 0}</span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="font-medium text-slate-600">Chosen Confidence:</span>
                                    <span className="font-semibold">
                                        {typeof okRes.faces?.chosen_conf === "number"
                                            ? okRes.faces?.chosen_conf.toFixed(3)
                                            : "-"}
                                    </span>
                                </div>
                                <div className="flex justify-between py-1">
                                    <span className="font-medium text-slate-600">Kept Confs ≥ min:</span>
                                    <span className="font-semibold">
                                        {Array.isArray(okRes.faces?.kept_confs_ge_min)
                                            ? okRes.faces!.kept_confs_ge_min.map((v) => v.toFixed(3)).join(", ")
                                            : "-"}
                                    </span>
                                </div>
                                <div className="flex flex-col py-1">
                                    <span className="font-medium text-slate-600 mb-1">Note:</span>
                                    <span className="text-slate-800">{okRes.faces?.note ?? "-"}</span>
                                </div>
                                {okRes.faces?.box ? (
                                    <div className="flex flex-col py-1">
                                        <span className="font-medium text-slate-600 mb-1">Box:</span>
                                        <span className="font-mono text-xs bg-slate-50 p-2 rounded">
                                            [{okRes.faces.box.join(", ")}]
                                        </span>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Chevron Toggle */}
            {okRes && (
                <button
                    onClick={() => setSummaryVisible(!summaryVisible)}
                    className={`${summaryVisible ? "animate-bounce mt-4" : "mt-0"} mx-auto flex items-center justify-center`}
                >
                    <div className="grid place-items-center rounded-full bg-white shadow-md px-2 py-0 hover:shadow-lg transition-shadow cursor-pointer">
                        <ChevronDown 
                            className={`h-5 w-5 text-slate-600 transition-transform duration-300 ${
                                summaryVisible ? 'rotate-180' : 'animate-bounce'
                            }`} 
                            strokeWidth={2.5} 
                        />
                    </div>
                </button>
            )}
        </div>
    );
}
