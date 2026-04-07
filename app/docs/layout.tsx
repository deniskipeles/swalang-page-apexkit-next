import React from 'react';
import Link from 'next/link';
import { getDocumentationList, DocPage } from '@/lib/api';
import { ChevronRightIcon } from 'lucide-react';

// Group flat list into categories
function groupDocs(docs: DocPage[]) {
  const groups: Record<string, DocPage[]> = {};
  docs.forEach(doc => {
    if (!groups[doc.category]) groups[doc.category] = [];
    groups[doc.category].push(doc);
  });
  return groups;
}

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const docs = await getDocumentationList();
  const grouped = groupDocs(docs);

  return (
    <div className="bg-white dark:bg-swa-dark min-h-screen">
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-64 lg:flex-shrink-0">
          <div className="lg:sticky lg:top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 px-2">
              Documentation
            </h2>
            
            <nav className="space-y-6">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2 px-2">
                    {category}
                  </h3>
                  <ul className="space-y-1 border-l border-gray-200 dark:border-gray-800 ml-1">
                    {items.map((doc) => (
                      <li key={doc.id}>
                        <Link
                          href={`/docs/${doc.slug}`}
                          className="group flex items-center justify-between px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-swa-green dark:hover:text-swa-green hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-r-md transition-colors"
                        >
                          {doc.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <div className="bg-white dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}