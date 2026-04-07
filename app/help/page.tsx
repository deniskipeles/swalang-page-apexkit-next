"use client";

import React, { useState } from 'react';
import { apex } from '@/lib/apexkit';
import Link from 'next/link';

// Use Lucide Icons (or your existing ones if preferred)
import { HelpCircle, Mail, MessageCircle, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 dark:border-gray-800">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full py-4 text-left focus:outline-none"
            >
                <span className="text-lg font-medium text-gray-900 dark:text-white">{question}</span>
                <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </span>
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                <p className="text-gray-600 dark:text-gray-400">{answer}</p>
            </div>
        </div>
    );
};

export default function HelpPage() {
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('submitting');
        
        try {
            // Call the ApexKit Edge Function
            await apex.scripts.run('contact-form-handler', formData);
            setFormStatus('success');
            setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
        } catch (err) {
            console.error(err);
            setFormStatus('error');
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-swa-dark font-sans transition-colors duration-300">
            <main className="flex-grow">
                {/* Hero */}
                <section className="bg-white dark:bg-black py-16 border-b border-gray-200 dark:border-gray-800">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            How can we help?
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-swa-light-gray max-w-2xl mx-auto">
                            Find answers, contact support, or join the community discussion.
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-12 max-w-6xl">
                    
                    {/* Quick Links Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                        <Link href="/docs" className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 group">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Documentation</h3>
                            <p className="text-gray-600 dark:text-gray-400">Browse guides, API references, and tutorials.</p>
                        </Link>
                        
                        <Link href="/community" className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 group">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                <MessageCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Community Forum</h3>
                            <p className="text-gray-600 dark:text-gray-400">Ask questions and share ideas on Discord.</p>
                        </Link>

                        <a href="https://github.com/swalang/issues" target="_blank" className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 group">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Report a Bug</h3>
                            <p className="text-gray-600 dark:text-gray-400">Found an issue? File a ticket on our GitHub.</p>
                        </a>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16">
                        {/* FAQ Section */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <HelpCircle className="w-6 h-6 mr-2 text-swa-green" />
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-2">
                                <FAQItem 
                                    question="Is Swalang open source?" 
                                    answer="Yes! Swalang is 100% open source under the MIT license. You can find the source code on GitHub." 
                                />
                                <FAQItem 
                                    question="How do I update to the latest version?" 
                                    answer="Run the installation command again. The installer automatically detects and upgrades your version." 
                                />
                                <FAQItem 
                                    question="Can I use Swalang for web development?" 
                                    answer="Absolutely. Swalang has a robust standard library for networking and several community-built web frameworks available in SwaHub." 
                                />
                                <FAQItem 
                                    question="What platforms are supported?" 
                                    answer="We officially support Windows (x64), macOS (Apple Silicon & Intel), and Linux (x64/ARM64)." 
                                />
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                <Mail className="w-6 h-6 mr-2 text-swa-green" />
                                Contact Support
                            </h2>

                            {formStatus === 'success' ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 dark:text-green-400">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                                    <p className="text-gray-600 dark:text-gray-400">We'll get back to you as soon as possible.</p>
                                    <button onClick={() => setFormStatus('idle')} className="mt-6 text-swa-green hover:underline">Send another message</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                        <input 
                                            type="text" 
                                            required
                                            className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-swa-green outline-none transition-all"
                                            value={formData.name}
                                            onChange={e => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                        <input 
                                            type="email" 
                                            required
                                            className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-swa-green outline-none transition-all"
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                                        <select 
                                            className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-swa-green outline-none transition-all"
                                            value={formData.subject}
                                            onChange={e => setFormData({...formData, subject: e.target.value})}
                                        >
                                            <option>General Inquiry</option>
                                            <option>Technical Support</option>
                                            <option>Partnership</option>
                                            <option>Report Abuse</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                                        <textarea 
                                            required
                                            rows={4}
                                            className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-swa-green outline-none transition-all resize-none"
                                            value={formData.message}
                                            onChange={e => setFormData({...formData, message: e.target.value})}
                                        ></textarea>
                                    </div>
                                    
                                    {formStatus === 'error' && (
                                        <p className="text-red-500 text-sm">Failed to send message. Please try again.</p>
                                    )}

                                    <button 
                                        type="submit" 
                                        disabled={formStatus === 'submitting'}
                                        className="w-full bg-swa-green text-swa-dark font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}