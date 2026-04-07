import { getDocBySlug, getRelatedDocs } from '@/lib/api';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import Link from 'next/link';

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/');
  const doc = await getDocBySlug(slug);
  if (!doc) return { title: 'Not Found' };
  return { title: `${doc.title} - Swalang Documentation` };
}

export default async function DocPage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/');
  const doc = await getDocBySlug(slug);

  if (!doc) notFound();

  // Fetch related docs based on title similarity
  const relatedDocs = await getRelatedDocs(doc.id, doc.title);

  return (
    <div className="flex flex-col xl:flex-row gap-8">
        <article className="prose prose-lg dark:prose-invert max-w-none flex-1">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                {doc.title}
            </h1>
            
            <MarkdownRenderer content={doc.content} />
            
            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
                 <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
        </article>

        {/* Right Sidebar: Related Docs */}
        <aside className="w-full xl:w-64 flex-shrink-0 mt-8 xl:mt-0">
            <div className="xl:sticky xl:top-24 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-swa-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    Related Topics
                </h3>
                {relatedDocs.length > 0 ? (
                    <ul className="space-y-3">
                        {relatedDocs.map((r: any) => (
                            <li key={r.id}>
                                <Link href={`/docs/${r.slug}`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-swa-green transition-colors block">
                                    {r.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500 italic">No related docs found.</p>
                )}
            </div>
        </aside>
    </div>
  );
}