import React from 'react';
import RoadmapIcon from './icons/RoadmapIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface RoadmapItemProps {
    children: React.ReactNode;
}

const RoadmapItem: React.FC<RoadmapItemProps> = ({ children }) => (
    <li className="flex items-start">
        <CheckCircleIcon className="h-5 w-5 text-swa-green mr-3 mt-1 flex-shrink-0" />
        <span className="text-sm leading-relaxed">{children}</span>
    </li>
);

interface RoadmapCardProps {
    title: string;
    timeline: string;
    children: React.ReactNode;
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ title, timeline, children }) => (
    <div className="bg-white dark:bg-swa-gray p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 border-t-4 dark:border-t-4 border-t-swa-green/50">
        <p className="text-xs font-semibold text-swa-green mb-1 uppercase tracking-wider">{timeline}</p>
        <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>
        <ul className="space-y-3 text-gray-600 dark:text-swa-light-gray">
            {children}
        </ul>
    </div>
);

const Roadmap: React.FC = () => {
    return (
        <section className="bg-white dark:bg-black py-16">
            <div className="container mx-auto px-4 text-center">
                <div className="flex justify-center items-center mb-4">
                    <RoadmapIcon className="h-10 w-10 text-swa-green" />
                </div>
                <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">The Road Ahead</h2>
                <p className="text-lg text-gray-600 dark:text-swa-light-gray mb-12 max-w-3xl mx-auto">
                    We are continuously refining Swalang's virtual machine, standard library modules, and developer tooling.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left max-w-6xl mx-auto">
                    <RoadmapCard title="Short Term" timeline="Next 6-12 Months">
                        <RoadmapItem>Grow the localized Swahili terminology vocabulary through active community collaboration.</RoadmapItem>
                        <RoadmapItem>Optimize bytecode compilation and parsing performance inside the core Go engine.</RoadmapItem>
                        <RoadmapItem>Enhance linting, auto-completion, and diagnostics reporting inside the Swalang LSP server.</RoadmapItem>
                    </RoadmapCard>
                    <RoadmapCard title="Mid Term" timeline="1-2 Years">
                        <RoadmapItem>Implement a first-class WebAssembly (WASM) compiler target to enable running complex routines in the browser.</RoadmapItem>
                        <RoadmapItem>Integrate a full, asynchronous cooperative task scheduler directly into the core runtime loop.</RoadmapItem>
                        <RoadmapItem>Expand pre-bundled standard library coverage for common network and operating system-level routines.</RoadmapItem>
                    </RoadmapCard>
                    <RoadmapCard title="Long Term" timeline="2+ Years">
                        <RoadmapItem>Build a self-hosting compiler chain written completely in Swalang itself.</RoadmapItem>
                        <RoadmapItem>Introduce optional, type-annotated ahead-of-time (AOT) compilation pipelines.</RoadmapItem>
                        <RoadmapItem>Develop stable graphical windowing libraries utilizing modern, lightweight UI frameworks.</RoadmapItem>
                    </RoadmapCard>
                </div>
            </div>
        </section>
    );
};

export default Roadmap;