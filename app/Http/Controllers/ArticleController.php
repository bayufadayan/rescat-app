<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Inertia\Inertia;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::with('author')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('articles/articles-list', [
            'articles' => $articles,
        ]);
    }

    public function show($slug)
    {
        $article = Article::with('author')
            ->where('slug', $slug)
            ->firstOrFail();

        return Inertia::render('articles/article-detail', [
            'article' => $article,
        ]);
    }
}
