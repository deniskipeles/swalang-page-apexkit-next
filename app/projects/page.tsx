"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Globe, Search, Code2 } from "lucide-react";
import { getProjectsList, ProjectWithVersions } from "@/lib/api";

export default function ExploreProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithVersions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        // Fetch PUBLIC projects (no ownerId passed)
        const res = await getProjectsList(page, 12, searchQuery);
        setProjects(res.items);
        setTotalPages(res.pages);
      } catch (err: any) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [page, searchQuery]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-swa-dark font-sans transition-colors duration-300 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        
        <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Explore Community Projects
            </h1>
            <p className="text-xl text-gray-600 dark:text-swa-light-gray max-w-2xl mx-auto">
                Discover what developers are building with Swalang. Fork code, learn patterns, and see the language in action.
            </p>
            <div className="mt-6">
                <Link href="/my-projects" className="text-swa-green hover:underline font-bold">
                    Go to My Projects &rarr;
                </Link>
            </div>
        </header>

        {/* Search */}
        <div className="relative max-w-2xl mx-auto mb-12">
            <Search className="absolute left-4 top-4 w-6 h-6 text-gray-400" />
            <input 
            type="text" 
            value={searchQuery} 
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} 
            placeholder="Search public projects..." 
            className="w-full pl-14 pr-4 py-4 text-lg bg-white dark:bg-swa-gray border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-swa-green text-gray-900 dark:text-white transition-all"
        />
        </div>

        {/* List */}
        {isLoading ? (
            <div className="py-20 text-center">
                <div className="inline-block w-8 h-8 border-4 border-swa-green border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500">Loading projects...</p>
            </div>
        ) : (
        <>
            {projects.length === 0 ? (
                <div className="py-20 text-center text-gray-500 bg-white dark:bg-swa-gray rounded-2xl border border-gray-200 dark:border-gray-700">
                    <Code2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No projects found</h3>
                    <p>Try adjusting your search query.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(p => (
                        <Link key={p.id} href={`/project/${p.id}`} className="group block bg-white dark:bg-swa-gray border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-swa-green hover:shadow-lg hover:shadow-swa-green/10 transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-swa-green transition-colors line-clamp-1">{p.name}</h3>
                                <Globe className="w-5 h-5 text-swa-green flex-shrink-0" />
                            </div>
                            <p className="text-gray-600 dark:text-swa-light-gray text-sm mb-6 line-clamp-3 h-[60px]">
                                {p.description || "A public Swalang workspace."}
                            </p>
                            <div className="flex justify-between items-center text-xs text-gray-500 border-t border-gray-100 dark:border-gray-800 pt-4">
                                <span>Updated: {new Date(p.created_at).toLocaleDateString()}</span>
                                <span className="font-bold text-swa-green">View Code</span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-12">
                    <button 
                        disabled={page === 1} 
                        onClick={() => setPage(p => p - 1)}
                        className="px-6 py-2 bg-white dark:bg-swa-gray border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold"
                    >
                        Previous
                    </button>
                    <span className="text-sm font-medium text-gray-500">Page {page} of {totalPages}</span>
                    <button 
                        disabled={page === totalPages} 
                        onClick={() => setPage(p => p + 1)}
                        className="px-6 py-2 bg-white dark:bg-swa-gray border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-semibold"
                    >
                        Next
                    </button>
                </div>
            )}
        </>
        )}

      </div>
    </main>
  );
}