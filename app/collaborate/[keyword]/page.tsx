"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import KeywordCard, { Keyword } from '@/components/KeywordCard';
import { getKeywords, addSuggestion, voteSuggestion, deleteSuggestion, updateSuggestion, standardizeSuggestion } from '@/lib/api';
import { useApexAuth } from '@/components/AuthProvider';
import { ArrowLeft } from 'lucide-react';

interface DetailPageProps {
  params: {
    keyword: string;
  };
}

const KeywordDetailPage: React.FC<DetailPageProps> = ({ params }) => {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useApexAuth();
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState('Guest');

  // Load terminology data
  const loadData = async () => {
    try {
      const data = await getKeywords();
      setKeywords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update local identity upon auth check
  useEffect(() => {
    if (user?.email) {
      setCurrentUser(user.email.split('@')[0]);
    }
  }, [user]);

  // Find the matching keyword from the collection
  const targetKeyword = useMemo(() => {
    const term = decodeURIComponent(params.keyword).toLowerCase();
    return keywords.find(k => k.englishTerm.toLowerCase() === term);
  }, [keywords, params.keyword]);

  // Interactivity Handlers
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
    await loadData();
  }, [user]);

  const handleAddSuggestion = useCallback(async (keywordId: number, newSuggestionData: any) => {
    if (!user) return alert("Please login to suggest");
    await addSuggestion(keywordId, { ...newSuggestionData, author: currentUser });
    await loadData();
  }, [user, currentUser]);

  const handleEditSuggestion = useCallback(async (keywordId: number, suggestionId: number, updatedData: any) => {
    await updateSuggestion(suggestionId, updatedData);
    await loadData();
  }, []);

  const handleDeleteSuggestion = useCallback(async (keywordId: number, suggestionId: number) => {
    if (!confirm("Delete suggestion?")) return;
    await deleteSuggestion(suggestionId);
    await loadData();
  }, []);

  const handleStandardize = useCallback(async (keywordId: number, suggestionId: number) => {
    if (user?.role !== 'admin') return alert("Only administrators can standardize keywords.");
    await standardizeSuggestion(keywordId, suggestionId);
    await loadData();
  }, [user]);

  if (isLoading || isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center dark:bg-slate-900 text-slate-800 dark:text-white">
        Loading details...
      </div>
    );
  }

  if (!targetKeyword) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Keyword Not Found</h2>
        <Link href="/collaborate" className="text-cyan-600 hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="mb-8">
          <Link href="/collaborate" className="inline-flex items-center text-cyan-600 hover:underline font-semibold">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Keywords
          </Link>
        </div>

        <KeywordCard
          keyword={targetKeyword}
          currentUser={currentUser}
          isDetailed={true} // Display all options and the "Suggest a Term" form
          onVote={handleVote}
          onAddSuggestion={handleAddSuggestion}
          onEditSuggestion={handleEditSuggestion}
          onDeleteSuggestion={handleDeleteSuggestion}
          onStandardize={handleStandardize}
        />
      </div>
    </div>
  );
};

export default KeywordDetailPage;