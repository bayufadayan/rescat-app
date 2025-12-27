import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Calendar, Dna, Edit, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
};

const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

type ScanResultDetail = {
    area_name: string;
    label: string;
    confidence_score: number;
};

type ScanSession = {
    id: string;
    checkup_type: string;
    created_at: string;
    scan_images_count: number;
    results_count: number;
    image_url: string | null;
    remarks: string | null;
    results: ScanResultDetail[];
};

type CatData = {
    id: string;
    name: string;
    breed: string | null;
    gender: 'male' | 'female' | null;
    birth_date: string | null;
    avatar: string | null;
    age: number | null;
};

type PageProps = {
    cat: CatData;
    scanSessions: ScanSession[];
};

export default function CatDetail() {
    const { cat, scanSessions } = usePage<PageProps>().props;

    const handleEdit = () => {
        router.visit(`/cats/${cat.id}/edit`);
    };

    const handleDelete = () => {
        if (confirm(`Are you sure you want to delete ${cat.name}? This action cannot be undone.`)) {
            router.delete(`/cats/${cat.id}`);
        }
    };

    const handleViewResult = (sessionId: string) => {
        router.visit(`/scan/result/${sessionId}`);
    };

    return (
        <AppLayout>
            <Head title={cat.name} />
            
            <div className="flex flex-col w-full min-h-screen bg-[#EAF2F9] pb-24">
                {/* Header */}
                <div className="bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 px-4 pt-6 pb-8 shadow-lg">
                    <div className="flex items-center gap-3 mb-6 pt-14">
                        <button
                            onClick={() => router.visit('/cats')}
                            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-xl font-bold text-white">Cat Details</h1>
                    </div>

                    {/* Cat Info Card */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                        <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="flex-shrink-0 w-24 h-24 rounded-full overflow-hidden bg-white/20">
                                {cat.avatar ? (
                                    <img
                                        src={cat.avatar}
                                        alt={cat.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <FileText className="w-12 h-12 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h2 className="text-2xl font-bold text-white mb-2">{cat.name}</h2>
                                
                                <div className="space-y-2">
                                    {cat.breed && (
                                        <div className="flex items-center gap-2 text-white/90">
                                            <Dna className="w-4 h-4" />
                                            <span className="text-sm">{cat.breed}</span>
                                        </div>
                                    )}
                                    {cat.birth_date && (
                                        <div className="flex items-center gap-2 text-white/90">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-sm">
                                                {formatDate(cat.birth_date)}
                                                {cat.age !== null && ` (${cat.age} ${cat.age === 1 ? 'year' : 'years'} old)`}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-3 flex items-center gap-2">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/30">
                                        {cat.gender === 'male' ? '♂ Male' : cat.gender === 'female' ? '♀ Female' : 'Unknown'}
                                    </span>
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/30">
                                        {scanSessions.length} {scanSessions.length === 1 ? 'scan' : 'scans'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex gap-2">
                            <Button
                                onClick={handleEdit}
                                className="flex-1 bg-white/20 backdrop-blur-md text-white hover:bg-white/30 border border-white/30 rounded-full"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                            <Button
                                onClick={handleDelete}
                                className="flex-1 bg-red-500/80 backdrop-blur-md text-white hover:bg-red-600/80 border border-white/30 rounded-full"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Scan History */}
                <div className="px-4 py-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan History</h3>
                    
                    {scanSessions.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-md p-8 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="w-8 h-8 text-gray-400" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">No scan history yet</h4>
                            <p className="text-sm text-gray-600">
                                Scan sessions for this cat will appear here
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {scanSessions.map((session) => (
                                <div
                                    key={session.id}
                                    onClick={() => handleViewResult(session.id)}
                                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden"
                                >
                                    <div className="p-4">
                                        {/* Session Header */}
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-medium text-gray-900">
                                                {formatDate(session.created_at)}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {formatTime(session.created_at)}
                                            </span>
                                        </div>

                                        {/* Scan Results */}
                                        {session.results_count > 0 ? (
                                            <div className="space-y-3">
                                                <div className="flex gap-3">
                                                    {/* Scan Image */}
                                                    {session.image_url && (
                                                        <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                                                            <img
                                                                src={session.image_url}
                                                                alt="Scan"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Results */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="space-y-2">
                                                            {session.results.slice(0, 2).map((detail, index) => (
                                                                <div key={index} className="flex items-start justify-between gap-2">
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-medium text-gray-900 truncate">
                                                                            {detail.label}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500 truncate">
                                                                            {detail.area_name}
                                                                        </p>
                                                                    </div>
                                                                    <span className="flex-shrink-0 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                                                        {Math.round(detail.confidence_score)}%
                                                                    </span>
                                                                </div>
                                                            ))}
                                                            {session.results.length > 2 && (
                                                                <p className="text-xs text-gray-500">
                                                                    +{session.results.length - 2} more
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">Processing...</p>
                                        )}

                                        {/* View Details Arrow */}
                                        <div className="mt-3 flex justify-end">
                                            <div className="text-sm text-blue-600 font-medium flex items-center gap-1">
                                                View Details
                                                <svg
                                                    className="w-4 h-4"
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
        </AppLayout>
    );
}
