// src/components/scan/results/main/quick-actions/more-menu.tsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import MoreButton from './action-more-menu';
import { Share2, MapPin, BookOpen, MessageSquare, Loader2, ChevronRight } from 'lucide-react';
import ShareModal from './share-modal';
import axios from 'axios';

type Petcare = {
    id: number;
    name: string;
    address: string;
    phone?: string;
    latitude?: number;
    longitude?: number;
    distance?: number;
    opening_hours?: Record<string, string>;
};

function mapsUrl(name: string, address: string, lat?: number, lng?: number) {
    if (typeof lat === 'number' && typeof lng === 'number') {
        return `https://www.google.com/maps?q=${lat},${lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name} ${address}`)}`;
}

function formatDistance(km?: number) {
    if (!km) return '';
    if (km < 1) return `${Math.round(km * 1000)}m`;
    return `${km.toFixed(1)} km`;
}

export default function MoreMenu() {
    const [open, setOpen] = useState(false);
    const [openShare, setOpenShare] = useState(false);
    const [showMaps, setShowMaps] = useState(false);
    const [petcares, setPetcares] = useState<Petcare[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    const currentUrl = useMemo(() => (typeof window !== 'undefined' ? window.location.href : ''), []);

    const fetchPetcares = useCallback(async () => {
        setIsLoading(true);
        
        try {
            // Try to get user location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        setUserLocation({ lat, lng });
                        
                        // Fetch with location
                        const response = await axios.get('/api/petcares', {
                            params: { latitude: lat, longitude: lng }
                        });
                        setPetcares(response.data.data);
                        setIsLoading(false);
                    },
                    async () => {
                        // Location denied or error, fetch without location
                        const response = await axios.get('/api/petcares');
                        setPetcares(response.data.data);
                        setIsLoading(false);
                    }
                );
            } else {
                // Geolocation not supported
                const response = await axios.get('/api/petcares');
                setPetcares(response.data.data);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error fetching petcares:', error);
            setIsLoading(false);
        }
    }, []);

    // Fetch petcares when maps panel is shown
    useEffect(() => {
        if (showMaps && petcares.length === 0) {
            fetchPetcares();
        }
    }, [showMaps, petcares.length, fetchPetcares]);

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div>
                        <MoreButton />
                    </div>
                </PopoverTrigger>

                <PopoverContent
                    side="top"
                    align="end"
                    sideOffset={8}
                    className="z-[100] w-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-xl"
                >
                    {/* Bar ikon utama */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={async () => {
                                if (navigator.share) {
                                    try {
                                        await navigator.share({ title: 'Hasil pemeriksaan Rescat', url: currentUrl });
                                    } catch {
                                        //
                                    }
                                } else {
                                    setOpen(false);
                                    setOpenShare(true);
                                }
                            }}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98]"
                            aria-label="Share"
                            title="Share"
                        >
                            <Share2 className="h-5 w-5 text-slate-900" />
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowMaps((v) => !v)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98]"
                            aria-label="Maps"
                            title="Maps"
                        >
                            <MapPin className="h-5 w-5 text-slate-900" />
                        </button>

                        <a
                            href="https://docs.rescat.life"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98]"
                            aria-label="Docs"
                            title="Docs"
                        >
                            <BookOpen className="h-5 w-5 text-slate-900" />
                        </a>

                        <a
                            href="/feedback"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98]"
                            aria-label="Feedback"
                            title="Feedback"
                        >
                            <MessageSquare className="h-5 w-5 text-slate-900" />
                        </a>
                    </div>

                    {/* Panel Maps (toggle dalam popover) */}
                    {showMaps && (
                        <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3">
                            <p className="mb-2 text-sm font-medium text-slate-900">
                                Petcare di sekitar
                                {userLocation && <span className="ml-1 text-xs text-sky-600">(terdekat)</span>}
                            </p>
                            
                            {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
                                </div>
                            ) : petcares.length === 0 ? (
                                <p className="text-sm text-slate-500 text-center py-4">
                                    Tidak ada data petcare
                                </p>
                            ) : (
                                <ul className="max-h-[220px] space-y-2 overflow-y-auto pr-1" style={{
                                    scrollbarWidth: "thin",
                                    scrollbarColor: "#a0aec0 transparent",
                                }}>
                                    {petcares.map((p) => {
                                        const href = mapsUrl(p.name, p.address, p.latitude, p.longitude);
                                        return (
                                            <li key={p.id} className="rounded-xl border border-slate-200 p-2.5">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-slate-900 truncate">{p.name}</p>
                                                        <p className="text-xs text-slate-600 truncate">{p.address}</p>
                                                        {p.phone && <p className="text-xs text-slate-500 mt-0.5">{p.phone}</p>}
                                                    </div>
                                                    {p.distance && (
                                                        <span className="shrink-0 inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">
                                                            {formatDistance(p.distance)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <a
                                                        href={href}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:brightness-[1.05] active:scale-[0.98]"
                                                    >
                                                        <MapPin className="h-3.5 w-3.5" />
                                                        Buka Maps
                                                    </a>
                                                    <button
                                                        onClick={() => {
                                                            setOpen(false);
                                                            router.visit(`/petcares/${p.id}`);
                                                        }}
                                                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border-2 border-[#0D99FF] bg-white px-3 py-1.5 text-xs font-medium text-[#0D99FF] hover:bg-blue-50 active:scale-[0.98]"
                                                    >
                                                        Lihat Detail
                                                        <ChevronRight className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    )}
                </PopoverContent>
            </Popover>

            {/* Modal share (dibuka dari tombol Share di popover) */}
            <ShareModal open={openShare} onOpenChange={setOpenShare} url={currentUrl} title="Hasil pemeriksaan Rescat" />
        </>
    );
}
