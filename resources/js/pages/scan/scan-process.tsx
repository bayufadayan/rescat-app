"use client";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Home, Info } from "lucide-react";
import { route } from "ziggy-js";
import LottiePlayer from "@/components/lottie/LottiePlayer";
import type { ScanSessionPayload, ScanStatusValue } from "@/types/scan-result";

type ScanProcessProps = {
    session: ScanSessionPayload;
};

type ProcessingState = "idle" | "processing" | "done" | "error";

export default function ScanProcess({ session }: ScanProcessProps) {
    const [processingState, setProcessingState] = useState<ProcessingState>("processing");
    const [sessionStatus, setSessionStatus] = useState<ScanStatusValue>(session.status ?? "processing");
    const [statusMessage, setStatusMessage] = useState("Menginisiasi proses analisis …");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [removedUrl, setRemovedUrl] = useState<string | null>(session.images?.[0]?.img_remove_bg_url ?? null);

    const firstImage = session?.images?.[0];
    const rawOriginalUrl = firstImage?.img_original_url ?? null;

    // Untuk tampilan (tambah ?cors=1 kalau perlu di FE)
    const originalUrl = useMemo(() => {
        if (!rawOriginalUrl) return undefined;
        return `${rawOriginalUrl}${rawOriginalUrl.includes("?") ? "&" : "?"}cors=1`;
    }, [rawOriginalUrl]);

    const maskSource = removedUrl ?? firstImage?.img_remove_bg_url ?? null;
    const maskImage = maskSource ? `url(${maskSource})` : undefined;
    const isImageReady = processingState === "done" && Boolean(maskImage);

    const pipelineEndpoint = useMemo(
        () => route("scan.process.removebg", { scan_session: session.id }),
        [session.id]
    );
    const statusEndpoint = useMemo(
        () => route("scan.process.status", { scan_session: session.id }),
        [session.id]
    );
    const resultsUrl = useMemo(
        () => route("scan.result", { scan_session: session.id }),
        [session.id]
    );

    const hasRequestedRef = useRef(false);
    const redirectRef = useRef(false);
    const pollFailureRef = useRef(0);

    const runPipeline = useCallback(async () => {
        try {
            setProcessingState("processing");
            setStatusMessage("Menghapus latar belakang dan menyiapkan landmark …");

            const csrfToken = (document.querySelector(
                'meta[name="csrf-token"]'
            ) as HTMLMetaElement | null)?.content;

            const res = await fetch(pipelineEndpoint, {
                method: "POST",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                    ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            });

            const payload = await res.json().catch(() => null);

            if (!res.ok || !payload?.ok) {
                throw new Error(payload?.message || "Gagal memulai pemrosesan.");
            }

            const nextRemovedUrl: string | null =
                payload?.data?.remove_bg?.url ??
                payload?.data?.images?.[0]?.img_remove_bg_url ??
                null;

            if (nextRemovedUrl) {
                setRemovedUrl(nextRemovedUrl);
            }

            setStatusMessage("Menunggu hasil klasifikasi …");
        } catch (e) {
            console.error("ScanProcess pipeline error:", e);
            setProcessingState("error");
            setErrorMsg(e instanceof Error ? e.message : "Terjadi kesalahan.");
        }
    }, [pipelineEndpoint]);

    useEffect(() => {
        if (hasRequestedRef.current) return;
        hasRequestedRef.current = true;

        if (!rawOriginalUrl) {
            console.warn("Tidak ada img_original_url pada session.images[0]");
            setProcessingState("error");
            setErrorMsg("Tidak ada gambar original untuk diproses.");
            return;
        }

        void runPipeline();
    }, [rawOriginalUrl, runPipeline]);

    useEffect(() => {
        let cancelled = false;

        const poll = async () => {
            try {
                const res = await fetch(statusEndpoint, {
                    headers: { "X-Requested-With": "XMLHttpRequest" },
                });
                const payload = await res.json().catch(() => null);

                if (!res.ok || payload?.ok === false) {
                    throw new Error(payload?.message ?? "Gagal memuat status sesi.");
                }

                if (!payload?.data || cancelled) return;

                pollFailureRef.current = 0;

                const nextStatus = payload.data.session?.status as ScanStatusValue | undefined;
                if (nextStatus) {
                    setSessionStatus(nextStatus);
                }

                const remoteRemove = payload.data.images?.[0]?.img_remove_bg_url;
                if (remoteRemove && !removedUrl) {
                    setRemovedUrl(remoteRemove);
                }

                if (nextStatus === "processing") {
                    const detailCount = payload.data.result?.details?.length ?? 0;
                    setStatusMessage(
                        detailCount > 0
                            ? "Menyiapkan ringkasan hasil …"
                            : "Sedang menganalisis area detail …"
                    );
                }

                if (nextStatus === "done" && !redirectRef.current) {
                    redirectRef.current = true;
                    setProcessingState("done");
                    setStatusMessage("Analisis selesai, menampilkan hasil …");
                    setTimeout(() => {
                        window.location.href = resultsUrl;
                    }, 1200);
                } else if (nextStatus === "failed") {
                    setProcessingState("error");
                    setStatusMessage("Proses gagal.");
                    setErrorMsg(payload.data.result?.remarks ?? "Proses gagal. Silakan ulangi dari awal.");
                }
            } catch (error) {
                console.warn("Status polling error:", error);
                pollFailureRef.current += 1;
                if (pollFailureRef.current >= 3 && processingState !== "error") {
                    setProcessingState("error");
                    setErrorMsg(
                        error instanceof Error
                            ? error.message
                            : "Gagal memantau status. Periksa koneksi Anda dan coba lagi."
                    );
                }
            }
        };

        poll();
        const id = window.setInterval(poll, 3000);

        return () => {
            cancelled = true;
            window.clearInterval(id);
        };
    }, [statusEndpoint, resultsUrl, removedUrl, processingState]);

    return (
        <main className="min-h-dvh h-dvh flex items-center justify-center bg-[linear-gradient(to_bottom,_#0091F3,_#21A6FF)] relative">
            <div className="absolute hidden md:flex w-full h-full bg-[url('/images/background/pink-purple.png')] bg-cover bg-center bg-no-repeat mix-blend-soft-light" />

            <img
                src="/images/background/onboard-pattern.png"
                alt="pattern"
                className="absolute flex md:hidden inset-0 h-[30%] w-auto object-cover mix-blend-screen opacity-50 object-left"
            />
            <img
                src="/images/background/onboard-pattern.png"
                alt="pattern-bottom"
                className="absolute flex md:hidden bottom-0 left-0 h-[30%] w-auto object-cover mix-blend-screen opacity-50 object-left scale-x-[-1] scale-y-[-1]"
            />

            <div className="min-h-dvh w-full flex flex-col justify-between py-4 px-8 z-10">
                {/* Header */}
                <div className="flex justify-between items-center w-full mt-3 text-white">
                    <button
                        onClick={() => (window.location.href = route("home"))}
                        className="cursor-pointer"
                    >
                        <Home />
                    </button>
                    <h4 className="font-bold text-xl text-center flex-1">
                        Scanning...
                    </h4>
                    <button className="invisible">
                        <Home />
                    </button>
                </div>

                {/* Main */}
                <div className="flex items-center justify-center flex-col relative">
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative h-72 w-72">
                            {/* Lingkaran background */}
                            <svg
                                viewBox="0 0 120 120"
                                className="absolute inset-0 h-full w-full"
                                aria-hidden="true"
                            >
                                <circle
                                    cx="60"
                                    cy="60"
                                    r="54"
                                    fill="none"
                                    stroke="rgba(255,255,255,0.35)"
                                    strokeWidth="8"
                                />
                            </svg>

                            {/* Loader circle (muter) */}
                            {processingState !== "done" && (
                                <svg
                                    viewBox="0 0 120 120"
                                    className="absolute inset-0 h-full w-full animate-[spin_1.3s_linear_infinite]"
                                    aria-hidden="true"
                                >
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="54"
                                        fill="none"
                                        stroke="white"
                                        strokeLinecap="round"
                                        strokeWidth="8"
                                        strokeDasharray="80 400"
                                    />
                                </svg>
                            )}

                            {isImageReady ? (
                                <>
                                    <img
                                        src={originalUrl ?? "/images/dummy/cat-original.png"}
                                        alt="subject"
                                        className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full object-cover shadow-xl ring-4 ring-white/70"
                                    />

                                    <style>
                                        {`
                                            @keyframes scan-sweep {
                                                0% { background-position: -60% 50%; }
                                                100% { background-position: 160% 50%; }
                                            }
                                            @keyframes scan-pulse {
                                                0%,100% { filter: brightness(1); }
                                                50% { filter: brightness(1.25); }
                                            }
                                            @keyframes scan-glow {
                                                0%,100% { opacity: .35; transform: scale(1); }
                                                50% { opacity: .6; transform: scale(1.02); }
                                            }
                                        `}
                                    </style>

                                    <div
                                        className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full overflow-hidden"
                                        aria-hidden="true"
                                    >
                                        <div
                                            className="h-full w-full"
                                            style={{
                                                WebkitMaskImage: maskImage,
                                                maskImage: maskImage,
                                                WebkitMaskSize: "cover",
                                                maskSize: "cover",
                                                WebkitMaskRepeat: "no-repeat",
                                                maskRepeat: "no-repeat",
                                                WebkitMaskPosition: "center",
                                                maskPosition: "center",
                                                background:
                                                    "linear-gradient(100deg, rgba(0,145,243,0) 0%, rgba(0,145,243,0.55) 40%, rgba(0,145,243,0.85) 50%, rgba(0,145,243,0.55) 60%, rgba(0,145,243,0) 100%)",
                                                animation:
                                                    "scan-sweep 2.4s linear infinite, scan-pulse 2.2s ease-in-out infinite",
                                                backgroundSize: "220% 100%",
                                                backgroundPosition: "-50% 50%",
                                                mixBlendMode: "screen",
                                            }}
                                        />

                                        <div
                                            className="pointer-events-none absolute inset-0"
                                            style={{
                                                WebkitMaskImage: maskImage,
                                                maskImage: maskImage,
                                                WebkitMaskSize: "cover",
                                                maskSize: "cover",
                                                WebkitMaskRepeat: "no-repeat",
                                                maskRepeat: "no-repeat",
                                                WebkitMaskPosition: "center",
                                                maskPosition: "center",
                                                background:
                                                    "radial-gradient(60% 60% at 50% 50%, rgba(33,166,255,0.25) 0%, rgba(33,166,255,0.1) 50%, rgba(33,166,255,0) 100%)",
                                                animation: "scan-glow 3.5s ease-in-out infinite",
                                                mixBlendMode: "screen",
                                            }}
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full object-cover bg-white flex items-center justify-center">
                                    <LottiePlayer src="/animations/waiting-cat.lottie" />
                                </div>
                            )}
                        </div>

                        {/* Status */}
                        <div className="flex flex-col items-center gap-3 text-center">
                            <p className="flex items-center gap-2 text-white/80 mt-1">
                                <span className="inline-block h-2 w-2 rounded-full bg-white/80" />
                                <span className="text-xs font-mono tracking-wide">
                                    Scan Session ID: {session.id}
                                </span>
                            </p>

                            <p className="text-white text-xs uppercase tracking-widest">
                                Status: {sessionStatus === "done" ? "Selesai" : sessionStatus === "failed" ? "Gagal" : "Sedang Diproses"}
                            </p>

                            <p className="text-white text-sm max-w-xs leading-relaxed">
                                {processingState === "error"
                                    ? errorMsg ?? "Terjadi kesalahan."
                                    : statusMessage}
                            </p>

                            {processingState !== "done" && processingState !== "error" && (
                                <div className="flex flex-col items-center gap-2">
                                    <p className="flex items-center gap-2 text-white/95">
                                        <span className="inline-block h-3 w-3 animate-[spin_1s_linear_infinite] rounded-full border-2 border-white border-t-transparent" />
                                        <span className="text-base font-semibold tracking-wide">
                                            Sistem sedang memproses …
                                        </span>
                                    </p>
                                    <p className="flex items-center gap-2 text-white/90 text-xs">
                                        <span className="inline-block h-3 w-3 animate-[spin_1s_linear_infinite] rounded-full border-2 border-white border-t-transparent" />
                                        <span>Jangan tutup atau refresh halaman.</span>
                                    </p>
                                </div>
                            )}

                            {processingState === "error" && (
                                <button
                                    type="button"
                                    className="mt-1 rounded-full bg-white/20 text-white px-4 py-1 text-xs hover:bg-white/30"
                                    onClick={() => window.location.reload()}
                                >
                                    Coba lagi
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white shadow-md w-full rounded-full p-2 flex flex-row gap-2 items-center max-w-lg self-center">
                    <Info height={20} width={20} className="text-amber-500" />
                    <p className="flex flex-1 text-black text-xs">
                        Tunggu sebentar! Halaman hasil akan terbuka otomatis.
                    </p>
                </div>
            </div>
        </main>
    );
}
