import React from 'react';

export default function IconPlaceholder({
    children,
    onClick = () => { },
    ariaLabel = 'button',
    disabled = false,
}: {
    children: React.ReactNode;
    onClick?: () => void;
    ariaLabel?: string;
    disabled?: boolean;
}) {
    return (
        <button 
            className={`rounded-full relative p-2 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`} 
            onClick={disabled ? undefined : onClick} 
            type="button" 
            aria-label={ariaLabel}
            disabled={disabled}
        >
            <figure className="h-5 w-5 flex shrink-0 grow-0 overflow-hidden">
                {children}
            </figure>
        </button>
    );
}