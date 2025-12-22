import React, { useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Loader } from "lucide-react";
import LottiePlayer from '@/components/lottie/LottiePlayer';

export default function Splash() {
    useEffect(() => {
        const timer = setTimeout(() => {
            router.post('/set-splash', {}, {
                onSuccess: () => router.visit('/')
            })
        }, 1200)

        return () => clearTimeout(timer)
    }, [])

    return (
        <main className='min-h-dvh w-full flex items-center justify-center bg-[linear-gradient(to_bottom,_#0091F3,_#21A6FF)] relative'>
            <div className="absolute w-full h-full bg-[url('/images/background/pink-purple.png')] bg-cover bg-center bg-no-repeat mix-blend-soft-light" />
            <div className="min-h-dvh w-full flex flex-col justify-between py-4 px-8">
                <p className='text-center text-xs text-white'>Cat Health Detection System</p>
                <figure className='flex items-center justify-center flex-col relative'>
                    <LottiePlayer src="/animations/logo-shining.lottie" />
                    <Loader className="absolute h-6 w-6 animate-spin text-white bottom-8" />
                </figure>
                <p className='text-center text-xs text-white'>
                    v.{import.meta.env.VITE_APP_VERSION}
                </p>
            </div>
        </main>
    )
}
