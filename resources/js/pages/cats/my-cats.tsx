import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { ArrowLeft, Cat, Plus, Search, Calendar, Dna } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'My Cats',
        href: '/cats',
    },
];

type CatData = {
    id: string;
    name: string;
    breed: string | null;
    gender: 'male' | 'female' | null;
    birth_date: string | null;
    avatar: string | null;
    scan_sessions_count: number;
    age: number | null;
};

type PageProps = {
    cats: CatData[];
};

export default function MyCats() {
    const { cats } = usePage<PageProps>().props;
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCats = cats.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.breed?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleViewCat = (catId: string) => {
        router.visit(`/cats/${catId}`);
    };

    return (
        <DashboardLayout breadcrumbs={breadcrumbs}>
            <Head title="My Cats" />
            
            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => router.visit('/dashboard')}
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-900">My Cats</h1>
                    </div>
                    <Button
                        onClick={() => router.visit('/cats/create')}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Cat
                    </Button>
                </div>

                {/* Search Bar */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search by name or breed..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4"
                    />
                </div>

                {/* Content */}
                <div>
                    {filteredCats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl bg-white shadow-sm border border-gray-100">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                <Cat className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {searchQuery ? 'No cats found' : 'No cats yet'}
                            </h3>
                            <p className="text-sm text-gray-600 text-center mb-6">
                                {searchQuery 
                                    ? 'Try searching with a different term' 
                                    : 'Add your first cat to start tracking their health'}
                            </p>
                            {!searchQuery && (
                                <Button
                                    onClick={() => router.visit('/cats/create')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Your First Cat
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredCats.map((cat) => (
                                <div
                                    key={cat.id}
                                    onClick={() => handleViewCat(cat.id)}
                                    className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 transition-all cursor-pointer overflow-hidden"
                                >
                                    <div className="flex items-center gap-4 p-4">
                                        {/* Avatar */}
                                        <div className="flex-shrink-0 w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                            {cat.avatar ? (
                                                <img
                                                    src={cat.avatar}
                                                    alt={cat.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Cat className="w-10 h-10 text-white" />
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                {cat.name}
                                            </h3>
                                            
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {cat.breed && (
                                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                                        <Dna className="w-3 h-3" />
                                                        <span>{cat.breed}</span>
                                                    </div>
                                                )}
                                                {cat.age !== null && (
                                                    <div className="flex items-center gap-1 text-xs text-gray-600">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{cat.age} {cat.age === 1 ? 'year' : 'years'} old</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-2 flex items-center gap-2">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                                    {cat.gender === 'male' ? '♂ Male' : cat.gender === 'female' ? '♀ Female' : 'Unknown'}
                                                </span>
                                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                                                    {cat.scan_sessions_count} {cat.scan_sessions_count === 1 ? 'scan' : 'scans'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                <svg
                                                    className="w-5 h-5 text-gray-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M9 5l7 7-7 7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
