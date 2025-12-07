// foto kucing besar
import React from 'react'

type Props = {
    src: string
    alt?: string
}

export default function SubjectPhotoCard({ src, alt = 'Hasil landmark' }: Props) {
    return (
        <figure className='w-full h-full shrink-0 grow-0 flex'>
            <img src={src} alt={alt} className='w-full h-full object-center object-cover' />
        </figure>
    )
}
