import React from 'react';
import Topbar from '@/components/main/topbar/topbar';
import Sidebar from '@/components/main/sidebar/sidebar';
import { SidebarProvider } from "@/contexts/SidebarContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <main className="min-h-dvh h-full flex flex-col relative bg-[#EAF2F9]">
                <Topbar />
                <div className='flex flex-col w-full gap-4'>{children}</div>
                <Sidebar />
            </main>
        </SidebarProvider>
    )
}
