import Link from 'next/link';
import PackageIcon from '@/components/icons/PackageIcon';
import { getPackages } from '@/lib/api';
import { cardBaseStyles } from './styles';
import SearchBarWrapper from './SearchBarWrapper'; // <--- Import the new client component

// Force dynamic to ensure search params are fresh
export const dynamic = 'force-dynamic';

export default async function ModulesPage({
  searchParams,
}: {
  searchParams?: { q?: string; page?: string };
}) {
  const query = searchParams?.q || '';
  const currentPage = Number(searchParams?.page) || 1;
  
  const { items, total, pages } = await getPackages(currentPage, 12, query);

  return (
    <div className="flex flex-col min-h-screen bg-swalang-light-bg dark:bg-swalang-dark font-sans transition-colors duration-300">
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-swalang-light-text dark:text-white mb-2">
            Find your <span className="text-swalang-accent">Swalang</span> module
          </h1>
          <p className="text-lg text-swalang-light-subtle dark:text-swalang-light">
            The official package registry for the Swalang ecosystem.
          </p>
        </div>

        {/* Search Bar Wrapper (Client Component) */}
        <div className="max-w-2xl mx-auto mb-12">
            <SearchBarWrapper initialQuery={query} />
        </div>

        {/* Results Info */}
        <div className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            {total} packages found {query && `for "${query}"`}
        </div>

        {/* Package Grid */}
        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((pkg: any) => (
              <Link key={pkg.id} href={`/modules/${pkg.slug}`} className="block h-full">
                <div className={`${cardBaseStyles} p-6 flex flex-col h-full hover:border-swalang-accent hover:shadow-lg hover:shadow-swalang-accent/10 transition-all duration-300 transform hover:-translate-y-1`}>
                    <div className="flex-grow">
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-xl font-bold text-swalang-light-text dark:text-white flex items-center gap-2">
                                <PackageIcon className="h-5 w-5 text-swalang-accent" />
                                {pkg.name}
                            </h2>
                            <span className="text-sm bg-gray-100 dark:bg-swalang-purple text-swalang-light-subtle dark:text-swalang-light px-2 py-1 rounded-full">{pkg.version}</span>
                        </div>
                        <p className="text-swalang-light-subtle dark:text-swalang-light mb-4 line-clamp-3">{pkg.description}</p>
                    </div>
                    <div className="mt-auto">
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex justify-between">
                            <span>by {pkg.author}</span>
                            <span>⬇ {pkg.downloads}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {pkg.keywords.slice(0, 3).map((k: string) => (
                                <span key={k} className="bg-swalang-accent/10 text-swalang-accent dark:bg-swalang-dark dark:text-swalang-accent text-xs font-semibold px-3 py-1 rounded-full">
                                    {k}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
            <div className="text-center py-20 text-gray-500">
                <p className="text-xl">No packages found matching your criteria.</p>
            </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
            <div className="flex justify-center mt-12 gap-2">
                {currentPage > 1 && (
                    <Link href={`/modules?page=${currentPage - 1}${query ? `&q=${query}` : ''}`} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                        Previous
                    </Link>
                )}
                <span className="px-4 py-2 text-gray-500">Page {currentPage} of {pages}</span>
                {currentPage < pages && (
                    <Link href={`/modules?page=${currentPage + 1}${query ? `&q=${query}` : ''}`} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                        Next
                    </Link>
                )}
            </div>
        )}
      </main>
      
    </div>
  );
}