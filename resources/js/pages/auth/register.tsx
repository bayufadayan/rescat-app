import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AuthLayout from '@/layouts/auth-layout';
import { MdAccountCircle } from "react-icons/md";
import { GiPadlock } from "react-icons/gi";
import { IoCloseCircle } from "react-icons/io5";
import { FaGoogle } from "react-icons/fa";
import { LoaderCircle } from "lucide-react";
import { MdAlternateEmail } from "react-icons/md";
import { cn } from "@/lib/utils";
import { useRoute } from 'ziggy-js';
import { getGuestAvatarSeed, clearGuestAvatarSeed } from '@/lib/avatar-utils';
import { useEffect } from 'react';
import { scanSessionStorage } from '@/lib/helper/scan-session-storage';

export default function Signup() {
    const route = useRoute();

    // Clear guest seed setelah berhasil register
    useEffect(() => {
        return () => {
            // Cleanup ketika unmount setelah register sukses
            const timer = setTimeout(() => {
                clearGuestAvatarSeed();
            }, 1000);
            return () => clearTimeout(timer);
        };
    }, []);

    return (
        <AuthLayout
            title="Sign up"
            description="Enter your details below to create your account and access the features."
        >
            <Form
                {...RegisteredUserController.store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                onSuccess={() => {
                    // Clear scan sessions after successful register
                    scanSessionStorage.clearSessions();
                }}
                onBefore={() => {
                    // Inject avatar seed sebelum submit
                    const seed = getGuestAvatarSeed();
                    // Set via transform di form data
                    return true;
                }}
                transform={(data) => ({
                    ...data,
                    avatar_seed: getGuestAvatarSeed(),
                    session_ids: scanSessionStorage.getSessionIds(),
                })}
                className="flex flex-col gap-6 w-full ">
                {({ processing, errors }) => (
                    <div className="flex flex-col w-full gap-8">
                        <div className="grid gap-3">
                            {/* Full Name */}
                            <div className="grid gap-1 text-white">
                                <div className="relative">
                                    <div className="absolute text-white left-2 flex h-full items-center">
                                        <MdAccountCircle className="size-7" />
                                    </div>
                                    {errors.name && (
                                        <div className="absolute text-red-500 right-3 flex h-full items-center">
                                            <IoCloseCircle className="size-6" />
                                        </div>
                                    )}
                                    <Input
                                        id="name"
                                        type="text"
                                        name="name"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        placeholder="Full name"
                                        className={cn(
                                            "border border-white pl-11 pr-10 py-5 text-sm rounded-full placeholder:text-white bg-white/15 backdrop-blur-md",
                                            errors.name
                                                ? "border-red-400 focus-visible:ring-2 focus-visible:ring-red-200"
                                                : "focus-visible:ring-white/10 focus-visible:border-white"
                                        )}
                                    />
                                </div>
                                <InputError message={errors.name} className="text-xs font-medium" />
                            </div>

                            {/* Email */}
                            <div className="grid gap-1 text-white">
                                <div className="relative">
                                    <div className="absolute text-white left-2 flex h-full items-center">
                                        <MdAlternateEmail className='size-6' />
                                    </div>
                                    {errors.email && (
                                        <div className="absolute text-red-500 right-3 flex h-full items-center">
                                            <IoCloseCircle className="size-6" />
                                        </div>
                                    )}
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={2}
                                        autoComplete="email"
                                        placeholder="email@rescat.life"
                                        className={cn(
                                            "border border-white pl-11 pr-10 py-5 text-sm rounded-full placeholder:text-white bg-white/15 backdrop-blur-md",
                                            errors.email
                                                ? "border-red-400 focus-visible:ring-2 focus-visible:ring-red-200"
                                                : "focus-visible:ring-white/10 focus-visible:border-white"
                                        )}
                                    />
                                </div>
                                <InputError message={errors.email} className="text-xs font-medium" />
                            </div>

                            {/* Password */}
                            <div className="grid gap-1 text-white">
                                <div className="relative">
                                    <div className="absolute text-white left-2.5 flex h-full items-center">
                                        <GiPadlock className="size-7" />
                                    </div>
                                    {errors.password && (
                                        <div className="absolute text-red-500 right-3 flex h-full items-center">
                                            <IoCloseCircle className="size-6" />
                                        </div>
                                    )}
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        placeholder="password"
                                        className={cn(
                                            "border border-white pl-11 pr-10 py-5 text-sm rounded-full placeholder:text-white bg-white/15 backdrop-blur-md",
                                            errors.password
                                                ? "border-red-400 focus-visible:ring-2 focus-visible:ring-red-200"
                                                : "focus-visible:ring-white/10 focus-visible:border-white"
                                        )}
                                    />
                                </div>
                                <InputError message={errors.password} className="text-xs font-medium" />
                            </div>

                            {/* Confirm Password */}
                            <div className="grid gap-1 text-white">
                                <div className="relative">
                                    <div className="absolute text-white left-2.5 flex h-full items-center">
                                        <GiPadlock className="size-7" />
                                    </div>
                                    {errors.password_confirmation && (
                                        <div className="absolute text-red-500 right-3 flex h-full items-center">
                                            <IoCloseCircle className="size-6" />
                                        </div>
                                    )}
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        required
                                        tabIndex={4}
                                        placeholder="Confirm password"
                                        autoComplete="new-password"
                                        className={cn(
                                            "border border-white pl-11 pr-10 py-5 text-sm rounded-full placeholder:text-white bg-white/15 backdrop-blur-md",
                                            errors.password_confirmation
                                                ? "border-red-400 focus-visible:ring-2 focus-visible:ring-red-200"
                                                : "focus-visible:ring-white/10 focus-visible:border-white"
                                        )}
                                    />
                                </div>
                                <InputError message={errors.password_confirmation} className="text-xs font-medium" />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col w-full gap-4">
                            <div className="flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    className="w-full bg-white text-black py-5"
                                    tabIndex={5}
                                    disabled={processing}>
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Sign up
                                </Button>

                                <Button
                                    type='button'
                                    onClick={() => window.location.href = route('google.redirect')}
                                    className="w-full border border-white/50 bg-white/10 text-white py-5 hover:cursor-pointer"
                                    tabIndex={6}>
                                    <FaGoogle />
                                    Sign up with Google
                                </Button>
                            </div>

                            <div className="flex flex-row items-center justify-center text-sm gap-1">
                                <span>Already have an account?</span>
                                <TextLink
                                    href={login()}
                                    tabIndex={7}
                                    className="text-white underline underline-offset-4">
                                    Log in
                                </TextLink>
                            </div>
                        </div>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
