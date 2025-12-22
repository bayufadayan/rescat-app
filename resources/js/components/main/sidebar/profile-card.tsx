"use client";
import React from 'react';
import { login } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import AvatarRandomProfile from '@/components/main/avatar-random/avatar-random-profile';
import { getGuestAvatarSeed, isAvatarUrl } from '@/lib/avatar-utils';
import { route } from 'ziggy-js';

type User = {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
};

type PageProps = {
    auth: {
        user: User | null;
    };
};

export default function ProfileCard() {
    const { auth } = usePage<PageProps>().props;
    // const route = useRoute();
    const user = auth?.user;
    const avatarSeed = user?.avatar && !isAvatarUrl(user.avatar) 
        ? user.avatar 
        : getGuestAvatarSeed();

    const avatarUrl = user?.avatar && isAvatarUrl(user.avatar) 
        ? user.avatar 
        : null;

    const displayName = user?.name || 'Guest';
    const catCount: number = 0;

    return (
        <div
            className='flex flex-col rounded-xl overflow-hidden'
            style={{
                background: "rgba(255, 255, 255, 0)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(10px) saturate(150%)",
                WebkitBackdropFilter: "blur(12px) saturate(150%)",
                backgroundClip: "padding-box",
                WebkitBackgroundClip: "padding-box",
            }}>
            <div className='flex gap-2 p-4 bg-transparent relative'>
                <div className="absolute w-full h-full bg-[url('/images/background/profile-card-bg.png')] bg-cover bg-center bg-no-repeat inset-0 -z-10 opacity-40" />
                
                <figure className='w-14 h-14 shrink-0 grow-0 rounded-full overflow-hidden bg-white'>
                    {avatarUrl ? (
                        <img 
                            src={avatarUrl} 
                            alt={displayName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <AvatarRandomProfile size={56} initialSeed={avatarSeed} />
                    )}
                </figure>

                <div className='flex flex-1 flex-col justify-center gap-1'>
                    <h4 className='font-semibold text-white truncate w-42'>{displayName}</h4>
                    <p className='!text-[10px] bg-white text-black px-2 rounded-full w-fit'>
                        {catCount} Cat Profile{catCount !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {!user ? (
                <div className='text-xs w-full justify-between text-white flex items-center px-4 py-2 bg-white/10'>
                    <p className='flex'>You're not logged in</p>

                    <Link href={login()} className='flex gap-1'>
                        <p>Login</p>
                        <ChevronRight size={16} />
                    </Link>
                </div>
            ) : (
                <div className='text-xs w-full justify-between text-white flex items-center px-4 py-2 bg-white/10'>
                    <p
                        className="flex"
                        style={{
                            maxWidth: '15ch',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {user.email}
                    </p>

                    <Link href={route('profile.edit')} className='flex gap-1'>
                        <p>My Profile</p>
                        <ChevronRight size={16} />
                    </Link>
                </div>
            )}
        </div>
    );
}
