// src/components/scan/results/main/quick-actions/contact-modal.tsx
import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from '@/components/ui/dialog';
import { Phone, MessageCircle, Loader2, MapPin } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { normalizePhone } from '@/lib/helper/phone';
import axios from 'axios';

type VetContact = {
    id: number;
    name: string;
    address: string;
    phone?: string;
    vet_name?: string;
    vet_phone?: string;
    vet_specialization?: string;
    distance?: number;
};

type Props = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
};

function formatDistance(km?: number) {
    if (!km) return '';
    if (km < 1) return `${Math.round(km * 1000)}m`;
    return `${km.toFixed(1)} km`;
}

export default function ContactModal({ open, onOpenChange }: Props) {
    const [contacts, setContacts] = useState<VetContact[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if (open && contacts.length === 0) {
            fetchContacts();
        }
    }, [open]);

    const fetchContacts = async () => {
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
                        setContacts(response.data.data);
                        setIsLoading(false);
                    },
                    async () => {
                        // Location denied or error, fetch without location
                        const response = await axios.get('/api/petcares');
                        setContacts(response.data.data);
                        setIsLoading(false);
                    }
                );
            } else {
                // Geolocation not supported
                const response = await axios.get('/api/petcares');
                setContacts(response.data.data);
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="z-[120] sm:max-w-[520px] p-0 overflow-hidden">
                <DialogHeader className="px-5 pt-5">
                    <DialogTitle className="text-base font-semibold">
                        Hubungi Dokter Hewan Terdekat
                        {userLocation && <span className="ml-2 text-xs font-normal text-sky-600">(terdekat)</span>}
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        Pilih kontak berikut untuk menelpon langsung atau chat via WhatsApp.
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-[65vh] overflow-y-auto px-5 pb-5 pt-2" style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#a0aec0 transparent",
                }}>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
                        </div>
                    ) : contacts.length === 0 ? (
                        <p className="text-sm text-slate-500 text-center py-8">
                            Tidak ada data dokter hewan
                        </p>
                    ) : (
                        <TooltipProvider delayDuration={150}>
                            <ul className="space-y-3">
                                {contacts.map((c) => {
                                    const vetPhone = c.vet_phone || c.phone || '';
                                    const p = normalizePhone(vetPhone);
                                    const telHref = `tel:${p.tel}`;
                                    const waHref = `https://wa.me/${p.wa}?text=${encodeURIComponent(
                                        'Halo Dok, saya butuh konsultasi hewan peliharaan.'
                                    )}`;

                                    return (
                                        <li key={c.id} className="rounded-2xl border border-slate-200 p-3.5 bg-white">
                                            <div className="flex items-start justify-between gap-3 mb-3">
                                                {/* Info lebih lega: flex-1 + min-w-0 + truncate */}
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-slate-900 truncate">
                                                                {c.vet_name || 'Dokter Hewan'}
                                                            </p>
                                                            <p className="text-xs text-slate-600 truncate">{c.name}</p>
                                                            {c.vet_specialization && (
                                                                <p className="text-xs text-sky-600 mt-0.5">
                                                                    Spesialisasi: {c.vet_specialization}
                                                                </p>
                                                            )}
                                                            <p className="text-xs text-slate-500 mt-1">{vetPhone}</p>
                                                        </div>
                                                        {c.distance && (
                                                            <span className="shrink-0 inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-700">
                                                                {formatDistance(c.distance)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action buttons */}
                                            <div className="flex items-center gap-2">
                                                {/* Telepon */}
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <a
                                                            href={telHref}
                                                            aria-label={`Telepon ${c.vet_name}`}
                                                            className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 active:scale-[0.98]"
                                                        >
                                                            <Phone className="h-4 w-4 text-slate-900" />
                                                            <span className="text-xs font-medium">Telepon</span>
                                                        </a>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="bottom" align="center" className="z-[130] text-xs">
                                                        Telepon langsung
                                                    </TooltipContent>
                                                </Tooltip>

                                                {/* WhatsApp */}
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <a
                                                            href={waHref}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            aria-label={`WhatsApp ${c.vet_name}`}
                                                            className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg bg-[#25D366] hover:opacity-95 active:scale-[0.98]"
                                                        >
                                                            <MessageCircle className="h-4 w-4 text-white" />
                                                            <span className="text-xs font-medium text-white">WhatsApp</span>
                                                        </a>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="bottom" align="center" className="z-[130] text-xs">
                                                        Chat via WhatsApp
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </TooltipProvider>
                    )}
                </div>

                <div className="sticky bottom-0 w-full bg-white/95 px-5 pb-5 pt-3 backdrop-blur">
                    <DialogClose asChild>
                        <button
                            type="button"
                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-medium hover:bg-slate-50 active:scale-[0.98]"
                        >
                            Tutup
                        </button>
                    </DialogClose>
                </div>
            </DialogContent>
        </Dialog>
    );
}
