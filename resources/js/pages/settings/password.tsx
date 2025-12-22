import PasswordController from '@/actions/App/Http/Controllers/Settings/PasswordController';
import InputError from '@/components/input-error';
import AppLayout from '@/layouts/dashboard-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/password';
import { Lock, CheckCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: edit().url,
    },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Password settings" />

            <SettingsLayout>
                <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                    {/* Header */}
                    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Lock className="w-6 h-6 text-blue-600" />
                            Update Password
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">Ensure your account is using a long, random password to stay secure</p>
                    </div>

                    {/* Form */}
                    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 md:p-8">
                        <Form
                            {...PasswordController.update.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            resetOnError={[
                                'password',
                                'password_confirmation',
                                'current_password',
                            ]}
                            resetOnSuccess
                            onError={(errors) => {
                                if (errors.password) {
                                    passwordInput.current?.focus();
                                }

                                if (errors.current_password) {
                                    currentPasswordInput.current?.focus();
                                }
                            }}
                            className="space-y-6"
                        >
                            {({ errors, processing, recentlySuccessful }) => (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="current_password" className="text-gray-700 flex items-center gap-2 font-medium">
                                            <Lock className="w-4 h-4" />
                                            Current password
                                        </Label>

                                        <Input
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            name="current_password"
                                            type="password"
                                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            autoComplete="current-password"
                                            placeholder="Current password"
                                        />

                                        <InputError
                                            className="text-red-600"
                                            message={errors.current_password}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-gray-700 flex items-center gap-2 font-medium">
                                            <Lock className="w-4 h-4" />
                                            New password
                                        </Label>

                                        <Input
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            type="password"
                                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            autoComplete="new-password"
                                            placeholder="New password"
                                        />

                                        <InputError className="text-red-600" message={errors.password} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password_confirmation" className="text-gray-700 flex items-center gap-2 font-medium">
                                            <Lock className="w-4 h-4" />
                                            Confirm password
                                        </Label>

                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                                            autoComplete="new-password"
                                            placeholder="Confirm password"
                                        />

                                        <InputError
                                            className="text-red-600"
                                            message={errors.password_confirmation}
                                        />
                                    </div>

                                    <div className="flex items-center gap-4 pt-2">
                                        <Button
                                            disabled={processing}
                                            className="bg-blue-600 hover:bg-blue-700 text-white"
                                            data-test="update-password-button"
                                        >
                                            Update Password
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
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
