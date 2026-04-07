import React from 'react';
import BriefcaseIcon from '@/components/icons/BriefcaseIcon';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import { getJobs, Job } from '@/lib/api';

// Ensure fresh data on each request
export const dynamic = 'force-dynamic';

const JobCard: React.FC<{ job: Job }> = ({ job }) => (
    <a
        href={job.application_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white dark:bg-swa-gray p-6 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 group"
    >
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-swa-green bg-swa-green/10 px-2 py-0.5 rounded">
                        {job.department}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 px-2 py-0.5 rounded">
                        {job.type}
                    </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-swa-green transition-colors">
                    {job.title}
                </h3>
                <p className="text-gray-500 dark:text-swa-light-gray mt-2 text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                </p>
                <p className="text-gray-500 dark:text-swa-light-gray mt-2 text-sm flex items-center">
                    {job.description}
                </p>
            </div>
            <div className="flex items-center text-swa-green font-semibold text-sm group-hover:translate-x-1 transition-transform">
                Apply Now <ArrowRightIcon className="h-5 w-5 ml-2" />
            </div>
        </div>
    </a>
);

// Helper to group jobs by department
const groupJobs = (jobs: Job[]) => {
    const grouped: Record<string, Job[]> = {};
    jobs.forEach(job => {
        if (!grouped[job.department]) grouped[job.department] = [];
        grouped[job.department].push(job);
    });
    return grouped;
};

export default async function CareersPage() {
    const jobs = await getJobs();
    const groupedJobs = groupJobs(jobs);
    const departmentOrder = ["Engineering", "Product", "Design", "Community", "Marketing", "Operations"];

    return (
        <div className="flex flex-col min-h-screen font-sans bg-gray-50 dark:bg-swa-dark transition-colors duration-300">

            <div className="flex-grow">
                {/* Hero Section */}
                <section className="bg-white dark:bg-black py-20 border-b border-gray-200 dark:border-gray-800">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                            Join the Mission
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-swa-light-gray max-w-3xl mx-auto leading-relaxed">
                            We're building the next generation of programming tools. Help us make software development more elegant, productive, and accessible for everyone.
                        </p>
                    </div>
                </section>

                <main className="container mx-auto px-4 py-16 max-w-4xl">
                    {/* Job Listings */}
                    {jobs.length > 0 ? (
                        departmentOrder.filter(dept => groupedJobs[dept]).map(dept => (
                            <section key={dept} className="mb-16">
                                <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                                    {dept}
                                    <span className="ml-3 text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                        {groupedJobs[dept].length}
                                    </span>
                                </h2>
                                <div className="space-y-4">
                                    {groupedJobs[dept].map(job => (
                                        <JobCard key={job.id} job={job} />
                                    ))}
                                </div>
                            </section>
                        ))
                    ) : (
                        <div className="text-center py-16 bg-white dark:bg-swa-gray rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                            <BriefcaseIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Openings Right Now</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                We aren't actively hiring at the moment, but we're always looking for talented contributors.
                            </p>
                        </div>
                    )}

                    {/* General Application */}
                    <div className="mt-20 bg-swa-green/10 dark:bg-swa-green/5 border border-swa-green/20 rounded-2xl p-8 md:p-12 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Don't see the right fit?</h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                            We're always interested in meeting passionate people. If you believe you can make a significant impact on Swalang, we want to hear from you.
                        </p>
                        <a
                            href="mailto:careers@swalang.org"
                            className="inline-flex items-center justify-center bg-swa-green text-swa-dark font-bold py-3 px-8 rounded-lg hover:bg-opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Email Us Your Resume
                        </a>
                    </div>
                </main>
            </div>

        </div>
    );
};