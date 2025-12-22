import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import { type BreadcrumbItem } from '@/types';

import AppLayout from '@/layouts/dashboard-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit as editAppearance } from '@/routes/appearance';
import { Palette } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: editAppearance().url,
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                    {/* Header */}
                    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Palette className="w-6 h-6 text-blue-600" />
                            Appearance Settings
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">Update your account's appearance settings</p>
                    </div>

                    {/* Content */}
                    <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 md:p-8">
                        <AppearanceTabs />
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
