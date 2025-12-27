import React from "react";

type Props = {
    label: string;
    image?: string | null;
    status?: string | null;
    active?: boolean;
    onClick?: () => void;
};

const statusClass = (value?: string | null) => {
    if (!value) return 'text-slate-500';
    return value.toLowerCase() === 'abnormal' ? 'text-rose-500' : 'text-emerald-600';
};

const statusLabel = (value?: string | null) => {
    if (!value) return 'Pending';
    return value.toLowerCase() === 'abnormal' ? 'Abnormal' : 'Normal';
};

export default function ThumbTabItem({ label, image, status, active = false, onClick }: Props) {
    return (
        <button
            type="button"
            className={`shrink-0 snap-start w-[120px] h-[90px] rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${
                active 
                    ? 'ring-2 ring-sky-500 shadow-lg shadow-sky-500/30 scale-105 bg-gradient-to-br from-sky-50 to-blue-50' 
                    : 'ring-1 ring-black/5 bg-neutral-100 hover:shadow-md hover:ring-black/10 hover:scale-[1.02]'
            }`}
            role="tab"
            aria-pressed={active}
            onClick={onClick}
        >
            <div className="relative w-full h-full">
                {image ? (
                    <img 
                        src={image} 
                        alt={label} 
                        className={`w-full h-full object-cover transition-all duration-300 ${active ? 'brightness-110' : ''}`}
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                    />
                ) : (
                    <div className="w-full h-full bg-slate-200 grid place-items-center text-xs text-slate-500">
                        Tidak ada foto
                    </div>
                )}
                <div className={`absolute inset-x-1 bottom-1 flex items-center justify-between rounded-xl px-2 py-1 text-[10px] text-white transition-all duration-300 ${
                    active ? 'bg-gradient-to-r from-sky-600/90 to-blue-600/90' : 'bg-black/60'
                }`}>
                    <span className="font-medium truncate mr-2">{label}</span>
                    <span className={`font-semibold uppercase ${statusClass(status)}`}>
                        {statusLabel(status)}
                    </span>
                </div>
            </div>
        </button>
    );
}
