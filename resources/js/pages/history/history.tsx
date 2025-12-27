/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import Navigation from '@/components/main/navigation/navigation';
import { router, usePage } from '@inertiajs/react';
import { ChevronRight, Clock } from 'lucide-react';
import { scanSessionStorage, type StoredScanSession } from '@/lib/helper/scan-session-storage';
import axios from '@/lib/axios';

type PageProps = {
    auth?: {
        user: any;
    };
};

export default function History() {
    const { auth } = usePage<PageProps>().props;
    const [sessions, setSessions] = useState<StoredScanSession[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const fetchSessions = async () => {
            setIsLoading(true);

            try {
                if (auth?.user) {
                    const response = await axios.get('/api/scan/sessions');
                    if (!cancelled) {
                        setSessions(response.data.ok ? response.data.sessions : []);
                    }
                } else {
                    const sessionIds = scanSessionStorage.getSessionIds();
                    if (sessionIds.length === 0) {
                        if (!cancelled) setSessions([]);
                        return;
                    }

                    const sessionPromises = sessionIds.map((id) =>
                        axios.get(`/api/scan/session/${id}`).then((res) => res.data.ok ? res.data.session : null)
                    );
                    const results = await Promise.all(sessionPromises);
                    if (!cancelled) {
                        setSessions(results.filter(Boolean));
                    }
                }
            } catch (error) {
                console.error('Error fetching sessions:', error);
                if (!cancelled) setSessions([]);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        fetchSessions();

        return () => {
            cancelled = true;
        };
    }, [auth?.user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const getStats = (session: StoredScanSession) => {
        if (!session.results || session.results.length === 0) return { normal: 0, abnormal: 0, remarks: session.remarks };
        const normal = session.results.filter((r: any) => {
            const lbl = (r.label || '').toString().toLowerCase();
            return lbl === 'healthy' || lbl === 'sehat' || lbl === 'normal';
        }).length;
        const total = session.results.length;
        return { normal, abnormal: Math.max(total - normal, 0), remarks: session.remarks };
    };

    const handleViewSession = (sessionId: string) => {
        router.visit(`/scan/results?session=${sessionId}`);
    };

    return (
        <AppLayout>
            <div className="flex flex-col w-full min-h-screen pb-24">
                {/* Header */}
                <div className="sticky top-0 z-10 px-4 py-6 pt-20 pb-8 rounded-b-2xl text-white bg-[linear-gradient(to_bottom,_#0091F3,_#21A6FF)] overflow-hidden">
                    <div className="absolute w-full h-full bg-[url('/images/background/pink-purple.png')] bg-cover bg-center bg-no-repeat inset-0 mix-blend-soft-light" />
                    <div className="relative z-10">
                        <h1 className="text-2xl font-bold">Riwayat Scan</h1>
                        <p className="text-sm text-white/90 mt-1">Semua riwayat pemeriksaan kesehatan kucing Anda</p>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 px-4 py-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center w-full py-16">
                            <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#0D99FF] border-t-transparent"></div>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center w-full py-16 px-4 rounded-2xl bg-gray-50">
                            <Clock className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-lg font-medium text-gray-700 mb-1">Belum ada riwayat scan</p>
                            <p className="text-sm text-gray-500 text-center">Mulai scan pertama Anda untuk melihat riwayat di sini</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 w-full">
                            <p className="text-sm text-gray-600 px-1">
                                Total: <span className="font-semibold text-gray-900">{sessions.length} pemeriksaan</span>
                            </p>
                            <ul className='flex flex-col gap-3 w-full'>
                                {sessions.map((session) => {
                                    const stats = getStats(session);
                                    
                                    return (
                                        <li key={session.id}>
                                            <button
                                                onClick={() => handleViewSession(session.id)}
                                                className='p-3 rounded-2xl overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 w-full flex justify-between items-center gap-3 hover:from-blue-100 hover:to-indigo-100 transition-all border border-blue-100 hover:shadow-md'
                                            >
                                                <div className='flex flex-1 gap-3 items-center'>
                                                    {/* Thumbnail or health score circle */}
                                                    {(session as any).image_url ? (
                                                        <div className='w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm'>
                                                            <img 
                                                                src={(session as any).image_url} 
                                                                alt="Scan" 
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className='w-14 h-14 rounded-full bg-gradient-to-br from-[#0D99FF] to-[#0066cc] flex items-center justify-center flex-shrink-0'>
                                                            <span className="text-white text-xs leading-tight text-center">
                                                                N/A
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div className='flex flex-col gap-1 justify-center text-left flex-1 min-w-0'>
                                                        <h5 className='font-semibold text-gray-900 truncate'>
                                                            {session.checkup_type === 'general' ? 'General Check-up' : 
                                                             session.checkup_type === 'detail' ? 'Detail Check-up' : 
                                                             'Face-Only Check-up'}
                                                        </h5>
                                                        <p className="text-xs text-gray-600 truncate">
                                                            {formatDate(session.created_at)}
                                                        </p>
                                                        <p className="text-xs text-gray-700 truncate flex gap-2">
                                                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Normal {stats.normal}</span>
                                                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">Abnormal {stats.abnormal}</span>
                                                        </p>
                                                        {stats.remarks && (
                                                            <p className="text-[11px] text-gray-500 truncate">Catatan: {stats.remarks}</p>
                                                        )}
                                                        {session.results_count > 0 && (
                                                            <p className="text-xs text-blue-600 font-medium">
                                                                {session.results_count} area scanned
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className='p-2 rounded-full flex items-center justify-center bg-white/50'>
                                                    <ChevronRight size={20} className="text-gray-600" />
                                                </div>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <Navigation />
        </AppLayout>
    );
}
