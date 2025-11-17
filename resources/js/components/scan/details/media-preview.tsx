/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from "react";
import { ChevronUp, Check, X, AlertTriangle, Info, ImageIcon } from "lucide-react";
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
    const [meta, setMeta] = useState<StoredMeta | null>(null);
    const [result, setResult] = useState<CatApiResponse | null>(null);

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

            // Result tetap di sessionStorage (seperti alur lama)
            const r = sessionStorage.getItem("scan:result");
            if (r) setResult(JSON.parse(r));
        } catch {
            //
        }
    }, [phase]);

    const okRes: CatApiSuccessV1 | null =
        result && (result as any).ok === true ? (result as CatApiSuccessV1) : null;

    const verdict = useMemo(() => {
        if (phase === "uploading" || phase === "analyzing") return "loading" as const;
        if (phase === "fail") return "fail" as const;
        if (okRes) return okRes.can_proceed ? ("cat" as const) : ("noncat" as const);
        return "idle" as const;
    }, [phase, okRes]);

    const probText = useMemo(() => {
        const p = okRes?.recognize?.cat_prob;
        return typeof p === "number" ? `p=${p.toFixed(2)}` : "";
    }, [okRes?.recognize?.cat_prob]);

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

    return (
        <div className="w-full md:max-w-2xl max-w-full pt-0 relative">
            {/* VERDICT OVERLAY */}
            <div
                className="h-20 w-20 absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full z-20 shrink-0 grow-0 border-8 border-white grid place-items-center"
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
                    <div className="h-10 w-10 rounded-full border-4 border-white/70 border-t-transparent animate-spin" />
                )}
                {verdict === "cat" && <Check className="text-white size-12" strokeWidth={3} />}
                {(verdict === "noncat" || verdict === "fail" || verdict === "idle") && (
                    <X className="text-white size-12" strokeWidth={3} />
                )}
            </div>

            {/* IMAGE CARD */}
            <div className="w-fit h-auto bg-white border-8 border-white rounded-3xl overflow-hidden p-1 mx-auto max-w-[350px] md:max-w-lg shadow">
                <div className="relative overflow-hidden rounded-2xl bg-neutral-200">
                    {hero ? (
                        <img src={hero} alt="Preview" className="h-[360px] w-full object-cover" />
                    ) : (
                        <div className="h-[360px] w-full grid place-items-center text-neutral-600">
                            No image available
                        </div>
                    )}
                    <button
                        type="button"
                        className={`absolute bottom-3 right-3 grid h-10 w-10 place-items-center rounded-lg shadow-md ${isAnalyzing ? "bg-black/20 cursor-not-allowed" : "bg-black/50"
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
                    <div className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-sm text-slate-700 shadow">
                        <div className="h-3 w-3 rounded-full border-2 border-slate-500 border-t-transparent animate-spin" />
                        <span>Analyzing...</span>
                    </div>
                ) : null}

                {okRes && (
                    <div
                        className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm shadow ${okRes.can_proceed ? "bg-white text-green-700" : "bg-white text-red-700"
                            }`}
                    >
                        {okRes.can_proceed ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        <span>
                            {okRes.message}
                            {okRes.recognize?.label ? ` • label=${okRes.recognize.label}` : ""}
                            {probText ? ` • ${probText}` : ""}
                        </span>
                    </div>
                )}

                {!okRes && phase === "fail" && (
                    <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-red-700 shadow">
                        <AlertTriangle className="h-4 w-4" />
                        <span>Failed to analyze{errorMsg ? ` — ${errorMsg}` : ""}</span>
                        <button
                            type="button"
                            className="ml-1 rounded-md px-2 py-0.5 text-xs bg-red-50 border border-red-200 hover:bg-red-100"
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

            {/* RESULT SUMMARY */}
            {okRes && (
                <div className="mt-4 w-full max-w-xl mx-auto space-y-3">
                    {/* NEW: Preview (Bounding Box) */}
                    {okRes.faces?.preview_url && (
                        <div className="bg-white rounded-xl shadow p-3">
                            <div className="flex items-center gap-2 mb-2 text-slate-700">
                                <ImageIcon className="h-4 w-4" />
                                <span className="font-medium">Preview (Bounding Box)</span>
                            </div>
                            <img
                                src={okRes.faces.preview_url}
                                alt="Preview Bounding Box"
                                className="w-full rounded-md border"
                            />
                        </div>
                    )}

                    {/* ROI (Selected Face) */}
                    {okRes.faces?.roi_url && (
                        <div className="bg-white rounded-xl shadow p-3">
                            <div className="flex items-center gap-2 mb-2 text-slate-700">
                                <ImageIcon className="h-4 w-4" />
                                <span className="font-medium">ROI (Selected Face)</span>
                            </div>
                            <img src={okRes.faces.roi_url} alt="ROI" className="w-full rounded-md border" />
                        </div>
                    )}

                    {/* Face detection summary */}
                    <div className="bg-white rounded-xl shadow p-3">
                        <div className="flex items-center gap-2 mb-2 text-slate-700">
                            <Info className="h-4 w-4" />
                            <span className="font-medium">Face Detection Summary</span>
                        </div>
                        <div className="text-sm text-slate-700 space-y-1">
                            <div>
                                <b>faces_count:</b> {okRes.faces?.faces_count ?? 0}
                            </div>
                            <div>
                                <b>chosen_conf:</b>{" "}
                                {typeof okRes.faces?.chosen_conf === "number"
                                    ? okRes.faces?.chosen_conf.toFixed(3)
                                    : "-"}
                            </div>
                            <div>
                                <b>kept_confs ≥ min:</b>{" "}
                                {Array.isArray(okRes.faces?.kept_confs_ge_min)
                                    ? okRes.faces!.kept_confs_ge_min.map((v) => v.toFixed(3)).join(", ")
                                    : "-"}
                            </div>
                            <div>
                                <b>note:</b> {okRes.faces?.note ?? "-"}
                            </div>
                            {okRes.faces?.box ? (
                                <div>
                                    <b>box:</b> [{okRes.faces.box.join(", ")}]
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <details className="bg-white rounded-xl shadow p-3">
                        <summary className="cursor-pointer select-none text-sm text-slate-700">
                            Raw payload (JSON)
                        </summary>
                        <pre className="mt-2 text-xs overflow-auto">
                            {JSON.stringify(okRes, null, 2)}
                        </pre>
                    </details>
                </div>
            )}

            <div className="mt-2 flex w-full justify-center">
                <div className="grid place-items-center rounded-full bg-white shadow-md px-2 py-0">
                    <ChevronUp className="h-5 w-5 text-slate-600" strokeWidth={2.5} />
                </div>
            </div>
        </div>
    );
}
