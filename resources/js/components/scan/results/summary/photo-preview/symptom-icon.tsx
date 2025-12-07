import React from 'react'

type Props = {
    children: React.ReactNode
    onClick?: () => void
    status?: 'normal' | 'abnormal' | 'pending'
    active?: boolean
    label?: string
}

const statusClass: Record<NonNullable<Props['status']>, string> = {
    normal: 'border-emerald-400 shadow-emerald-200',
    abnormal: 'border-rose-400 shadow-rose-200 animate-[pulse_2s_ease-in-out_infinite]',
    pending: 'border-slate-200 text-slate-500',
}

export default function SymptomIcon({ children, onClick, status = 'pending', active = false, label }: Props) {
    return (
        <button
            type="button"
            aria-label={label}
            onClick={onClick}
            className={`bg-white aspect-square rounded-full p-1 border shadow flex items-center justify-center transition ${statusClass[status]} ${active ? 'ring-2 ring-sky-400' : ''}`}
        >
            <figure className='w-12 h-12 shrink-0 grow-0 flex'>
                {children}
            </figure>
        </button>
    )
}
