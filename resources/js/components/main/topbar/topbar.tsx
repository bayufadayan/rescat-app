import React, { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useSidebar } from "@/contexts/SidebarContext";
import { useRoute } from 'ziggy-js';

export default function Topbar() {
    const route = useRoute();
    const { toggleSidebar } = useSidebar();
    const [scrolled, setScrolled] = useState(false);
    const page = usePage();
    // `auth.user` follows Inertia shared props convention
    const user = (page.props as any).auth?.user ?? null;

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setScrolled(scrollPosition > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <nav
            className={`w-full fixed top-0 left-0 p-4 z-50 transition-all duration-1000 ease-in-out
                ${scrolled ? 'backdrop-blur-md shadow-md' : 'bg-transparent shadow-none backdrop-blur-none'}
            `}
        >
            <div className='flex flex-row justify-between w-full h-12 items-center'>
                <button onClick={toggleSidebar} className="w-10 h-full">
                    <figure className='flex justify-center items-center'>
                        <img src="/images/icon/sidebar-outline.svg" alt="ResCat" className="h-full w-auto object-contain" />
                    </figure>
                </button>

                <Link href={route('home')}>
                    <figure>
                        <img src="/images/icon/logo-rescat.svg" alt="ResCat" className="h-full w-auto object-contain" />
                    </figure>
                </Link>

                <div className="w-10 h-full flex items-center justify-center">
                    {/* If not logged in, show Login CTA with subtle pulse animation */}
                    {!user ? (
                        <Link
                            href={route('login')}
                            className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-800 shadow-sm hover:shadow-md transform transition-all duration-200 ease-in-out motion-safe:animate-pulse"
                        >
                            Login
                        </Link>
                    ) : (
                        /* Logged-in users see animated Premium button */
                        <Link
                            href={route('pricing')}
                            className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold shadow-md hover:shadow-xl transform transition-all duration-200 ease-in-out hover:-translate-y-0.5 motion-safe:animate-[pulse_2.2s_infinite]"
                        >
                            <img src="/images/icon/premium-button.svg" alt="Premium" className="h-5 w-auto mr-2" />
                            Premium
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
