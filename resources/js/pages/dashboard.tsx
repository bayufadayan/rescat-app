import DashboardLayout from '@/layouts/dashboard-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Cat, Scan, FileText, Heart } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type PageProps = {
    auth: {
        user: {
            name: string;
        } | null;
    };
};

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;
    const userName = auth?.user?.name || 'Guest';
    const firstName = userName.split(' ')[0];

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Welcome Section */}
                <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 md:p-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {firstName}! 👋
                    </h1>
                    <p className="text-gray-600 text-sm md:text-base">
                        Here's what's happening with your cats today
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                    {[
                        { icon: Cat, label: 'Total Cats', value: '0', color: 'bg-blue-50', iconColor: 'text-blue-600' },
                        { icon: Scan, label: 'Scans Done', value: '0', color: 'bg-green-50', iconColor: 'text-green-600' },
                        { icon: FileText, label: 'Articles Read', value: '0', color: 'bg-purple-50', iconColor: 'text-purple-600' },
                        { icon: Heart, label: 'Health Score', value: '100%', color: 'bg-pink-50', iconColor: 'text-pink-600' },
                    ].map((stat, idx) => (
                        <div
                            key={idx}
                            className={`rounded-2xl ${stat.color} p-4 md:p-6 hover:shadow-md transition-all duration-300 border border-gray-100`}
                        >
                            <stat.icon className={`w-6 h-6 md:w-8 md:h-8 mb-2 ${stat.iconColor}`} />
                            <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                            <p className="text-xs md:text-sm text-gray-600 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 md:p-8 min-h-[400px] flex flex-col items-center justify-center">
                    <div className="rounded-full bg-gray-50 p-6 mb-4">
                        <Cat className="w-12 h-12 md:w-16 md:h-16 text-gray-400" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 text-center">
                        No cats yet
                    </h3>
                    <p className="text-sm md:text-base text-gray-600 text-center max-w-md">
                        Start by adding your first cat profile or scan for health check
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
