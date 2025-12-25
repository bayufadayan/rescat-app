import React from 'react';
import { Link } from '@inertiajs/react';
import { Camera } from 'lucide-react';
import { useRoute } from 'ziggy-js';

export default function ScanAgainButton() {
    const route = useRoute();
    
    return (
        <Link
            href={route('scan.capture')}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-2xl text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
            <Camera className="w-5 h-5" />
            Scan Lagi
        </Link>
    );
}
