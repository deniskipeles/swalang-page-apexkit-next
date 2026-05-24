"use client";

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import KeywordCard, { Keyword } from '@/components/KeywordCard';
import AddKeywordModal from '@/components/AddKeywordModal';
import { getKeywords, addKeyword } from '@/lib/api';
import { useApexAuth } from '@/components/AuthProvider';

const ColabPage: React.FC = () => {
  const { user } = useApexAuth();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState('Guest');
  const [isAddKeywordModalOpen, setIsAddKeywordModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Load Data
  const loadData = async () => {
    try {
      const data = await getKeywords();
      setKeywords(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load keywords data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update user name once authenticated
  useEffect(() => {
    if (user?.email) {
      setCurrentUser(user.email.split('@')[0]);
    }
  }, [user]);

  const handleAddKeyword = async (data: any) => {
    if (!user) return alert("Please login to add keywords");
    
    startTransition(async () => {
      try {
        await addKeyword({ ...data, author: currentUser });
        setIsAddKeywordModalOpen(false);
        await loadData();
      } catch (err) {
        alert("Failed to add keyword.");
      }
    });
  };

  // Filter Keywords
  const filteredKeywords = useMemo(() => {
    if (!searchQuery) return keywords;
    const query = searchQuery.toLowerCase();
    return keywords.filter(keyword => {
      return keyword.englishTerm.toLowerCase().includes(query) ||
        keyword.suggestions.some(s => s.swahiliTerm.toLowerCase().includes(query));
    });
  }, [keywords, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-900 text-slate-800 dark:text-white">
        Loading Collaborate Workspace...
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
        <main className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Collaborative Terminology</h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Contribute to the Swahili translation dictionary for standard keywords. Propose new terms or vote on community suggestions.
            </p>
          </div>

          <div className="mb-12 max-w-2xl mx-auto space-y-4">
            <div className="flex justify-center">
              <button
                onClick={() => user ? setIsAddKeywordModalOpen(true) : alert("Please login to add keywords")}
                className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform hover:-translate-y-0.5"
              >
                + Add New Python Keyword
              </button>
            </div>
            
            <input
              type="text"
              className="block w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg py-3 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all shadow-sm"
              placeholder="Search Python keywords or Swahili terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {filteredKeywords.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredKeywords.map(keyword => (
                <KeywordCard 
                  key={keyword.id} 
                  keyword={keyword}
                  currentUser={currentUser}
                  isDetailed={false} // Only display the top suggestion
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-slate-500 dark:text-slate-400">No Keywords Found</h2>
            </div>
          )}
        </main>
      </div>

      <AddKeywordModal 
        isOpen={isAddKeywordModalOpen}
        onClose={() => setIsAddKeywordModalOpen(false)}
        onSubmit={handleAddKeyword}
      />
    </>
  );
};

export default ColabPage;