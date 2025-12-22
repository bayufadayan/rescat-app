"use client"
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import AuthenticatedSessionController from "@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController";
import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form } from "@inertiajs/react";
import { MdAccountCircle } from "react-icons/md";
import { GiPadlock } from "react-icons/gi";
import { IoCloseCircle } from "react-icons/io5";
import { FaGoogle } from "react-icons/fa";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { useRoute } from 'ziggy-js';
import { getGuestAvatarSeed, clearGuestAvatarSeed } from '@/lib/avatar-utils';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const route = useRoute();

    useEffect(() => {
        if (status) {
            toast.success(status);
        }
    }, [status]);

    useEffect(() => {
        return () => {
            setTimeout(() => {
                clearGuestAvatarSeed();
            }, 1000);
        };
    }, []);

    return (
        <AuthLayout
            title="Log in"
            description="Enter your email and password below to log in and access amazing features"
        >
            <Form {
                ...AuthenticatedSessionController.store.form()}
                resetOnSuccess={['password']}
                transform={(data) => ({
                    ...data,
                    avatar_seed: getGuestAvatarSeed(),
                })}
                className="flex flex-col gap-6 w-full ">
                {({ processing, errors }) => (
                    <div className="flex flex-col w-full gap-24">
                        <div className="grid gap-3">
                            <div className="grid gap-1 text-white">
                                <div className="relative">
                                    <div className="absolute text-white left-2 flex h-full items-center">
                                        <MdAccountCircle className="size-7" />
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
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="email@example.com"
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
                                        tabIndex={2}
                                        autoComplete="current-password"
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

                            {/* Reset Password */}
                            <div className="flex self-end">
                                {canResetPassword && (
                                    <TextLink
                                        href={request()}
                                        className="ml-auto text-sm hover:underline"
                                        tabIndex={3}
                                    >
                                        Forgot password?
                                    </TextLink>
                                )}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col w-full gap-4">
                            <div className="flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    className="w-full bg-white text-black py-5"
                                    disabled={processing}
                                    tabIndex={4}
                                    data-test="login-button">
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    Log in
                                </Button>

                                <Button
                                    type="button"
                                    onClick={() => window.location.href = route('google.redirect')}
                                    tabIndex={5}
                                    className="w-full border border-white/50 bg-white/10 text-white py-5 cursor-pointer">
                                    <FaGoogle />
                                    Log in with Google
                                </Button>
                            </div>

                            <div className="flex flex-row items-center justify-center gap-1 text-sm">
                                <span>Don't have an account?</span>
                                <TextLink href={register()} tabIndex={6} className="text-white underline underline-offset-4">
                                    Create one
                                </TextLink>
                            </div>
                        </div>
                    </div>
                )}
            </Form>
        </AuthLayout>
    );
}
