// foto kucing besar
import React from 'react'

type Props = {
    src: string
    maskSrc?: string | null
    alt?: string
}

export default function SubjectPhotoCard({ src, maskSrc, alt = 'Hasil landmark' }: Props) {
    const maskImage = maskSrc ? `url(${maskSrc})` : undefined;

    return (
        <figure className='w-full h-full shrink-0 grow-0 flex relative'>
            <img 
                src={src} 
                alt={alt} 
                className='w-full h-full object-center object-cover' 
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
            />
            
            {/* Scan animation overlay */}
            {maskImage && (
                <>
                    <style>
                        {`
                            @keyframes scan-sweep {
                                0% { background-position: -60% 50%; }
                                100% { background-position: 160% 50%; }
                            }
                            @keyframes scan-pulse {
                                0%,100% { filter: brightness(1); }
                                50% { filter: brightness(1.25); }
                            }
                            @keyframes scan-glow {
                                0%,100% { opacity: .35; transform: scale(1); }
                                50% { opacity: .6; transform: scale(1.02); }
                            }
                        `}
                    </style>

                    <div
                        className="absolute inset-0 w-full h-full overflow-hidden"
                        aria-hidden="true"
                    >
                        <div
                            className="h-full w-full"
                            style={{
                                WebkitMaskImage: maskImage,
                                maskImage: maskImage,
                                WebkitMaskSize: "cover",
                                maskSize: "cover",
                                WebkitMaskRepeat: "no-repeat",
                                maskRepeat: "no-repeat",
                                WebkitMaskPosition: "center",
                                maskPosition: "center",
                                background:
                                    "linear-gradient(100deg, rgba(0,145,243,0) 0%, rgba(0,145,243,0.55) 40%, rgba(0,145,243,0.85) 50%, rgba(0,145,243,0.55) 60%, rgba(0,145,243,0) 100%)",
                                animation:
                                    "scan-sweep 2.4s linear infinite, scan-pulse 2.2s ease-in-out infinite",
                                backgroundSize: "220% 100%",
                                backgroundPosition: "-50% 50%",
                                mixBlendMode: "screen",
                            }}
                        />

                        <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                                WebkitMaskImage: maskImage,
                                maskImage: maskImage,
                                WebkitMaskSize: "cover",
                                maskSize: "cover",
                                WebkitMaskRepeat: "no-repeat",
                                maskRepeat: "no-repeat",
                                WebkitMaskPosition: "center",
                                maskPosition: "center",
                                background:
                                    "radial-gradient(60% 60% at 50% 50%, rgba(33,166,255,0.25) 0%, rgba(33,166,255,0.1) 50%, rgba(33,166,255,0) 100%)",
                                animation: "scan-glow 3.5s ease-in-out infinite",
                                mixBlendMode: "screen",
                            }}
                        />
                    </div>
                </>
            )}
        </figure>
    )
}
