"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Lock, Globe, Plus, Search } from "lucide-react";
import { useApexAuth } from "@/components/AuthProvider";
import { getProjectsList, createProject, ProjectWithVersions } from "@/lib/api";

export default function MyProjectsPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useApexAuth();
  
  const [projects, setProjects] = useState<ProjectWithVersions[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (!user) {
        setIsLoading(false);
        return;
    }

    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const res = await getProjectsList(page, 10, searchQuery, user.id);
        setProjects(res.items);
        setTotalPages(res.pages);
      } catch (err: any) {
        console.error(err);
        setError("Could not load your projects.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [user, page, searchQuery]);

  const handleCreateProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    setIsCreating(true);
    setError(null);
    try {
      const result = await createProject(projectName, projectDescription, isPublic);
      router.push(`/project/${result.projectId}`);
    } catch (err: any) {
      setError(`Creation failed: ${err.message}`);
      setIsCreating(false);
    }
  };

  if (isAuthLoading) {
    return <main className="min-h-screen bg-gray-50 dark:bg-swa-dark flex items-center justify-center"><p className="text-gray-500 animate-pulse">Checking authentication...</p></main>;
  }

  if (!user) {
    return (
      <main className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-swa-dark flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md text-center bg-white dark:bg-swa-gray border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">My Projects</h1>
          <p className="text-gray-600 dark:text-swa-light-gray mb-8">Please sign in to manage your Swalang workspaces.</p>
          <Link href="/auth/login" className="inline-block w-full px-4 py-3 font-bold bg-swa-green text-swa-dark rounded-lg hover:bg-opacity-90 transition-colors">
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-swa-dark font-sans transition-colors duration-300 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">My Projects</h1>
                <p className="text-gray-600 dark:text-swa-light-gray mt-2">Manage your personal Swalang IDE workspaces.</p>
            </div>
            <Link href="/projects" className="text-swa-green hover:underline font-semibold flex items-center">
                Explore Community Projects &rarr;
            </Link>
        </header>
        
        {/* Create Project Form */}
        <div className="mb-12 p-6 bg-white dark:bg-swa-gray border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">
              <Plus className="w-6 h-6 mr-2 text-swa-green" />
              Create Workspace
          </h2>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Name</label>
                    <input 
                        type="text" 
                        value={projectName} 
                        onChange={(e) => setProjectName(e.target.value)} 
                        placeholder="e.g. awesome-swa-app" 
                        required
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-swa-green text-gray-900 dark:text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Visibility</label>
                    <div className="flex items-center space-x-4 h-[50px] px-2">
                        <label className="flex items-center text-gray-700 dark:text-gray-300 cursor-pointer">
                            <input type="radio" checked={!isPublic} onChange={() => setIsPublic(false)} className="mr-2 text-swa-green focus:ring-swa-green" />
                            <Lock className="w-4 h-4 mr-1 text-gray-500" /> Private
                        </label>
                        <label className="flex items-center text-gray-700 dark:text-gray-300 cursor-pointer">
                            <input type="radio" checked={isPublic} onChange={() => setIsPublic(true)} className="mr-2 text-swa-green focus:ring-swa-green" />
                            <Globe className="w-4 h-4 mr-1 text-swa-green" /> Public
                        </label>
                    </div>
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
                <textarea
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="What is this project about?"
                    rows={2}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-swa-green resize-none text-gray-900 dark:text-white"
                />
            </div>

            <div className="pt-2">
                <button 
                type="submit" 
                disabled={isCreating || !projectName.trim()} 
                className="w-full sm:w-auto px-8 py-3 bg-swa-green text-swa-dark font-bold rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                {isCreating ? "Initializing IDE..." : "Create Project"}
                </button>
            </div>
          </form>
          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
        </div>

        {/* Search & List */}
        <div>
          <div className="relative mb-6">
             <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
             <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} 
                placeholder="Search my projects..." 
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-swa-gray border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-swa-green text-gray-900 dark:text-white"
            />
          </div>

          {isLoading ? (
              <div className="py-12 text-center text-gray-500 animate-pulse">Loading workspace data...</div>
          ) : (
            <>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-500 bg-white dark:bg-swa-gray rounded-xl border border-gray-200 dark:border-gray-700">
                        {searchQuery ? "No matching projects found." : "You don't have any projects yet."}
                    </div>
                )}
                
                {projects.map(p => (
                    <li key={p.id} className="bg-white dark:bg-swa-gray border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-swa-green transition-colors">
                    <div className="p-5">
                        <div className="flex justify-between items-start mb-2">
                            <Link href={`/project/${p.id}`} className="block group">
                                <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-swa-green transition-colors">{p.name}</h3>
                            </Link>
                            {p.is_public ? 
                                <span className="flex items-center text-xs text-swa-green bg-swa-green/10 px-2 py-1 rounded"><Globe className="w-3 h-3 mr-1"/> Public</span> : 
                                <span className="flex items-center text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded"><Lock className="w-3 h-3 mr-1"/> Private</span>
                            }
                        </div>
                        <p className="text-sm text-gray-600 dark:text-swa-light-gray mb-4 line-clamp-2 h-10">{p.description || 'No description provided.'}</p>
                        
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <span className="text-xs text-gray-400">Updated {new Date(p.created_at).toLocaleDateString()}</span>
                            <Link href={`/project/${p.id}`} className="text-sm font-semibold text-swa-green hover:underline">
                                Open IDE &rarr;
                            </Link>
                        </div>

                        {/* Version History Dropdown */}
                        {p.project_versions && p.project_versions.length > 0 && (
                        <details className="mt-4 group bg-gray-50 dark:bg-black/30 rounded-lg border border-transparent open:border-gray-200 dark:open:border-gray-700">
                            <summary className="flex items-center cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-400 p-2 hover:text-swa-green list-none">
                            History ({p.project_versions.length} versions)
                            <ChevronDown className="h-4 w-4 ml-auto transition-transform group-open:rotate-180" />
                            </summary>
                            <ul className="px-3 pb-3 space-y-2 max-h-40 overflow-y-auto">
                            {p.project_versions.map(v => (
                                <li key={v.id} className="text-xs flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-800 last:border-0">
                                <span className="font-mono text-gray-500 truncate max-w-[150px]">{v.version_label}</span>
                                <Link 
                                    href={`/project/${p.id}?version=${v.id}`} 
                                    className="text-swa-green hover:underline ml-2 flex-shrink-0"
                                >
                                    Restore
                                </Link>
                                </li>
                            ))}
                            </ul>
                        </details>
                        )}
                    </div>
                    </li>
                ))}
                </ul>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-4 mt-10">
                        <button 
                            disabled={page === 1} 
                            onClick={() => setPage(p => p - 1)}
                            className="px-4 py-2 bg-white dark:bg-swa-gray border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                        <button 
                            disabled={page === totalPages} 
                            onClick={() => setPage(p => p + 1)}
                            className="px-4 py-2 bg-white dark:bg-swa-gray border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white"
                        >
                            Next
                        </button>
                    </div>
                )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}