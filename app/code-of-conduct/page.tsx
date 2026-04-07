import React from 'react';
import { Shield, HeartHandshake, AlertOctagon, Mail } from 'lucide-react';

export const metadata = {
  title: 'Code of Conduct - Swalang',
  description: 'Our commitment to a welcoming, inclusive, and harassment-free community.',
};

export default function CodeOfConductPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-swa-dark font-sans transition-colors duration-300">
            <main className="flex-grow">
                {/* Hero Section */}
                <section className="bg-white dark:bg-black py-16 border-b border-gray-200 dark:border-gray-800">
                    <div className="container mx-auto px-4 text-center">
                        <div className="w-16 h-16 bg-swa-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Shield className="w-8 h-8 text-swa-green" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Code of Conduct
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-swa-light-gray max-w-2xl mx-auto">
                            Our pledge to making the Swalang community a welcoming and harassment-free experience for everyone.
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4 py-16 max-w-4xl">
                    <article className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-a:text-swa-green hover:prose-a:underline">
                        
                        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-r-lg mb-10">
                            <h3 className="flex items-center text-blue-800 dark:text-blue-300 mt-0 mb-2">
                                <HeartHandshake className="w-5 h-5 mr-2" />
                                Our Pledge
                            </h3>
                            <p className="text-blue-900 dark:text-blue-200 mb-0">
                                We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.
                            </p>
                        </div>

                        <h2>Our Standards</h2>
                        <p>Examples of behavior that contributes to creating a positive environment include:</p>
                        <ul>
                            <li>Using welcoming and inclusive language.</li>
                            <li>Being respectful of differing viewpoints and experiences.</li>
                            <li>Gracefully accepting constructive criticism.</li>
                            <li>Focusing on what is best for the community.</li>
                            <li>Showing empathy towards other community members.</li>
                        </ul>

                        <p>Examples of unacceptable behavior by participants include:</p>
                        <ul>
                            <li>The use of sexualized language or imagery and unwelcome sexual attention or advances.</li>
                            <li>Trolling, insulting/derogatory comments, and personal or political attacks.</li>
                            <li>Public or private harassment.</li>
                            <li>Publishing others' private information, such as a physical or electronic address, without explicit permission.</li>
                            <li>Other conduct which could reasonably be considered inappropriate in a professional setting.</li>
                        </ul>

                        <h2>Enforcement Responsibilities</h2>
                        <p>
                            Community leaders are responsible for clarifying the standards of acceptable behavior and are expected to take appropriate and fair corrective action in response to any instances of unacceptable behavior.
                        </p>
                        <p>
                            Community leaders have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned to this Code of Conduct, or to ban temporarily or permanently any contributor for other behaviors that they deem inappropriate, threatening, offensive, or harmful.
                        </p>

                        <h2>Scope</h2>
                        <p>
                            This Code of Conduct applies both within project spaces and in public spaces when an individual is representing the project or its community. Examples of representing a project or community include using an official project e-mail address, posting via an official social media account, or acting as an appointed representative at an online or offline event. Representation of a project may be further defined and clarified by project maintainers.
                        </p>

                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 p-8 rounded-xl mt-12 text-center">
                            <AlertOctagon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h2 className="mt-0 mb-4 text-red-800 dark:text-red-400">Reporting Guidelines</h2>
                            <p className="text-red-700 dark:text-red-300">
                                Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team. All complaints will be reviewed and investigated and will result in a response that is deemed necessary and appropriate to the circumstances. The project team is obligated to maintain confidentiality with regard to the reporter of an incident.
                            </p>
                            <a href="mailto:conduct@swalang.org" className="inline-flex items-center justify-center mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors no-underline">
                                <Mail className="w-5 h-5 mr-2" />
                                Report an Incident
                            </a>
                        </div>

                    </article>
                    
                    <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-500 text-center">
                        <p>
                            This Code of Conduct is adapted from the <a href="https://www.contributor-covenant.org" target="_blank" rel="noreferrer">Contributor Covenant</a>, version 1.4.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}