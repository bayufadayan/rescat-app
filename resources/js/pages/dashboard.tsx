import DashboardLayout from '@/layouts/dashboard-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { Cat, Scan, Heart, Plus, TrendingUp, Calendar, ChevronRight, BookOpen, Stethoscope } from 'lucide-react';
import { useRoute } from 'ziggy-js';

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
    stats: {
        cats_count: number;
        scans_count: number;
        health_score: number;
    };
    recent_scans: Array<{
        id: string;
        cat_name: string;
        created_at: string;
        results_count: number;
        has_abnormal: boolean;
    }>;
    recent_articles: Array<{
        id: number;
        slug: string;
        title: string;
        image: string;
        created_at: string;
    }>;
};

export default function Dashboard() {
    const route = useRoute();
    const { auth, stats, recent_scans, recent_articles } = usePage<PageProps>().props;
    const userName = auth?.user?.name || 'Guest';
    const firstName = userName.split(' ')[0];

    const quickActions = [
        {
            title: 'Scan Cat',
            description: 'Check your cat health',
            icon: Scan,
            color: 'bg-blue-500',
            hoverColor: 'hover:bg-blue-600',
            onClick: () => router.visit(route('scan.options')),
        },
        {
            title: 'Add Cat',
            description: 'Register new cat',
            icon: Cat,
            color: 'bg-green-500',
            hoverColor: 'hover:bg-green-600',
            onClick: () => router.visit(route('cats.create')),
        },
        {
            title: 'Pet Care',
            description: 'Find nearby vets',
            icon: Stethoscope,
            color: 'bg-purple-500',
            hoverColor: 'hover:bg-purple-600',
            onClick: () => router.visit(route('petcares')),
        },
    ];

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            
            <div className="flex h-full flex-1 flex-col gap-4 md:gap-6 p-4 md:p-6 bg-gray-50">
                {/* Welcome Section */}
                <div className="rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg p-5 md:p-8 text-white">
                    <h1 className="text-xl md:text-3xl font-bold mb-1 md:mb-2">
                        Welcome back, {firstName}! 👋
                    </h1>
                    <p className="text-blue-100 text-sm md:text-base">
                        Here's what's happening with your cats today
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl md:rounded-2xl bg-white shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-blue-50 p-2 md:p-3 rounded-lg">
                                <Cat className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.cats_count}</p>
                                <p className="text-xs md:text-sm text-gray-600">Total Cats</p>
                            </div>
                        </div>
                        {stats.cats_count === 0 && (
                            <button
                                onClick={() => router.visit(route('cats.create'))}
                                className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                                Add your first cat <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                        )}
                    </div>

                    <div className="rounded-xl md:rounded-2xl bg-white shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-green-50 p-2 md:p-3 rounded-lg">
                                <Scan className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.scans_count}</p>
                                <p className="text-xs md:text-sm text-gray-600">Scans Done</p>
                            </div>
                        </div>
                        {stats.scans_count === 0 && (
                            <button
                                onClick={() => router.visit(route('scan.options'))}
                                className="text-xs md:text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                            >
                                Start scanning <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                        )}
                    </div>

                    <div className="rounded-xl md:rounded-2xl bg-white shadow-sm border border-gray-100 p-4 md:p-6 hover:shadow-md transition-all duration-300 col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="bg-pink-50 p-2 md:p-3 rounded-lg">
                                <Heart className="w-5 h-5 md:w-6 md:h-6 text-pink-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.health_score}%</p>
                                <p className="text-xs md:text-sm text-gray-600">Health Score</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs md:text-sm">
                            <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                            <span className="text-green-600 font-medium">Good</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-xl md:rounded-2xl bg-white shadow-sm border border-gray-100 p-4 md:p-6">
                    <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Quick Actions</h2>
                    <div className="grid gap-2 md:gap-3 grid-cols-1 sm:grid-cols-3">
                        {quickActions.map((action, idx) => (
                            <button
                                key={idx}
                                onClick={action.onClick}
                                className={`${action.color} ${action.hoverColor} text-white rounded-lg md:rounded-xl p-3 md:p-4 flex items-center gap-3 transition-all duration-300 hover:shadow-lg active:scale-95`}
                            >
                                <action.icon className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                                <div className="text-left">
                                    <p className="font-semibold text-sm md:text-base">{action.title}</p>
                                    <p className="text-xs opacity-90">{action.description}</p>
                                </div>
                                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-auto flex-shrink-0" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-4 md:gap-6 lg:grid-cols-2">
                    {/* Recent Scans */}
                    <div className="rounded-xl md:rounded-2xl bg-white shadow-sm border border-gray-100 p-4 md:p-6">
                        <div className="flex items-center justify-between mb-3 md:mb-4">
                            <h2 className="text-base md:text-lg font-semibold text-gray-900">Recent Scans</h2>
                            <button
                                onClick={() => router.visit(route('history'))}
                                className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                                View all <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                        </div>
                        
                        {recent_scans.length === 0 ? (
                            <div className="py-8 md:py-12 text-center">
                                <div className="rounded-full bg-gray-50 p-3 md:p-4 w-12 h-12 md:w-16 md:h-16 mx-auto mb-3">
                                    <Scan className="w-full h-full text-gray-400" />
                                </div>
                                <p className="text-sm md:text-base text-gray-600 mb-2">No scans yet</p>
                                <button
                                    onClick={() => router.visit(route('scan.options'))}
                                    className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Start your first scan
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2 md:space-y-3">
                                {recent_scans.map((scan) => (
                                    <button
                                        key={scan.id}
                                        onClick={() => router.visit(`/scan/results?session=${scan.id}`)}
                                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <div className={`p-2 rounded-lg flex-shrink-0 ${scan.has_abnormal ? 'bg-red-50' : 'bg-green-50'}`}>
                                            <Scan className={`w-4 h-4 md:w-5 md:h-5 ${scan.has_abnormal ? 'text-red-600' : 'text-green-600'}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 text-sm md:text-base truncate">{scan.cat_name}</p>
                                            <p className="text-xs md:text-sm text-gray-500">{scan.results_count} results</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-xs text-gray-500">{scan.created_at}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Recent Articles */}
                    <div className="rounded-xl md:rounded-2xl bg-white shadow-sm border border-gray-100 p-4 md:p-6">
                        <div className="flex items-center justify-between mb-3 md:mb-4">
                            <h2 className="text-base md:text-lg font-semibold text-gray-900">Health Articles</h2>
                            <button
                                onClick={() => router.visit(route('articles'))}
                                className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                            >
                                View all <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                            </button>
                        </div>
                        
                        {recent_articles.length === 0 ? (
                            <div className="py-8 md:py-12 text-center">
                                <div className="rounded-full bg-gray-50 p-3 md:p-4 w-12 h-12 md:w-16 md:h-16 mx-auto mb-3">
                                    <BookOpen className="w-full h-full text-gray-400" />
                                </div>
                                <p className="text-sm md:text-base text-gray-600">No articles available</p>
                            </div>
                        ) : (
                            <div className="space-y-2 md:space-y-3">
                                {recent_articles.slice(0, 5).map((article) => (
                                    <button
                                        key={article.id}
                                        onClick={() => router.visit(`/articles/${article.slug}`)}
                                        className="w-full flex items-center gap-3 p-2 md:p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-12 h-12 md:w-16 md:h-16 rounded-lg object-cover flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900 text-sm md:text-base line-clamp-2">{article.title}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                <Calendar className="w-3 h-3 inline mr-1" />
                                                {article.created_at}
                                            </p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
