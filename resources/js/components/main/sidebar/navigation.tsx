"use client";
import React from 'react';
import { Link } from '@inertiajs/react';
import navigationData from '@/constants/navigation-data';

export default function Navigation() {
    return (
        <nav className='flex flex-col w-full'>
            <ul className='flex flex-col w-full gap-0'>
                {
                    navigationData.map((item, index) => (
                        <Link href={item.href} key={index} className='p-2 hover:bg-blue-100 transition-all duration-300 ease-in-out'>
                            <li className='flex items-center gap-4 text-[#2C2C2C] px-4'>
                                <figure className='w-4 h-4'>
                                    <img src={item.icon} alt={item.title} className='w-full h-full object-center object-cover'/>
                                </figure>

                                <p className='flex flex-1 text-sm'>{item.title}</p>
                            </li>
                        </Link>
                    ))
                }
            </ul>
        </nav>
    )
}
