/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { ChevronRight, ScanLine } from 'lucide-react';
import { scanSessionStorage, type StoredScanSession } from '@/lib/helper/scan-session-storage';
import axios from '@/lib/axios';

type PageProps = {
    auth?: {
        user: any;
    };
};

export default function LastCheck() {
    const { auth } = usePage<PageProps>().props;
    const [lastSession, setLastSession] = useState<StoredScanSession | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchLastSession = async () => {
            setIsLoading(true);
            console.log('🔍 [LastCheck] Fetching...', { hasUser: !!auth?.user, userId: auth?.user?.id });

            try {
                if (auth?.user) {
                    console.log('🔍 [LastCheck] User authenticated, fetching from API');
                    const response = await axios.get('/api/scan/sessions');
                    console.log('✅ [LastCheck] API Response:', response.data);
                    if (!cancelled) {
                        setLastSession(response.data.ok && response.data.sessions.length > 0 ? response.data.sessions[0] : null);
                    }
                } else {
                    console.log('🔍 [LastCheck] Guest mode, fetching from localStorage');
                    const sessionId = scanSessionStorage.getLatestSessionId();
                    if (!sessionId) {
                        console.log('⚠️ [LastCheck] No session ID in localStorage');
                        if (!cancelled) setLastSession(null);
                        return;
                    }

                    const response = await axios.get(`/api/scan/session/${sessionId}`);
                    console.log('✅ [LastCheck] Guest API Response:', response.data);
                    if (!cancelled && response.data.ok) {
                        setLastSession(response.data.session);
                    }
                }
            } catch (error) {
                console.error('❌ [LastCheck] Error fetching sessions:', error);
                if (!cancelled) setLastSession(null);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        fetchLastSession();

        return () => {
            cancelled = true;
        };
    }, [auth?.user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleViewResult = () => {
        if (lastSession) {
            router.visit(`/scan/results?session=${lastSession.id}`);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const getCheckupLabel = (type: string) => {
        const labels: Record<string, string> = {
            'general': 'General Check-up',
            'detail': 'Detail Check-up',
            'face_only': 'Face-Only Check-up',
        };
        return labels[type] || 'Check-up';
    };

    const getStats = () => {
        if (!lastSession?.results || lastSession.results.length === 0) return null;
        const normal = lastSession.results.filter((r: any) => {
            const lbl = (r.label || '').toString().toLowerCase();
            return lbl === 'healthy' || lbl === 'sehat' || lbl === 'normal';
        }).length;
        const total = lastSession.results.length;
        return {
            normal,
            abnormal: Math.max(total - normal, 0),
            remarks: lastSession.remarks,
        };
    };

    const stats = getStats();

    if (isLoading) {
        return (
            <section className="flex flex-col w-full gap-2 px-4">
                <div className='flex justify-between px-1'>
                    <h3 className="font-semibold text-lg">Last Check</h3>
                </div>
                <div className="flex items-center justify-center w-full h-86 rounded-2xl shadow-md bg-gray-100">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#0D99FF] border-t-transparent"></div>
                </div>
            </section>
        );
    }

    if (!lastSession) {
        return (
            <section className="flex flex-col w-full gap-2 px-4">
                <div className='flex justify-between px-1'>
                    <h3 className="font-semibold text-lg">Last Check</h3>
                </div>
                <div className="flex flex-col items-center justify-center w-full h-86 rounded-2xl shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200">
                    <ScanLine className="w-12 h-12 text-blue-300 mb-3" />
                    <p className="text-gray-600 font-medium mb-1">Belum ada scan</p>
                    <p className="text-sm text-gray-500 mb-4">Mulai scan pertama Anda sekarang</p>
                    <button
                        onClick={() => router.visit('/scan')}
                        className="px-6 py-2 bg-gradient-to-r from-[#0D99FF] to-[#0066cc] text-white rounded-xl font-medium hover:shadow-lg transition-all active:scale-[0.98]"
                    >
                        Mulai Scan
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="flex flex-col w-full gap-2 px-4">
            <div className='flex justify-between px-1'>
                <h3 className="font-semibold text-lg">Last Check</h3>
                <button 
                    onClick={handleViewResult}
                    className="flex gap-0.5 text-black/60 text-sm self-center items-center hover:text-[#0D99FF] transition-colors"
                >
                    Detail
                    <ChevronRight size={16} />
                </button>
            </div>

            <div 
                onClick={handleViewResult}
                className="flex flex-col gap-2 relative w-full h-86 rounded-2xl shadow-md overflow-hidden cursor-pointer group hover:shadow-xl transition-all"
            >
                {/* Background gradient */}
                <div className="w-full h-full inset-0 absolute bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600"></div>

                {/* Background image if available */}
                {(lastSession as any).image_url && (
                    <img 
                        src={(lastSession as any).image_url} 
                        alt="Scan result" 
                        className="w-full h-full inset-0 absolute object-cover opacity-20"
                    />
                )}

                {stats && (
                    <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-1 bg-white/20 backdrop-blur-md rounded-xl px-4 py-3 border border-white/30 shadow-md">
                        <div className="flex items-center gap-2 text-white text-sm font-semibold">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/80 text-white text-xs">Normal {stats.normal}</span>
                            <span className="px-2 py-0.5 rounded-full bg-rose-500/80 text-white text-xs">Abnormal {stats.abnormal}</span>
                        </div>
                        {stats.remarks && (
                            <p className="text-[12px] text-white/90 leading-snug">Catatan: {stats.remarks}</p>
                        )}
                    </div>
                )}

                <button 
                    onClick={handleViewResult}
                    className="absolute bottom-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all border border-white/30"
                >
                    <ChevronRight className="w-5 h-5 text-white" />
                </button>

                <div className='absolute top-4 left-4 right-4 flex flex-col gap-2'>
                    <div className='px-4 py-1 rounded-full bg-white/20 backdrop-blur-md shadow-lg border border-white/30 text-xs !font-normal w-fit'>
                        <span className="text-white text-xs">{getCheckupLabel(lastSession.checkup_type)}</span>
                    </div>
                    <div className='px-3 py-1 rounded-lg bg-black/20 backdrop-blur-sm text-xs text-white w-fit'>
                        {formatDate(lastSession.created_at)}
                    </div>
                </div>
            </div>
        </section>
    );
}
