import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
    tab: 'summary' | 'details' | 'history';
    onTabChange: (next: 'summary' | 'details' | 'history') => void;
};

export default function HeaderNavigation({ tab, onTabChange }: Props) {
    const order: ('summary' | 'details' | 'history')[] = ['summary', 'details', 'history'];
    const index = order.indexOf(tab);
    const prev = index > 0 ? order[index - 1] : null;
    const next = index < order.length - 1 ? order[index + 1] : null;

    const buttonClass =
        'w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-200 hover:bg-neutral-300 transition-all shadow-sm active:scale-95';
    const iconClass = 'w-6 h-6 text-black';

    const titleMap = {
        summary: 'Ringkasan',
        details: 'Detail',
        history: 'Riwayat',
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl h-15 w-full relative translate-y-1/2 text-black overflow-hidden flex justify-between items-center px-3 py-2">
            <button
                className={buttonClass}
                onClick={() => prev && onTabChange(prev)}
                disabled={!prev}
                style={{ opacity: prev ? 1 : 0.4, pointerEvents: prev ? 'auto' : 'none' }}
            >
                <ChevronLeft className={iconClass} />
            </button>

            <h3 className="text-base font-semibold tracking-wide select-none">
                {titleMap[tab]}
            </h3>

            <button
                className={buttonClass}
                onClick={() => next && onTabChange(next)}
                disabled={!next}
                style={{ opacity: next ? 1 : 0.4, pointerEvents: next ? 'auto' : 'none' }}
            >
                <ChevronRight className={iconClass} />
            </button>
        </div>
    );
}
