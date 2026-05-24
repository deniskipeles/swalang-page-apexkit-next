import React from 'react';

interface UseCaseProps {
    title: string;
    description: string;
}

const UseCase: React.FC<UseCaseProps> = ({ title, description }) => (
    <div className="p-4 border-l-2 border-swa-green/50 hover:border-swa-green transition-colors pl-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-swa-light-gray mt-2 text-sm leading-relaxed">{description}</p>
    </div>
);

const UseCases: React.FC = () => {
  return (
    <section className="bg-white dark:bg-black py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Use Swalang for...</h2>
        <p className="text-lg text-gray-600 dark:text-swa-light-gray mb-12 max-w-3xl mx-auto">
          Built with an emphasis on low overhead, cross-platform portability, and powerful extension interfaces.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left max-w-6xl mx-auto">
            <UseCase 
                title="Concurrent Web APIs"
                description="Create highly concurrent, responsive microservices and low-latency WebSocket endpoints using Swalang's event-driven HTTP server modules."
            />
            <UseCase 
                title="Direct C FFI Integration"
                description="Bypass writing complex glue-code wrappers. Seamlessly map struct alignments and run functions out of any compiled C shared library."
            />
            <UseCase 
                title="System Scripting & Automation"
                description="Manage processes, navigate directories, and script server management tasks efficiently with a clean, pythonic native API."
            />
            <UseCase 
                title="Embedded DB Engines"
                description="Leverage pre-configured database drivers like SQLite natively to store data locally and run relational queries out-of-the-box."
            />
            <UseCase 
                title="Hardware Accelerated Graphics"
                description="Build interactive visual scripts and lightweight desktop games with pre-bundled native cross-platform SDL2 and Nuklear graphics."
            />
            <UseCase 
                title="Cryptographic Routines"
                description="Perform advanced hashing, symmetric AES encryption, and TLS certificate negotiations powered by an isolated MbedTLS FFI driver."
            />
        </div>
      </div>
    </section>
  );
};

export default UseCases;