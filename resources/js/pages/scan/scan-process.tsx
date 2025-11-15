/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { Home, Info } from "lucide-react";
import { route } from "ziggy-js";
import LottiePlayer from "@/components/lottie/LottiePlayer";

type ScanProcessProps = {
    session: any;
};

export default function ScanProcess({ session }: ScanProcessProps) {
    const [processingState, setProcessingState] = useState<
        "idle" | "processing" | "done"
    >("processing");

    const firstImage = session?.images?.[0];
    const rawOriginalUrl = firstImage?.img_original_url as string | undefined;

    const originalUrl = rawOriginalUrl
        ? `${rawOriginalUrl}${rawOriginalUrl.includes("?") ? "&" : "?"}cors=1`
        : undefined;

    // Simulasi proses 3 detik → selesai
    useEffect(() => {
        const t = setTimeout(() => {
            setProcessingState("processing");
        }, 3000);
        return () => clearTimeout(t);
    }, []);

    const isDone = processingState === "idle";

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
                            {/* Background Circle */}
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

                            {/* Loader Circle */}
                            {!isDone && (
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

                            {/* Image */}
                            {isDone ? (
                                <img
                                    src={originalUrl ?? "/images/dummy/cat-original.png"}
                                    alt="subject"
                                    className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full object-cover shadow-xl ring-4 ring-white/70"
                                />
                            ) : (
                                <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full object-cover bg-white flex items-center justify-center">
                                    <LottiePlayer src="/animations/waiting-cat.lottie" />
                                </div>
                            )}
                        </div>

                        {/* Status */}
                        <div className="flex flex-col items-center gap-2">
                            <p className="flex items-center gap-2 text-white/80 mt-1">
                                <span className="inline-block h-2 w-2 rounded-full bg-white/80" />
                                <span className="text-xs font-mono tracking-wide">
                                    Scan Session ID: {session.id}
                                </span>
                            </p>

                            <p className="text-white text-xs">
                                State: {processingState}
                            </p>

                            {!isDone && (
                                <>
                                    <p className="flex items-center gap-2 text-white/95">
                                        <span className="inline-block h-3 w-3 animate-[spin_1s_linear_infinite] rounded-full border-2 border-white border-t-transparent" />
                                        <span className="text-base font-semibold tracking-wide">
                                            Scoring grimace scale …
                                        </span>
                                    </p>
                                    <p className="flex items-center gap-2 text-white/90">
                                        <span className="inline-block h-3 w-3 animate-[spin_1s_linear_infinite] rounded-full border-2 border-white border-t-transparent" />
                                        <span className="text-sm">Getting final score …</span>
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white shadow-md w-full rounded-full p-2 flex flex-row gap-2 items-center max-w-lg self-center">
                    <Info height={20} width={20} className="text-amber-500" />
                    <p className="flex flex-1 text-black text-xs">
                        Tunggu sebentar! dan jangan refresh browser anda
                    </p>
                </div>
            </div>
        </main>
    );
}
