import React from 'react';
import { getTeamMembers, TeamMember } from '@/lib/api';
import { Heart, Globe, Shield, Users, FileText, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

const TeamCard: React.FC<{ member: TeamMember }> = ({ member }) => (
    <div className="bg-white dark:bg-swa-gray p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all text-center">
        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden relative">
            {member.avatar ? (
                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                    {member.name.charAt(0)}
                </div>
            )}
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
        <p className="text-swa-green font-medium text-sm mb-3">{member.role}</p>
        <p className="text-gray-600 dark:text-swa-light-gray text-sm mb-4 line-clamp-3">
            {member.bio}
        </p>
        <div className="flex justify-center gap-3">
            {member.twitter && (
                <a href={member.twitter} target="_blank" className="text-gray-400 hover:text-blue-400 transition-colors">
                    {/* Twitter Icon SVG */}
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
            )}
            {member.github && (
                <a href={member.github} target="_blank" className="text-gray-400 hover:text-white transition-colors">
                    {/* Github Icon SVG */}
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.008c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/></svg>
                </a>
            )}
        </div>
    </div>
);

export default async function FoundationPage() {
    const team = await getTeamMembers();

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-swa-dark font-sans transition-colors duration-300">
            
            <main className="flex-grow">
                {/* Hero */}
                <section className="bg-white dark:bg-black py-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-swa-green/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <span className="text-swa-green font-bold tracking-widest uppercase text-sm mb-4 block">501(c)(3) Non-Profit</span>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            The Swa Foundation
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-swa-light-gray max-w-3xl mx-auto leading-relaxed">
                            Ensuring Swalang remains open, free, and community-driven forever. We promote adoption, support contributors, and protect the language's long-term sustainability.
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-16 max-w-6xl">
                    
                    {/* Mission Pillars */}
                    <div className="grid md:grid-cols-3 gap-8 mb-24">
                        <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                                <Globe className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Open Governance</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Swalang is developed in the open. No single corporation controls its destiny. Decisions are made through our transparent RFC process.
                            </p>
                        </div>
                        <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Education & Access</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                We fund educational initiatives, workshops, and localization efforts to make programming accessible to everyone, everywhere.
                            </p>
                        </div>
                        <div className="p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Sustainability</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Through grants and sponsorships, we support core maintainers and critical infrastructure to keep the ecosystem healthy.
                            </p>
                        </div>
                    </div>

                    {/* Team */}
                    <section className="mb-24">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Foundation Leadership</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {team.map(member => (
                                <TeamCard key={member.id} member={member} />
                            ))}
                        </div>
                    </section>

                    {/* Reports / Transparency */}
                    <section className="bg-gray-100 dark:bg-gray-800/50 rounded-2xl p-8 md:p-12 mb-24">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Transparency Reports</h2>
                                <p className="text-gray-600 dark:text-gray-400">We publish quarterly financial and activity reports.</p>
                            </div>
                            <button className="mt-4 md:mt-0 px-6 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg shadow-sm font-semibold hover:bg-gray-50 transition-colors border border-gray-200 dark:border-gray-600">
                                View All Reports
                            </button>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <a href="#" className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-swa-green transition-colors group">
                                <FileText className="w-5 h-5 text-gray-400 group-hover:text-swa-green mr-3" />
                                <span className="text-gray-700 dark:text-gray-300 font-medium">Q2 2024 Financial Report</span>
                                <ExternalLink className="w-4 h-4 text-gray-400 ml-auto opacity-0 group-hover:opacity-100" />
                            </a>
                            <a href="#" className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-swa-green transition-colors group">
                                <FileText className="w-5 h-5 text-gray-400 group-hover:text-swa-green mr-3" />
                                <span className="text-gray-700 dark:text-gray-300 font-medium">2023 Annual Impact Report</span>
                                <ExternalLink className="w-4 h-4 text-gray-400 ml-auto opacity-0 group-hover:opacity-100" />
                            </a>
                        </div>
                    </section>

                    {/* Support Us */}
                    <section className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Support the Foundation</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
                            Your contributions help us maintain servers, fund development, and organize community events. 
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a href="#" className="bg-swa-green text-swa-dark font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                Become a Sponsor
                            </a>
                            <a href="#" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
                                One-time Donation
                            </a>
                        </div>
                    </section>

                </div>
            </main>
            
        </div>
    );
}