import React from 'react';
import Link from 'next/link';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import { getNews, getFeaturedNews, NewsArticle } from '@/lib/api';

export const dynamic = 'force-dynamic';

const NewsArticleCard: React.FC<{ article: NewsArticle }> = ({ article }) => (
    <div className="bg-white dark:bg-swa-gray p-6 border-b-4 border-swa-green shadow-lg hover:shadow-2xl hover:shadow-swa-green/10 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
        <time className="text-gray-500 dark:text-swa-light-gray text-sm mb-2">
            {new Date(article.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
        </time>
        <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white flex-grow line-clamp-2">
            {article.title}
        </h3>
        <p className="mb-4 text-gray-600 dark:text-swa-light-gray line-clamp-3">{article.excerpt}</p>
        <Link href={`/news/${article.slug}`} className="text-swa-green font-bold flex items-center hover:underline mt-auto">
            Read More <ArrowRightIcon className="ml-2 h-5 w-5" />
        </Link>
    </div>
);

export default async function NewsPage({
    searchParams,
}: {
    searchParams?: { page?: string };
}) {
    const page = Number(searchParams?.page) || 1;
    
    // Fetch data in parallel
    const [featured, newsData] = await Promise.all([
        getFeaturedNews(),
        getNews(page, 9)
    ]);

    // Filter out featured article from main list if it exists to avoid duplication
    const articles = newsData.items.filter(a => a.id !== featured?.id);

    return (
        <div className="flex flex-col min-h-screen font-sans bg-gray-50 dark:bg-swa-dark transition-colors duration-300">
            <div className="container mx-auto px-4 py-16 flex-grow">
                <header className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">News & Announcements</h1>
                    <p className="text-xl text-gray-600 dark:text-swa-light-gray max-w-3xl mx-auto">
                        Stay up-to-date with the latest developments, releases, and stories from the Swalang community.
                    </p>
                </header>

                <main>
                    {/* Featured Article */}
                    {featured && page === 1 && (
                        <section className="mb-16">
                             <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Featured Story</h2>
                            <Link href={`/news/${featured.slug}`} className="block bg-white dark:bg-swa-gray p-8 md:p-12 shadow-xl hover:shadow-2xl hover:shadow-swa-green/20 border-l-8 border-swa-green transition-all duration-300 group rounded-lg">
                                <time className="text-gray-500 dark:text-swa-light-gray text-sm mb-2 block">
                                    {new Date(featured.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                </time>
                                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-swa-green transition-colors">
                                    {featured.title}
                                </h3>
                                <p className="text-lg text-gray-600 dark:text-swa-light-gray max-w-3xl mb-6">
                                    {featured.excerpt}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {featured.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-xs font-semibold uppercase tracking-wide">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <span className="text-swa-green font-bold flex items-center hover:underline">
                                    Read The Announcement <ArrowRightIcon className="ml-2 h-5 w-5" />
                                </span>
                            </Link>
                        </section>
                    )}

                    {/* Article Grid */}
                    <section>
                         <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">Latest Updates</h2>
                         {articles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {articles.map(article => (
                                    <NewsArticleCard key={article.id} article={article} />
                                ))}
                            </div>
                         ) : (
                             <p className="text-center text-gray-500">No news articles found.</p>
                         )}
                    </section>
                    
                    {/* Pagination */}
                    {newsData.pages > 1 && (
                        <nav className="flex justify-center mt-16 gap-2" aria-label="Pagination">
                            {page > 1 && (
                                <Link 
                                    href={`/news?page=${page - 1}`}
                                    className="px-4 py-2 rounded-md bg-white dark:bg-swa-gray border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Previous
                                </Link>
                            )}
                            
                            <span className="px-4 py-2 text-gray-500">Page {page} of {newsData.pages}</span>
                            
                            {page < newsData.pages && (
                                <Link 
                                    href={`/news?page=${page + 1}`}
                                    className="px-4 py-2 rounded-md bg-white dark:bg-swa-gray border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    Next
                                </Link>
                            )}
                        </nav>
                    )}
                </main>
            </div>
        </div>
    );
};