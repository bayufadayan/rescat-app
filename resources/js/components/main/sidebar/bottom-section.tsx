import React from 'react';

import { login } from '@/routes';
import { FaGoogle } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import TextLink from '@/components/text-link';
import { router, usePage } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';
import { LogOut } from 'lucide-react';

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

export default function BottomSection() {
    const route = useRoute();
    const { auth } = usePage<PageProps>().props;
    const user = auth?.user;

    const handleLogout = () => {
        router.post(route('logout'));
    };

    // Jika sudah login, tampilkan tombol Logout
    if (user) {
        return (
            <div className="flex flex-col gap-2 px-2">
                <Button
                    type="button"
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white py-5 flex items-center justify-center gap-2"
                    tabIndex={5}
                >
                    <LogOut size={18} />
                    Logout
                </Button>
            </div>
        );
    }

    // Jika belum login, tampilkan Sign up & Login
    return (
        <div className="flex flex-col gap-2 px-2">
            <Button
                type="submit"
                className="w-full bg-[#0091F3] text-white py-5"
                tabIndex={5}
                onClick={() => { router.visit('register') }}
            >
                Sign up
            </Button>

            <Button
                type='button'
                onClick={() => window.location.href = route('google.redirect')}
                className="w-full border border-black/50 bg-white/10 text-black py-5 hover:cursor-pointer"
                tabIndex={6}>
                <FaGoogle />
                Sign up with Google
            </Button>
            <div className="flex flex-row items-center justify-center text-xs gap-1 text-[#2C2C2C]/50">
                <span>Already have an account?</span>
                <TextLink
                    href={login()}
                    tabIndex={7}
                    className="underline underline-offset-4">
                    Log in
                </TextLink>
            </div>
        </div>
    );
}
