/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useSidebar } from "@/contexts/SidebarContext";
import { useRoute } from 'ziggy-js';
import { LogIn } from 'lucide-react';

export default function Topbar() {
    const route = useRoute();
    const { toggleSidebar, isOpen } = useSidebar();
    const [scrolled, setScrolled] = useState(false);
    const { auth } = usePage<{ auth: { user: any } }>().props;

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
            <div className='relative flex flex-row justify-between w-full h-12 items-center'>
                {/* Left: Sidebar Toggle */}
                <button onClick={toggleSidebar} className="w-10 h-full z-10">
                    <figure className='flex justify-center items-center'>
                        <img src="/images/icon/sidebar-outline.svg" alt="ResCat" className="h-full w-auto object-contain" />
                    </figure>
                </button>

                {/* Center: Logo (Absolute positioned) */}
                <Link href={route('home')} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-0">
                    <figure>
                        <img src="/images/icon/logo-rescat.svg" alt="ResCat" className="h-full w-auto object-contain" />
                    </figure>
                </Link>

                {/* Right: Conditional button */}
                {!auth?.user ? (
                    // Guest: Simple Login Button
                    <Link
                        href={route('login')}
                        className={`${isOpen ? 'pointer-events-none opacity-0' : ''} group relative px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out overflow-hidden z-10`}
                    >
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                        <span className="relative flex items-center gap-2 text-sm">
                            <LogIn className="w-4 h-4 animate-pulse" />
                            Login
                        </span>
                    </Link>
                ) : (
                    // Logged-in: Premium Button with original icon
                    <Link
                        href={route('dashboard')}
                        className="w-10 h-full hover:scale-110 transition-transform duration-200 z-10"
                    >
                        <figure className="flex justify-center items-center h-full">
                            <img 
                                src="/images/icon/premium-button.svg" 
                                alt="Premium" 
                                className="h-full w-auto object-contain hover:drop-shadow-lg transition-all duration-200" 
                            />
                        </figure>
                    </Link>
                )}
            </div>
        </nav>
    )
}
