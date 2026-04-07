import React from 'react';
import Link from 'next/link';
import ArrowRightIcon from './icons/ArrowRightIcon';
import { NewsArticle } from '@/lib/api';

const NewsItem: React.FC<{ date: string; title: string; slug: string }> = ({ date, title, slug }) => (
  <li className="mb-4">
    <time className="text-gray-500 dark:text-swa-light-gray text-sm">{date}</time>
    <Link href={`/news/${slug}`} className="block text-swa-green hover:underline font-semibold line-clamp-1">
        {title}
    </Link>
  </li>
);

export default function NewsAndEvents({ news }: { news: NewsArticle[] }) {
  return (
    <section className="py-16 bg-gray-50 dark:bg-swa-dark border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* DYNAMIC NEWS */}
          <div>
            <h2 className="text-3xl font-bold mb-6 border-b-2 border-swa-green pb-2 text-gray-900 dark:text-white">Latest News</h2>
            <ul>
              {news.length > 0 ? news.map((article) => (
                  <NewsItem 
                    key={article.id} 
                    date={new Date(article.published_at).toLocaleDateString()} 
                    title={article.title} 
                    slug={article.slug}
                  />
              )) : (
                  <li className="text-gray-500">No news yet.</li>
              )}
            </ul>
             <Link href="/news" className="text-swa-green font-bold flex items-center hover:underline mt-6">
                More News <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {/* STATIC EVENTS (Could easily be made dynamic later) */}
          <div>
            <h2 className="text-3xl font-bold mb-6 border-b-2 border-swa-green pb-2 text-gray-900 dark:text-white">Upcoming Events</h2>
            <ul>
                <li className="mb-4">
                    <time className="text-gray-500 dark:text-swa-light-gray text-sm">Dec 10, 2024</time>
                    <span className="block text-swa-green font-semibold">SwaConf 2024 - Virtual Event</span>
                </li>
                <li className="mb-4">
                    <time className="text-gray-500 dark:text-swa-light-gray text-sm">Jan 15, 2025</time>
                    <span className="block text-swa-green font-semibold">Webinar: Async Swalang Patterns</span>
                </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}