import React from "react";
import { router } from "@inertiajs/react";
import { useRoute } from "ziggy-js";

interface AuthLayoutProps {
    children?: React.ReactNode;
    title?: string;
    description?: string;
}

export default function AuthCustomLayout({
    children,
    title,
    description,
}: AuthLayoutProps ) {
    const route = useRoute();

    return (
        <main className='min-h-dvh h-dvh flex flex-col items-center bg-[linear-gradient(to_bottom,_#0091F3,_#21A6FF)] relative px-4'>
            <div className="absolute w-full h-full bg-[url('/images/background/pink-purple.png')] bg-cover bg-center bg-no-repeat mix-blend-soft-light opacity-60" />

            <button 
                onClick={() => router.visit(route('home'))}
                className='relative z-20 h-10 mt-10 mb-6 cursor-pointer hover:scale-105 transition-transform active:scale-95'
                type="button"
            >
                <img src="/images/icon/logo-rescat.svg" alt="ResCat" className="h-full w-auto object-contain" />
            </button>

            <div
                className="
                relative flex h-fit w-full max-w-lg items-center justify-between
                rounded-xl text-white overflow-hidden px-4 py-8
                "
                style={{
                    background: "rgba(255, 255, 255, 0)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    backdropFilter: "blur(3px) saturate(150%)",
                    WebkitBackdropFilter: "blur(12px) saturate(150%)",
                    backgroundClip: "padding-box",
                    WebkitBackgroundClip: "padding-box",
                }}
            >
                <style>{`
                    @keyframes liquid-move {
                        0%   { transform: translate(-15%, -10%) rotate(0deg) scale(1.05); }
                        50%  { transform: translate(8%, 5%) rotate(20deg)  scale(1.08); }
                        100% { transform: translate(-5%, 10%) rotate(-12deg) scale(1.02); }
                    }
                    @keyframes bubble {
                        0%   { transform: translateY(15%) scale(0.9); opacity: 0.25; }
                        50%  { transform: translateY(-10%) scale(1.05); opacity: 0.4; }
                        100% { transform: translateY(15%) scale(0.9); opacity: 0.25; }
                    }
                `}</style>

                <div aria-hidden style={{
                    position: "absolute",
                    inset: "-30% -40% auto auto",
                    width: "180%",
                    height: "220%",
                    background:
                        "radial-gradient(35% 35% at 45% 40%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.06) 50%, transparent 65%)",
                    filter: "blur(18px)",
                    mixBlendMode: "screen",
                    animation: "liquid-move 9s ease-in-out infinite alternate",
                    pointerEvents: "none",
                }} />

                {/* konten utama */}
                <div className="relative z-10 flex flex-col w-full items-center justify-between gap-4">
                    <div className="flex flex-col w-full gap-2">
                        <h2 className='text-2xl flex self-center text-center w-fit font-semibold'>{title}</h2>
                        {description && <p className='text-center text-sm px-4'>{description}</p>}
                    </div>

                    {children}
                </div>
            </div>
        </main>
    );
}
