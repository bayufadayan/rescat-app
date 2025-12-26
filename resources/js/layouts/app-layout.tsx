import React, { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Topbar from '@/components/main/topbar/topbar';
import Sidebar from '@/components/main/sidebar/sidebar';
import { SidebarProvider } from "@/contexts/SidebarContext";
import { transferGuestSessions } from '@/lib/helper/transfer-sessions';

type PageProps = {
    auth?: {
        user: any;
    };
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage<PageProps>().props;

    // Auto-transfer guest sessions when user logs in
    useEffect(() => {
        if (auth?.user) {
            transferGuestSessions().catch(console.error);
        }
    }, [auth?.user]);

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
