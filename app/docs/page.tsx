"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { searchDocs, DocPage } from '@/lib/api';

export default function DocsIndex() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DocPage[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Initial load
  useEffect(() => {
    searchDocs('').then(setResults);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    try {
        const docs = await searchDocs(query);
        setResults(docs);
    } finally {
        setIsSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Documentation</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
            Search guides, API references, and tutorials.
        </p>
      </header>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative mb-12">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documentation (e.g., 'vectors', 'install')..."
          className="w-full p-4 pl-12 rounded-xl bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-swa-green outline-none transition-all shadow-sm"
        />
        <button type="submit" className="absolute right-3 top-3 bg-swa-green text-swa-dark font-bold py-1 px-4 rounded-md hover:opacity-90">
            Search
        </button>
        {/* Simple icon placeholder if you don't want to import */}
        <div className="absolute left-4 top-4 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </form>

      {/* Results */}
      <div className="space-y-6">
        {isSearching ? (
             <div className="text-center py-10 animate-pulse text-gray-500">Searching neural index...</div>
        ) : results.length > 0 ? (
            <div className="grid gap-4">
                {results.map((doc) => (
                    <Link key={doc.id} href={`/docs/${doc.slug}`} className="block p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-swa-green dark:hover:border-swa-green transition-all group">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-xs font-bold text-swa-green uppercase tracking-wide">{doc.category}</span>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1 group-hover:text-swa-green transition-colors">
                                    {doc.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                                    {/* Strip markdown for preview */}
                                    {doc?.content?.replace(/[#*`]/g, '').substring(0, 150)}...
                                </p>
                            </div>
                            {doc.score && (
                                <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-500">
                                    {Math.round(doc.score * 100)}% Match
                                </span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        ) : (
            <div className="text-center py-10 text-gray-500">
                No documentation found matching "{query}".
            </div>
        )}
      </div>
      
      <div className="mt-12 text-center">
          <Link href="/docs/create" className="text-sm text-gray-500 hover:text-swa-green underline">
              Contributor? Add a new page
          </Link>
      </div>
    </div>
  );
}