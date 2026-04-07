import { getNewsBySlug } from '@/lib/api';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer'; // Reuse renderer
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const article = await getNewsBySlug(params.slug);
  if (!article) return { title: 'Not Found' };
  return {
    title: `${article.title} - Swalang News`,
    description: article.excerpt,
  };
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const article = await getNewsBySlug(params.slug);

  if (!article) notFound();

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-swa-dark font-sans transition-colors duration-300">
        
        <main className="flex-grow container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <Link href="/news" className="inline-flex items-center text-swa-green hover:underline mb-8 font-semibold">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to News
                </Link>

                <article>
                    <header className="mb-10">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {article.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-xs font-semibold uppercase tracking-wide">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                            {article.title}
                        </h1>
                        <time className="text-gray-500 dark:text-gray-400 block text-lg">
                            {new Date(article.published_at).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </time>
                    </header>
                    
                    <div className="prose prose-lg dark:prose-invert max-w-none prose-a:text-swa-green prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
                        <MarkdownRenderer content={article.content} />
                    </div>
                </article>
                
                <hr className="my-12 border-gray-200 dark:border-gray-800" />
                
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Share this article</p>
                    <div className="flex justify-center gap-4">
                        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://swalang.org/news/${article.slug}`)}`} target="_blank" rel="noreferrer" className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-blue-500 hover:text-white transition-colors">
                           {/* SVG Icon for Twitter */}
                           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                        </a>
                        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://swalang.org/news/${article.slug}`)}`} target="_blank" rel="noreferrer" className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-blue-700 hover:text-white transition-colors">
                           {/* SVG Icon for LinkedIn */}
                           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"></path></svg>
                        </a>
                    </div>
                </div>
            </div>
        </main>
        
    </div>
  );
}