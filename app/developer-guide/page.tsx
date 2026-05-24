"use client";

import React from 'react';
import { Terminal, BookOpen, Code2, GitBranch, ExternalLink, Settings, ShieldCheck } from 'lucide-react';

const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg my-4 overflow-x-auto font-mono text-sm border border-slate-700 dark:border-slate-800">
    <code>{code}</code>
  </pre>
);

export default function DeveloperGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-swa-dark text-gray-800 dark:text-gray-200 transition-colors duration-300 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <header className="mb-12 border-b border-gray-200 dark:border-gray-800 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
            <Code2 className="text-swa-green w-10 h-10" />
            Developer's Guide
          </h1>
          <p className="text-xl text-gray-600 dark:text-swa-light-gray leading-relaxed">
            Welcome to the Swalang Engine development guide. This resource explains how to configure, compile, test, and contribute to the core interpreter, standard library, and auxiliary tooling.
          </p>
        </header>

        {/* System Requirements */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Settings className="text-swa-green w-6 h-6" />
            System Requirements
          </h2>
          <p className="mb-4">
            The Swalang parser and runtime are built using Go, while various performance-critical native extensions (such as SQLite, Mongoose, and SDL2) are cross-compiled using Zig.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Go Compiler:</strong> Version 1.23 or newer is required.</li>
            <li><strong>Zig Toolchain:</strong> Version 0.13.0 is recommended to drive cross-compilation of C/C++ dependencies without relying on complex system-specific C compilers.</li>
          </ul>
        </section>

        {/* Directory Layout */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BookOpen className="text-swa-green w-6 h-6" />
            Repository Structure
          </h2>
          <p className="mb-4">
            The project workspace is organized logically into core packages, dynamic extension targets, and compiler automation scripts:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="p-4 bg-white dark:bg-swa-gray border border-gray-200 dark:border-gray-800 rounded-lg">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1 font-mono">cmd/interpreter/</h4>
              <p className="text-sm text-gray-600 dark:text-swa-light-gray">Main entry point for the standard Swalang CLI and REPL shell.</p>
            </div>
            <div className="p-4 bg-white dark:bg-swa-gray border border-gray-200 dark:border-gray-800 rounded-lg">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1 font-mono">internal/lexer/</h4>
              <p className="text-sm text-gray-600 dark:text-swa-light-gray">Converts source code characters into parsed streams of structured tokens.</p>
            </div>
            <div className="p-4 bg-white dark:bg-swa-gray border border-gray-200 dark:border-gray-800 rounded-lg">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1 font-mono">internal/parser/</h4>
              <p className="text-sm text-gray-600 dark:text-swa-light-gray">Constructs the Abstract Syntax Tree (AST) from the token stream.</p>
            </div>
            <div className="p-4 bg-white dark:bg-swa-gray border border-gray-200 dark:border-gray-800 rounded-lg">
              <h4 className="font-bold text-gray-900 dark:text-white mb-1 font-mono">internal/interpreter/</h4>
              <p className="text-sm text-gray-600 dark:text-swa-light-gray">Core runtime engine that walks the AST to evaluate expressions and statements.</p>
            </div>
          </div>
        </section>

        {/* Local Building */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Terminal className="text-swa-green w-6 h-6" />
            Local Build & Compilation
          </h2>
          <p className="mb-4">
            Follow these steps to compile the Swalang binary and standard shared libraries for local development:
          </p>

          <h3 className="text-lg font-bold mt-6 mb-2">1. Clone the codebase</h3>
          <CodeBlock code={`git clone https://github.com/deniskipeles/swalang-beta.git\ncd swalang-beta`} />

          <h3 className="text-lg font-bold mt-6 mb-2">2. Compile Shared Libraries</h3>
          <p className="text-sm text-gray-600 dark:text-swa-light-gray mb-2">
            This script will download the source files for extensions and compile them into platform-specific shared libraries under the <code className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">bin/</code> folder.
          </p>
          <CodeBlock code={`./scripts/build-shared-libs.sh`} />

          <h3 className="text-lg font-bold mt-6 mb-2">3. Build the Core Interpreter</h3>
          <p className="text-sm text-gray-600 dark:text-swa-light-gray mb-2">
            This script links all components, bundles the standard library, and generates the final executables inside the <code className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">builds/</code> folder.
          </p>
          <CodeBlock code={`./scripts/build-interpreter.sh`} />
        </section>

        {/* Testing */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="text-swa-green w-6 h-6" />
            Running Unit Tests
          </h2>
          <p className="mb-4">
            Verify the integrity of changes by executing the suite of unit tests. Tests cover lexing, AST generation, and runtime evaluation:
          </p>
          <CodeBlock code={`go test ./tests/...`} />
        </section>

        {/* Extending the language */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <GitBranch className="text-swa-green w-6 h-6" />
            Extending the Language
          </h2>
          <p className="mb-4">
            If you are proposing additions to Swalang's syntax (such as introducing new keywords or tokens), update the pipeline in the following sequence:
          </p>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <strong>Define Keywords:</strong> Register the text of your keyword inside the localization files located in <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded font-mono">internal/constants/lexer_en.go</code> and <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded font-mono">lexer_sw.go</code>.
            </li>
            <li>
              <strong>Map Tokens:</strong> Bind the constant value to a matching <code className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-800 rounded">TokenType</code> inside <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded font-mono">internal/lexer/token.go</code>.
            </li>
            <li>
              <strong>Write Parser Logic:</strong> Open <code className="px-1 py-0.5 bg-gray-200 dark:bg-gray-800 rounded font-mono">internal/parser/parser.go</code> to define prefix or infix parsing operations so the compiler understands the keyword's position in the AST tree.
            </li>
          </ol>
        </section>

        {/* Contributing Link */}
        <div className="mt-16 bg-swa-green/10 dark:bg-swa-green/5 border border-swa-green/20 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ready to submit your changes?</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Review your code formatting, make sure all tests pass, and submit a pull request on GitHub.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="https://github.com/deniskipeles/swalang-beta" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center bg-swa-green text-swa-dark font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-colors shadow-lg"
            >
              Open Repository <ExternalLink className="w-4 h-4 ml-2" />
            </a>
            <a 
              href="https://github.com/deniskipeles/swalang-beta/issues" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-bold py-3 px-6 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Report an Issue
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}