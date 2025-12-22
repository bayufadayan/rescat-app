"use client";
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import HeroSection from '@/components/section/hero/hero';
import LastCheck from '@/components/section/last-check/last-check';
import HistoryPreview from '@/components/section/history-preview/history-preview';
import Navigation from '@/components/main/navigation/navigation';

export default function MainPage() {

    return (
        <AppLayout>
            <HeroSection />
            <LastCheck />
            <HistoryPreview />
            <Navigation />  

            <div className="flex h-24 w-full relative bg-transparent" />
        </AppLayout>
    )
}
