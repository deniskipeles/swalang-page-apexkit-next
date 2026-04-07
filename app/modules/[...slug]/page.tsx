// 'use client'

import { getPackageBySlug, getRelatedPackages } from '@/lib/api';
import { notFound } from 'next/navigation';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import PackageIcon from '@/components/icons/PackageIcon';
import Link from 'next/link';
import { cardBaseStyles, insetContainerStyles } from '../styles';
import CopyButton from '@/components/CopyButton';

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/'); // Handle [...slug]
  const pkg = await getPackageBySlug(slug);
  
  if (!pkg) return { title: 'Package Not Found' };

  return {
    title: `${pkg.name} - Swalang Module`,
    description: pkg.description,
    keywords: pkg.keywords,
  };
}

export default async function ModuleDetailPage({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join('/');
  const pkg = await getPackageBySlug(slug);

  if (!pkg) notFound();

  const relatedPackages = await getRelatedPackages(pkg.id, pkg.description);

  return (
    <div className="flex flex-col min-h-screen bg-swalang-light-bg dark:bg-swalang-dark font-sans transition-colors duration-300">
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left: Main Content */}
            <div className="w-full lg:w-2/3">
                <div className={`${cardBaseStyles} p-8 mb-8`}>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-swalang-accent/10 rounded-lg">
                            <PackageIcon className="h-8 w-8 text-swalang-accent" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{pkg.name}</h1>
                            <p className="text-gray-500 dark:text-gray-400">v{pkg.version} • by {pkg.author}</p>
                        </div>
                    </div>
                    
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 border-l-4 border-swalang-accent pl-4">
                        {pkg.description}
                    </p>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                        Installation
                    </h3>
                    <div className="relative bg-gray-100 dark:bg-black/30 p-4 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between font-mono text-sm mb-8">
                        <code className="text-gray-800 dark:text-gray-200">
                            <span className="text-gray-400 select-none">$ </span>
                            swalang install {pkg.name}
                        </code>
                        <CopyButton text={`swalang install ${pkg.name}`} />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                        Documentation
                    </h3>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <MarkdownRenderer content={pkg.readme} />
                    </div>
                </div>
            </div>

            {/* Right: Sidebar */}
            <aside className="w-full lg:w-1/3 space-y-6">
                
                {/* Stats Card */}
                <div className={`${cardBaseStyles} p-6`}>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Metadata</h3>
                    <dl className="space-y-4 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-gray-500">License</dt>
                            <dd className="font-medium text-gray-900 dark:text-white">MIT</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Downloads</dt>
                            <dd className="font-medium text-gray-900 dark:text-white">{pkg.downloads.toLocaleString()}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-gray-500">Published</dt>
                            <dd className="font-medium text-gray-900 dark:text-white">{new Date(pkg.created).toLocaleDateString()}</dd>
                        </div>
                    </dl>
                    
                    <div className="mt-6">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                            {pkg.keywords.map(k => (
                                <Link key={k} href={`/modules?q=${k}`} className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded transition-colors">
                                    {k}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Related Packages */}
                {relatedPackages.length > 0 && (
                    <div className={`${cardBaseStyles} p-6`}>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Related Modules</h3>
                        <ul className="space-y-3">
                            {relatedPackages.map((rel: any) => (
                                <li key={rel.id}>
                                    <Link href={`/modules/${rel.slug}`} className="block group">
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-swalang-accent transition-colors">
                                                {rel.name}
                                            </span>
                                            <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded">v{rel.version}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                            {rel.description}
                                        </p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

            </aside>
        </div>
      </main>
      
    </div>
  );
}