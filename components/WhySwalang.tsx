import React from 'react';
import SparklesIcon from './icons/SparklesIcon';
import LightningIcon from './icons/LightningIcon';
import PackageIcon from './icons/PackageIcon';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, children }) => (
  <div className="text-center p-8 bg-white dark:bg-swa-gray rounded-xl shadow-md border border-transparent dark:border-gray-800 hover:border-swa-green/20 transition-all duration-300">
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-swa-green/10 dark:bg-swa-green/20 mx-auto mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-swa-light-gray text-sm leading-relaxed">{children}</p>
  </div>
);

const WhySwalang: React.FC = () => {
  return (
    <section className="bg-gray-50 dark:bg-swa-dark py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Why Swalang?</h2>
        <p className="text-lg text-gray-600 dark:text-swa-light-gray mb-12 max-w-3xl mx-auto">
          Explore the engineering and design choices that make Swalang a reliable, robust, and portable system tool.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard
            icon={<SparklesIcon className="h-8 w-8 text-swa-green" />}
            title="Clean Pythonic Design"
          >
            Uses standard indentation-based structures and Python 3 compatible keywords. Developers can use standard English terms or localized Swahili terminology.
          </FeatureCard>
          <FeatureCard
            icon={<LightningIcon className="h-8 w-8 text-swa-green" />}
            title="Highly Portable Engine"
          >
            Written in Go, Swalang produces compact, statically compileable, and cross-platform executables. The entire toolchain can be easily shipped to any host.
          </FeatureCard>
          <FeatureCard
            icon={<PackageIcon className="h-8 w-8 text-swa-green" />}
            title="Native Extension Pipeline"
          >
            Bundled with a stable Foreign Function Interface (FFI) engine that leverages Zig. You can cross-compile C extensions to expand runtime capabilities.
          </FeatureCard>
        </div>
      </div>
    </section>
  );
};

export default WhySwalang;