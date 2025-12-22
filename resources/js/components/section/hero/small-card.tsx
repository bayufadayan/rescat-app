"use client"
import { Link, router } from '@inertiajs/react';
import React from 'react';
import { useRoute } from 'ziggy-js';

interface SmallCardProps {
    icon: string,
    title: string,
    description: string,
    href: string,
}

export default function SmallCard({ icon, title, description, href }: SmallCardProps) {
    const route = useRoute();
    return (
        <div
            className="group flex-1 rounded-lg p-4 text-white flex flex-col justify-between gap-1 relative overflow-hidden z-10 transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-green-500/20 cursor-pointer"
            onClick={() => router.visit(route(href))}
            style={{
                background: "rgba(255, 255, 255, 0)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(10px) saturate(150%)",
                WebkitBackdropFilter: "blur(12px) saturate(150%)",
                backgroundClip: "padding-box",
                WebkitBackgroundClip: "padding-box",
            }}
        >
            {/* Animated green accent blur - bergerak saat hover */}
            <div
                className="absolute left-[30px] bottom-[20px] w-full h-full rounded-full pointer-events-none -z-10 transition-transform duration-500 ease-out group-hover:translate-x-4 group-hover:translate-y-[-8px]"
                style={{
                    background: "rgba(30, 255, 0, 0.75)",
                    filter: "blur(80px)",
                }}
            />
            
            {/* Subtle border glow animation on hover */}
            <div 
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    background: "linear-gradient(135deg, rgba(30, 255, 0, 0.3), transparent 50%, rgba(30, 255, 0, 0.3))",
                    backgroundSize: "200% 200%",
                    animation: "borderShine 3s ease-in-out infinite",
                }}
            />
            
            <style>{`
                @keyframes borderShine {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
            `}</style>
            
            <figure className="w-10 h-10 bg-white shrink-0 rounded-full flex justify-center items-center transition-transform duration-200 group-hover:scale-110">
                <img src={icon} alt={`${title} icon`} className='w-6 h-6' />
            </figure>
            <h2 className="text-lg font-semibold">{title}</h2>
            <Link href={route(href)} className='flex justify-between items-center group-hover:gap-1 transition-all duration-200 cursor-pointer'>
                <p className="text-xs text-white/80 flex w-[85%]">{description}</p>
                <img src="/images/icon/arrow.svg" alt="Arrow" className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
        </div>
    )
}
