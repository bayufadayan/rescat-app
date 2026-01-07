import React from 'react';
import { useRoute } from 'ziggy-js';

export default function BackToHome() {
    const route = useRoute();
    return (
        <button onClick={() => window.location.href = route('home')} className="w-full rounded-2xl bg-sky-600 py-3.5 text-white shadow-lg shadow-sky-600/30 active:scale-[0.98]">
            Kembali ke Beranda
        </button>
    )
}
