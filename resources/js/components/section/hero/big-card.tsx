import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';

export default function BigCard() {
    const route = useRoute();
    const data = {
        icon: "/images/icon/camera.svg",
        title: "Scan Foto Kucing",
        description: "Periksa foto kucing anda sekarang dengan teknologi AI yang terpercaya.",
        href: route('scan'),
    }

    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        if (loading) return;
        setLoading(true);
        router.visit(data.href, {
            onFinish: () => setLoading(false),
        });
    }

    return (
        <div
            className="flex-1 rounded-lg p-4 text-white flex flex-col justify-between z-10 overflow-hidden relative"
            style={{
                background: "rgba(255, 255, 255, 0)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(10px) saturate(150%)",
                WebkitBackdropFilter: "blur(12px) saturate(150%)",
                backgroundClip: "padding-box",
                WebkitBackgroundClip: "padding-box",
            }}
        >
            <div
                className="absolute left-[0px] bottom-[90px] w-full h-full rounded-full pointer-events-none -z-10"
                style={{
                    background: "rgba(168, 85, 247, 0.6)",
                    filter: "blur(80px)",
                }}
            />
            <div className="absolute w-full h-full bg-[url('/images/background/big-card-pattern.png')] -z-10 bg-cover bg-center bg-no-repeat inset-0 opacity-25" />
            <div className='flex flex-col gap-1'>
                <figure className="w-12 h-12 shrink-0 bg-white rounded-full flex justify-center items-center">
                    <img src={data.icon} alt={`${data.title} icon`} className='w-6 h-6' />
                </figure>
                <h2 className="text-2xl font-semibold">{data.title}</h2>
                <p className="text-xs text-white/80 mt-1">
                    {data.description}
                </p>
            </div>

            <button
                onClick={handleClick}
                disabled={loading}
                className={`relative mt-4 inline-flex items-center justify-center px-7 py-2 rounded-full border border-white/70 bg-white/10 text-white font-semibold backdrop-blur-md transition-all duration-250 overflow-hidden ${loading ? 'opacity-85 cursor-wait' : 'hover:scale-[1.03] hover:shadow-xl hover:bg-white/20 cursor-pointer'}`}
                style={{
                    boxShadow:
                        "-2px -2px 10px 0 rgba(255, 255, 255, 0.25) inset, 2px 2px 10px 0 rgba(255, 255, 255, 0.25) inset",
                }}
            >
                {/* Soft neon blue ring */}
                <span
                    className="pointer-events-none absolute inset-[-3px] rounded-full bg-[conic-gradient(from_0deg,_rgba(59,130,246,0.4),_rgba(59,130,246,0.12),_rgba(59,130,246,0.4))] opacity-70 blur-[2px] animate-[spin_5s_linear_infinite]"
                    aria-hidden
                />
                {/* Inner overlay to keep content crisp */}
                <span className="absolute inset-[2px] rounded-full bg-black/5 backdrop-blur-sm" aria-hidden />

                {loading ? (
                    <span className="relative flex items-center gap-2 text-sm">
                        <span className="h-4 w-4 border-2 border-white/70 border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                        Loading...
                    </span>
                ) : (
                    <span className="relative text-lg">Try Now</span>
                )}
            </button>
        </div>
    )
}
