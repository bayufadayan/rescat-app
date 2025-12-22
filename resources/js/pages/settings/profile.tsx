import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';

import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/dashboard-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { User, Mail, CheckCircle, AlertCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                    {/* Header */}
                    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <User className="w-6 h-6 text-blue-600" />
                            Profile Information
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            Update your name and email address
                        </p>
                    </div>

                    {/* Form */}
                    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 md:p-8">
                        <Form
                            {...ProfileController.update.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            className="space-y-6"
                        >
                            {({ processing, recentlySuccessful, errors }) => (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-gray-700 flex items-center gap-2 font-medium">
                                            <User className="w-4 h-4" />
                                            Name
                                        </Label>

                                        <Input
                                            id="name"
                                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            defaultValue={auth.user.name}
                                            name="name"
                                            required
                                            autoComplete="name"
                                            placeholder="Full name"
                                        />

                                        <InputError
                                            className="text-red-600"
                                            message={errors.name}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-gray-700 flex items-center gap-2 font-medium">
                                            <Mail className="w-4 h-4" />
                                            Email address
                                        </Label>

                                        <Input
                                            id="email"
                                            type="email"
                                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            defaultValue={auth.user.email}
                                            name="email"
                                            required
                                            autoComplete="username"
                                            placeholder="Email address"
                                        />

                                        <InputError
                                            className="text-red-600"
                                            message={errors.email}
                                        />
                                    </div>

                                    {mustVerifyEmail &&
                                        auth.user.email_verified_at === null && (
                                            <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                                                <div className="flex gap-2">
                                                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-yellow-800">
                                                            Your email address is unverified.{' '}
                                                            <Link
                                                                href={send()}
                                                                as="button"
                                                                className="underline hover:no-underline font-semibold"
                                                            >
                                                                Click here to resend the verification email.
                                                            </Link>
                                                        </p>

                                                        {status === 'verification-link-sent' && (
                                                            <div className="mt-2 text-sm font-medium text-green-700 flex items-center gap-1">
                                                                <CheckCircle className="w-4 h-4" />
                                                                A new verification link has been sent to your email address.
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    <div className="flex items-center gap-4 pt-2">
                                        <Button
                                            disabled={processing}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                            data-test="update-profile-button"
                                        >
                                            Save Changes
                                        </Button>

                                        <Transition
                                            show={recentlySuccessful}
                                            enter="transition ease-in-out"
                                            enterFrom="opacity-0"
                                            leave="transition ease-in-out"
                                            leaveTo="opacity-0"
                                        >
                                            <p className="text-sm text-green-600 flex items-center gap-1 font-medium">
                                                <CheckCircle className="w-4 h-4" />
                                                Saved
                                            </p>
                                        </Transition>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>

                    {/* Delete Account Section */}
                    <DeleteUser />
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
