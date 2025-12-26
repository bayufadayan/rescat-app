import React from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { ArrowLeft, Calendar, User, BookOpen, Share2 } from 'lucide-react';

type Article = {
    id: number;
    title: string;
    slug: string;
    content: string;
    author_id: number;
    created_at: string;
    author?: {
        name: string;
        email: string;
    };
};

type ArticleDetailProps = {
    article: Article;
};

export default function ArticleDetail() {
    const { article } = usePage<ArticleDetailProps>().props;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const goBack = () => {
        router.visit('/articles');
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: article.title,
                    url: url
                });
            } catch {
                // Share cancelled
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(url);
            alert('Link artikel disalin ke clipboard!');
        }
    };

    // Parse markdown-style content
    const renderContent = (content: string) => {
        const lines = content.split('\n');
        const elements: React.ReactNode[] = [];
        
        lines.forEach((line, index) => {
            // Bold text (**text**)
            const boldRegex = /\*\*(.*?)\*\*/g;
            const processedLine = line.split(boldRegex).map((part, i) => {
                if (i % 2 === 1) {
                    return <strong key={i} className="font-bold text-gray-900">{part}</strong>;
                }
                return part;
            });

            // Headers
            if (line.startsWith('**') && line.endsWith('**')) {
                elements.push(
                    <h3 key={index} className="text-lg font-bold text-gray-900 mt-6 mb-3">
                        {processedLine}
                    </h3>
                );
            } else if (line.trim() === '') {
                elements.push(<div key={index} className="h-3"></div>);
            } else {
                elements.push(
                    <p key={index} className="text-gray-700 leading-relaxed mb-4">
                        {processedLine}
                    </p>
                );
            }
        });

        return elements;
    };

    return (
        <AppLayout>
            <div className="flex flex-col bg-white w-full min-h-screen relative pb-20">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0D99FF] to-[#0066cc] px-6 pt-20 pb-8 text-white relative">
                    <button
                        onClick={goBack}
                        className="absolute left-4 top-20 p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={handleShare}
                        className="absolute right-4 top-20 p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>
                    
                    <div className="text-center pt-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-medium mb-3">
                            <BookOpen className="w-3.5 h-3.5" />
                            Artikel Kesehatan
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="px-4 py-6">
                    {/* Title Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden mb-6">
                        <div className="h-2 bg-gradient-to-r from-[#0D99FF] to-[#0066cc]"></div>
                        <div className="p-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                                {article.title}
                            </h1>

                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 pb-4 border-b border-gray-100">
                                {article.author && (
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-[#0D99FF] to-[#0066cc] rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{article.author.name}</p>
                                            <p className="text-xs text-gray-500">Penulis</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <span>{formatDate(article.created_at)}</span>
                                </div>
                                <div className="ml-auto px-3 py-1 bg-blue-50 text-[#0D99FF] text-xs font-medium rounded-full">
                                    {Math.ceil(article.content.split(' ').length / 200)} menit baca
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-6 prose prose-sm max-w-none">
                            {renderContent(article.content)}
                        </div>
                    </div>

                    {/* Call to Action */}
                    <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#0D99FF] to-[#0066cc] rounded-full flex items-center justify-center mx-auto mb-4">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                Deteksi Penyakit Kucing dengan AI
                            </h3>
                            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                                Gunakan teknologi AI Rescat untuk mendeteksi penyakit kulit pada kucing Anda secara cepat dan akurat.
                            </p>
                            <button
                                onClick={() => router.visit('/scan')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0D99FF] to-[#0066cc] text-white rounded-xl font-medium hover:shadow-lg transition-all active:scale-[0.98]"
                            >
                                <BookOpen className="w-4 h-4" />
                                Mulai Scan Sekarang
                            </button>
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="mt-6">
                        <button
                            onClick={goBack}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors active:scale-[0.98]"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Daftar Artikel
                        </button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
