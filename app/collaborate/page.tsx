"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import KeywordCard, { Keyword } from '@/components/KeywordCard';
import AddKeywordModal from '@/components/AddKeywordModal';
import { getKeywords, addKeyword, addSuggestion, voteSuggestion, deleteSuggestion, updateSuggestion, standardizeSuggestion } from '@/lib/api';
import { useApexAuth } from '@/components/AuthProvider';


const ColabPage: React.FC = () => {
  const { user } = useApexAuth();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(user?.email?.split('@')[0] || 'Guest');
  const [isAddKeywordModalOpen, setIsAddKeywordModalOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load Theme
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const handleToggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      if (newTheme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return newTheme;
    });
  };

  // FETCH DATA
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

  // Update user name if auth loads late
  useEffect(() => {
      if (user) setCurrentUser(user.email.split('@')[0]);
  }, [user]);

  // ACTIONS
  const handleVote = useCallback(async (keywordId: number, suggestionId: number, voteType: 'up' | 'down') => {
    if (!user) return alert("Please login to vote");
    
    // Optimistic UI Update
    setKeywords(prev => prev.map(k => {
        if (k.id !== keywordId) return k;
        return {
            ...k,
            suggestions: k.suggestions.map(s => {
                if (s.id !== suggestionId) return s;
                return { ...s, votes: s.votes + (voteType === 'up' ? 1 : -1) };
            }).sort((a, b) => b.votes - a.votes)
        };
    }));

    await voteSuggestion(suggestionId, voteType);
    loadData(); // Refresh to sync
  }, [user]);

  const onAddSuggestion = useCallback(async (keywordId: number, newSuggestionData: any) => {
      if (!user) return alert("Please login to suggest");
      await addSuggestion(keywordId, { ...newSuggestionData, author: currentUser });
      loadData();
  }, [user, currentUser]);

  const handleAddKeyword = useCallback(async (data: any) => {
      if (!user) return alert("Please login to add keywords");
      await addKeyword({ ...data, author: currentUser });
      setIsAddKeywordModalOpen(false);
      loadData();
  }, [user, currentUser]);

  const handleEditSuggestion = useCallback(async (keywordId: number, suggestionId: number, updatedData: any) => {
      await updateSuggestion(suggestionId, updatedData);
      loadData();
  }, []);

  const handleDeleteSuggestion = useCallback(async (keywordId: number, suggestionId: number) => {
      if (!confirm("Delete suggestion?")) return;
      await deleteSuggestion(suggestionId);
      loadData();
  }, []);

  const handleStandardize = useCallback(async (keywordId: number, suggestionId: number) => {
      if (user?.role !== 'admin') return alert("Admins only");
      await standardizeSuggestion(keywordId, suggestionId);
      loadData();
  }, [user]);

  // FILTERING
  const filteredKeywords = useMemo(() => {
    if (!searchQuery) return keywords;
    const query = searchQuery.toLowerCase();
    return keywords.filter(keyword => {
      return keyword.englishTerm.toLowerCase().includes(query) ||
        keyword.suggestions.some(s => s.swahiliTerm.toLowerCase().includes(query));
    });
  }, [keywords, searchQuery]);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center dark:bg-slate-900 text-white">Loading...</div>;

  return (
    <>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="flex justify-center mb-6">
              <button
                onClick={() => user ? setIsAddKeywordModalOpen(true) : alert("Please login")}
                className="w-full sm:w-auto bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
              >
                + Add New Keyword
              </button>
            </div>
            {/* Search Input */}
            <input
                type="text"
                className="block w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg py-3 pl-4 pr-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="Search keywords..."
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
                  onVote={handleVote} 
                  onAddSuggestion={onAddSuggestion}
                  onEditSuggestion={handleEditSuggestion}
                  onDeleteSuggestion={handleDeleteSuggestion}
                  onStandardize={handleStandardize}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-300">No Results Found</h2>
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