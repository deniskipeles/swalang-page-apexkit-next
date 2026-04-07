"use client";

import React, { useState, useEffect, useMemo } from 'react';
import SocialLinkCard from '@/components/SocialLinkCard';
import Chatbot from '@/components/Chatbot';
import AddLinkForm from '@/components/AddLinkForm';
import ContributionChatbot from '@/components/ContributionChatbot';
import { getCommunityLinks, submitCommunityLink, CommunityLink } from '@/lib/api';

type Theme = 'light' | 'dark';

export default function CommunityPage() {
  const [theme, setTheme] = useState<Theme>('dark');
  const [links, setLinks] = useState<CommunityLink[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load Theme
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme;
    const sysTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    setTheme(storedTheme || sysTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Load Data
  useEffect(() => {
    getCommunityLinks().then(data => {
        setLinks(data);
        setIsLoading(false);
    });
  }, []);

  const handleAddLink = async (newLink: any) => {
    try {
        await submitCommunityLink(newLink);
        alert("Link submitted for approval!");
    } catch (e) {
        alert("Failed to submit link.");
    }
  };

  const filteredLinks = useMemo(() => {
      if (!searchQuery) return links;
      const q = searchQuery.toLowerCase();
      return links.filter(l => l.name.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
  }, [links, searchQuery]);

  const officialLinks = filteredLinks.filter(l => l.category === 'official');
  const unofficialLinks = filteredLinks.filter(l => l.category === 'unofficial');
  const involvedLinks = filteredLinks.filter(l => l.category === 'involved');

  const Section = ({ title, items }: { title: string, items: CommunityLink[] }) => (
    items.length > 0 ? (
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-6 border-l-4 border-teal-500 dark:border-teal-400 pl-4">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map(link => <SocialLinkCard key={link.id} {...link} />)}
        </div>
      </div>
    ) : null
  );

  if (isLoading) return <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center text-slate-500">Loading Community Hub...</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 relative">
        <main className="max-w-4xl mx-auto">
          {/* Search */}
          <div className="mb-12 relative">
            <input
              type="text"
              placeholder="Search all links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent transition-all text-slate-900 dark:text-white"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</div>
          </div>
          
          <Section title="Official Channels" items={officialLinks} />
          <Section title="Community Hubs" items={unofficialLinks} />
          <Section title="Get Involved" items={involvedLinks} />

          {filteredLinks.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">No links found</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Try clearing your search or contributing a new link!</p>
            </div>
          )}

          {/* AI Assistants */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 pl-2 border-l-4 border-teal-500">Community Helper</h2>
                  <Chatbot />
              </div>
              <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 pl-2 border-l-4 border-sky-500">Contributor Guide</h2>
                  <ContributionChatbot />
              </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-6 border-l-4 border-teal-500 dark:border-teal-400 pl-4">Contribute Your Link</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">Run a Swalang community group? Add it to our list! Submissions require admin approval.</p>
            <AddLinkForm onAddLink={handleAddLink} />
          </div>

        </main>
        
      </div>
    </div>
  );
};