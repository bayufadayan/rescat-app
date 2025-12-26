import React, { useMemo, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import ResultHeader from '@/components/scan/results/main/header';
import HeaderNavigation from '@/components/scan/results/main/header-navigation';
import WarningBanner from '@/components/scan/results/main/waning-banner';
import PhotoViewer from '@/components/scan/results/summary/photo-viewer';
import AnalysisResultCard from '@/components/scan/results/summary/analysis-result-card';
import BackToHome from '@/components/scan/results/main/back-to-home-button';
import ScanAgainButton from '@/components/scan/results/main/scan-again-button';
import ThumbTabs from '@/components/scan/results/detail/thumb-tabs';
import MediaInspectionCard from '@/components/scan/results/detail/media-inspection-card';
import AnalysisTile from '@/components/scan/results/detail/analysis-tile';
import ChartCard from '@/components/scan/results/history/chart-card';
import { useRoute } from 'ziggy-js';
import { ScanResultProvider } from '@/contexts/scan-result-context';
import { scanSessionStorage } from '@/lib/helper/scan-session-storage';
import type { ScanResultPayload, ScanSessionPayload } from '@/types/scan-result';

type ScanResultsPageProps = {
    session: ScanSessionPayload;
    result: ScanResultPayload | null;
    catId?: string | null;
    historyData?: Array<{
        date: string;
        normalCount: number;
        totalCount: number;
        percentage: number;
    }>;
    auth?: {
        user: {
            id: string;
            name: string;
            email: string;
        } | null;
    };
};

export default function ScanResults() {
    const route = useRoute();
    const { session, result, catId, historyData, auth } = usePage<ScanResultsPageProps>().props;
    const params = new URLSearchParams(window.location.search);
    const tab = (params.get('tabs') as 'summary' | 'details' | 'history') ?? 'summary';
    const resultsBaseUrl = useMemo(() => `${route('scan.results')}?session=${session.id}`, [route, session.id]);

    // Save session ID to localStorage for guest users
    useEffect(() => {
        if (!auth?.user && session) {
            scanSessionStorage.saveSessionId(session.id);
        }
    }, [session, auth]);

    const changeTab = (next: 'summary' | 'details' | 'history') => {
        const url = `${resultsBaseUrl}&tabs=${next}`;
        router.visit(url, { preserveScroll: true, preserveState: true, replace: true });
    };

    return (
        <AppLayout>
            <ScanResultProvider session={session} result={result ?? null}>
                <div className="flex flex-col bg-white w-full min-h-screen relative pb-12 gap-4">
                    <div className="flex flex-col w-full relative">
                        <ResultHeader />
                        <div className="w-full flex justify-center items-center px-4 absolute bottom-0">
                            <HeaderNavigation tab={tab} onTabChange={changeTab} />
                        </div>
                    </div>

                    {/* === TAB CONTENT === */}
                    {tab === 'summary' && (
                        <div className="flex flex-col px-4 gap-4">
                            <WarningBanner />
                            <ScanAgainButton />
                            <PhotoViewer />
                            <AnalysisResultCard />
                            <BackToHome />
                        </div>
                    )}

                    {tab === 'details' && (
                        <div className="flex flex-col gap-4 w-full mt-6">
                            <div className="px-4">
                                <ScanAgainButton />
                            </div>
                            <ThumbTabs />
                            <div className="px-4 flex flex-col justify-center gap-4 w-full items-center">
                                <MediaInspectionCard />
                                <AnalysisTile />
                            </div>
                            <div className="px-4">
                                <BackToHome />
                            </div>
                        </div>
                    )}

                    {tab === 'history' && (
                        <div className="flex flex-col gap-4 px-4 w-full mt-6">
                            <ScanAgainButton />
                            <ChartCard catId={catId} historyData={historyData} />
                            <BackToHome />
                        </div>
                    )}
                </div>
            </ScanResultProvider>
        </AppLayout>
    );
}
