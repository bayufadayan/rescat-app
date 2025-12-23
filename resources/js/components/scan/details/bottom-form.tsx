/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useRef, useState, UIEvent } from "react";
import * as Drawer from "vaul";
import { Shield } from "lucide-react";
import LocationCard from "./location-card";
import type { GeoStatus, Coords, Address } from "@/types/geo";
import { useRoute } from "ziggy-js";
import InfoNotice from "./info-notice";
import { buildSessionPayload } from "@/lib/helper/session-payload";
import { submitScanSession } from "@/lib/helper/submit-session";

type Props = {
    open: boolean;
    setOpen: (v: boolean) => void;
    status: GeoStatus;
    coords: Coords | null;
    address: Address | null;
    updatedAt: Date | null;
    refreshLocation: () => void;
    clearLocation: () => void;
    phase?: string;
};

const BottomForm: React.FC<Props> = ({
    open,
    setOpen,
    status,
    coords,
    address,
    updatedAt,
    refreshLocation,
    clearLocation,
    phase,
}) => {
    const [anonymous, setAnonymous] = useState(true);
    const [name, setName] = useState("");
    const [notes, setNotes] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [forceCheck, setForceCheck] = useState(false);
    const route = useRoute();
    const toRelativeUrl = useCallback((url: string) => {
        if (!url) return url;
        try {
            const base = typeof window !== "undefined" ? window.location.origin : undefined;
            const parsed = new URL(url, base);
            return `${parsed.pathname}${parsed.search}`;
        } catch {
            return url;
        }
    }, []);

    const buildRoute = useCallback(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (name: string, params?: any) => toRelativeUrl(route(name as any, params as any) as unknown as string),
        [route, toRelativeUrl]
    );
    const snapPoints: number[] = [0.25, 0.65, 1];
    const [activeSnap, setActiveSnap] = useState<number | null>(snapPoints[0]);
    const maxSnap = snapPoints[snapPoints.length - 1];

    const handleSetActiveSnapPoint = (sp: number | string | null) => {
        if (typeof sp === "number") {
            setActiveSnap(sp);
        } else if (typeof sp === "string") {
            const parsed = parseFloat(sp);
            setActiveSnap(Number.isFinite(parsed) ? parsed : snapPoints[0]);
        } else {
            setActiveSnap(snapPoints[0]);
        }
    };

    const scrollRef = useRef<HTMLDivElement | null>(null);
    const [atTop, setAtTop] = useState(true);

    const copyAddress = async () => {
        const text = address?.display ?? (coords ? `${coords.lat}, ${coords.lon}` : "—");
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            // ignore
        }
    };

    return (
        <Drawer.Root
            open={open}
            onOpenChange={setOpen}
            defaultOpen
            dismissible={true}
            modal={false}
            handleOnly={!atTop}
            snapPoints={snapPoints}
            activeSnapPoint={activeSnap}
            setActiveSnapPoint={handleSetActiveSnapPoint}
            snapToSequentialPoint
            fadeFromIndex={2}
        >
            <Drawer.Portal>
                <Drawer.Content className="fixed inset-x-0 bottom-0 z-[60] mx-auto w-full max-w-[480px] h-[100dvh] rounded-t-3xl bg-white shadow-2xl focus:outline-none">
                    {/* Handle Bar */}
                    <div className="pt-3 pb-2 flex justify-center">
                        <div className="w-12 h-1.5 rounded-full bg-slate-300" />
                    </div>

                    {/* Scrollable Content */}
                    <div
                        ref={scrollRef}
                        className="overscroll-contain h-[calc(100dvh-180px)] overflow-y-auto px-5 pb-4"
                        style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "#cbd5e1 transparent",
                        }}
                        onScroll={(e: UIEvent<HTMLDivElement>) => {
                            const isAtTop = e.currentTarget.scrollTop <= 0;
                            setAtTop(isAtTop);
                            if ((activeSnap ?? snapPoints[0]) < maxSnap && !isAtTop) {
                                handleSetActiveSnapPoint(maxSnap);
                            }
                        }}
                        onWheel={() => {
                            if ((activeSnap ?? snapPoints[0]) < maxSnap) handleSetActiveSnapPoint(maxSnap);
                        }}
                        onTouchMove={() => {
                            if ((activeSnap ?? snapPoints[0]) < maxSnap) handleSetActiveSnapPoint(maxSnap);
                        }}
                    >
                        <h3 className="text-center text-base font-semibold text-slate-800 mb-5">
                            Tolong lengkapi informasi di bawah ini
                        </h3>

                        <div className="mt-4 space-y-4">
                            <InfoNotice />

                            <LocationCard
                                status={status}
                                coords={coords}
                                address={address}
                                updatedAt={updatedAt}
                                onRefresh={refreshLocation}
                                onCopy={copyAddress}
                                onClear={clearLocation}
                            />

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">Your name</label>
                                <input
                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-sky-100 focus:ring-4 transition-shadow"
                                    placeholder="Nama kamu"
                                    value={anonymous ? "" : name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={anonymous}
                                />
                                <label className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={anonymous}
                                        onChange={(e) => setAnonymous(e.target.checked)}
                                        className="h-4 w-4 accent-sky-600"
                                    />
                                    Anonim
                                </label>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">
                                    Describing your thought (Optional)
                                </label>
                                <textarea
                                    className="min-h-[120px] w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none ring-sky-100 focus:ring-4 resize-none transition-shadow"
                                    placeholder="Tulis catatan tambahan…"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            {phase !== "success" && (
                                <div>
                                    <label className="flex items-center gap-2 text-sm text-slate-700 p-3 rounded-xl border border-amber-200 bg-amber-50/50">
                                        <input 
                                            type="checkbox" 
                                            checked={forceCheck} 
                                            onChange={(e) => setForceCheck(e.target.checked)} 
                                            className="h-4 w-4 accent-amber-600" 
                                        />
                                        <span className="font-medium">Paksa periksa (bypass validasi)</span>
                                    </label>
                                </div>
                            )}

                            <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
                                <Shield className="h-4 w-4" />
                                Data kamu kami lindungi.
                            </div>
                        </div>
                    </div>

                    {/* Fixed Bottom Button - Extra padding when at full height */}
                    <div 
                        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-white via-white to-transparent p-5 ${
                            activeSnap === 1 ? 'pb-8' : 'pb-5'
                        }`}
                    >
                        <button
                            type="button"
                            disabled={submitting || (phase !== "success" && !forceCheck)}
                            className={`w-full rounded-2xl bg-sky-600 py-4 text-white font-medium shadow-lg shadow-sky-600/30 active:scale-[0.98] transition-all ${
                                submitting || (phase !== "success" && !forceCheck) ? "opacity-50 cursor-not-allowed" : "hover:bg-sky-700"
                            }`}
                            onClick={async () => {
                                if (submitting) return;
                                setSubmitError(null);
                                try {
                                    setSubmitting(true);
                                    const payload = buildSessionPayload(address, coords, {
                                        informer: anonymous ? "Anonim" : name || "Anonim",
                                        notes,
                                    });
                                    const { data } = await submitScanSession(buildRoute("scan.sessions.store"), payload);

                                    [
                                        "scanOption",
                                        "scanType",
                                        "scan:original",
                                        "scan:meta",
                                        "scan:bounding-box",
                                        "scan:roi",
                                        "scan:session_id",
                                        "scan:session_image_id",
                                    ].forEach((key) => localStorage.removeItem(key));

                                    ["scan:result", "scan:rid"].forEach((key) => sessionStorage.removeItem(key));

                                    localStorage.setItem("scan:session_id", data.session_id);
                                    localStorage.setItem("scan:session_image_id", data.image_id);

                                    window.location.href = buildRoute("scan.process", data.session_id);
                                } catch (e: any) {
                                    console.error("submit session error", e);
                                    setSubmitting(false);
                                    setSubmitError(e?.message || "Gagal membuat sesi.");
                                }
                            }}
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Menyiapkan…
                                </span>
                            ) : (
                                "Periksa Sekarang"
                            )}
                        </button>

                        {submitError && (
                            <p className="mt-3 text-center text-xs text-red-600 font-medium">
                                {submitError}
                            </p>
                        )}

                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
};

export default BottomForm;
