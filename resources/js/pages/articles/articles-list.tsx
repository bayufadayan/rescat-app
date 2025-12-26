import React from 'react';
import { router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BookOpen, Calendar, User, ChevronRight } from 'lucide-react';

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

type ArticlesListProps = {
    articles: Article[];
};

export default function ArticlesList() {
    const { articles } = usePage<ArticlesListProps>().props;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    const getExcerpt = (content: string, maxLength: number = 150) => {
        const plainText = content.replace(/\*\*/g, '').replace(/\n/g, ' ');
        if (plainText.length <= maxLength) return plainText;
        return plainText.substring(0, maxLength).trim() + '...';
    };

    const handleArticleClick = (slug: string) => {
        router.visit(`/articles/${slug}`);
    };

    return (
        <AppLayout>
            <div className="flex flex-col bg-gradient-to-b from-gray-50 to-white w-full min-h-screen relative pb-20">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#0D99FF] to-[#0066cc] px-6 pt-24 pb-8 text-white">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Artikel Kesehatan Kucing</h1>
                            <p className="text-sm opacity-90">Tips dan panduan merawat kucing Anda</p>
                        </div>
                    </div>
                </div>

                {/* Articles List */}
                <div className="px-4 py-6">
                    {articles.length === 0 ? (
                        <div className="text-center py-16">
                            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500">Belum ada artikel tersedia</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {articles.map((article) => (
                                <div
                                    key={article.id}
                                    onClick={() => handleArticleClick(article.slug)}
                                    className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer group"
                                >
                                    {/* Card Header dengan Gradient */}
                                    <div className="h-2 bg-gradient-to-r from-[#0D99FF] to-[#0066cc]"></div>
                                    
                                    <div className="p-5">
                                        {/* Title */}
                                        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0D99FF] transition-colors line-clamp-2">
                                            {article.title}
                                        </h2>

                                        {/* Meta Info */}
                                        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                                            {article.author && (
                                                <div className="flex items-center gap-1.5">
                                                    <User className="w-4 h-4" />
                                                    <span>{article.author.name}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                <span>{formatDate(article.created_at)}</span>
                                            </div>
                                        </div>

                                        {/* Excerpt */}
                                        <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                                            {getExcerpt(article.content)}
                                        </p>

                                        {/* Read More Button */}
                                        <div className="flex items-center justify-between">
                                            <button
                                                className="inline-flex items-center gap-2 text-[#0D99FF] font-medium text-sm group-hover:gap-3 transition-all"
                                            >
                                                Baca Selengkapnya
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                            <div className="px-3 py-1 bg-blue-50 text-[#0D99FF] text-xs font-medium rounded-full">
                                                {Math.ceil(article.content.split(' ').length / 200)} menit baca
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Tips Section */}
                <div className="px-4 pb-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#0D99FF] to-[#0066cc] rounded-full flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-1">Tips Membaca</h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    Artikel kami ditulis oleh ahli untuk membantu Anda merawat kucing dengan lebih baik. 
                                    Jangan ragu untuk berkonsultasi dengan dokter hewan jika kucing Anda menunjukkan gejala penyakit.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
