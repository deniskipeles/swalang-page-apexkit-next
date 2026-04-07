"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createDoc } from '@/lib/api';
import { useApexAuth } from '@/components/AuthProvider';

export default function CreateDocPage() {
  const router = useRouter();
  const { user } = useApexAuth();
  const [formData, setFormData] = useState({ title: '', category: '', content: '', sort_order: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple admin check (Backend policies enforce actual security)
  if (!user || user.role !== 'admin') {
      return <div className="p-8 text-center text-red-500">Access Denied. Admins only.</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        const res = await createDoc(formData);
        // Redirect to the newly created slug (returned from the API)
        router.push(`/docs/${res.data.slug}`);
    } catch (err: any) {
        alert("Failed to create doc: " + err.message);
        setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Write Documentation</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input 
                        type="text" 
                        required 
                        className="w-full p-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                    <input 
                        type="text" 
                        required 
                        className="w-full p-2 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        list="categories"
                    />
                    <datalist id="categories">
                        <option value="Getting Started" />
                        <option value="Language Tour" />
                        <option value="Standard Library" />
                    </datalist>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content (Markdown)</label>
                <textarea 
                    required 
                    rows={15}
                    className="w-full p-4 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 font-mono text-sm"
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    placeholder="# Heading&#10;&#10;Write your content here..."
                />
            </div>

            <div className="flex justify-end gap-4">
                <button type="button" onClick={() => router.back()} className="px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Cancel</button>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-swa-green text-swa-dark font-bold py-2 px-6 rounded hover:bg-opacity-90 disabled:opacity-50"
                >
                    {isSubmitting ? 'Publishing...' : 'Publish Page'}
                </button>
            </div>
        </form>
    </div>
  );
}