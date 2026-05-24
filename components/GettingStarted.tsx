import React from 'react';
import Link from 'next/link';

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="bg-swa-code-bg text-white p-4 rounded-md my-4 overflow-x-auto"><code className="font-mono">{children}</code></pre>
);

const Section: React.FC<{ title: string, children: React.ReactNode, step: number }> = ({ title, children, step }) => (
    <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
            <span className="text-swa-green">{step}.</span> {title}
        </h2>
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
            {children}
        </div>
    </section>
);

const GettingStarted: React.FC = () => {
    return (
        <div className="bg-gray-50 dark:bg-swa-dark">
            <div className="container mx-auto px-4 py-16">
                <header className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">Getting Started with Swalang</h1>
                    <p className="text-xl text-gray-600 dark:text-swa-light-gray max-w-3xl mx-auto">
                        This guide will walk you through downloading Swalang, setting up your environment, writing your first program, and learning the fundamentals of the language.
                    </p>
                </header>

                <main className="max-w-4xl mx-auto">
                    <Section step={1} title="Installation">
                        <p>
                            Swalang is distributed as a lightweight, pre-compiled binary. To install it on your local machine, download the package tailored for your operating system.
                        </p>
                        
                        <h3 className="text-2xl font-bold mt-8 mb-3">1. Download the Binary</h3>
                        <p>
                            Visit the official releases page on GitHub and download the appropriate zip or tarball for your platform (Windows, macOS, or Linux):
                        </p>
                        <div className="my-4">
                            <a 
                                href="https://github.com/deniskipeles/swalang-beta/releases" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="inline-block bg-swa-green text-swa-dark font-bold py-2.5 px-6 rounded-md hover:bg-opacity-80 transition-colors"
                            >
                                View GitHub Releases
                            </a>
                        </div>

                        <h3 className="text-2xl font-bold mt-8 mb-3">2. Configure Your Environment</h3>
                        <p>
                            Swalang includes an environment setup utility called <code>set-swalang</code> inside the package to automatically configure your PATH variables.
                        </p>
                        
                        <h4 className="text-xl font-semibold mt-4 mb-2">Linux & macOS</h4>
                        <p>Extract the tarball, navigate to the directory, and run the configuration script:</p>
                        <CodeBlock>{`tar -xf swalang-linux-x86_64.tar.xz
cd swalang-linux-x86_64
./bin/set-swalang`}</CodeBlock>

                        <h4 className="text-xl font-semibold mt-4 mb-2">Windows</h4>
                        <p>Extract the zip archive, open the folder, and run the setup utility:</p>
                        <CodeBlock>{`Double-click "set-swalang.exe"`}</CodeBlock>

                        <h3 className="text-2xl font-bold mt-8 mb-3">3. Verify Installation</h3>
                        <p>
                            Open a new terminal window and verify that Swalang is accessible by launching the interactive REPL shell:
                        </p>
                        <CodeBlock>{`$ swalang
Welcome to Swalang REPL!
Enter code to evaluate, or press Ctrl+D to exit.
swalang>>> `}</CodeBlock>
                    </Section>

                    <Section step={2} title="Your First Program">
                        <p>Swalang uses an elegant, indentation-based syntax. Create a new file named <code>main.swa</code> and open it in your editor.</p>
                        <p>Add the following code to print a welcome message:</p>
                        <CodeBlock>{`# main.swa
print("Habari, Dunia!")
`}</CodeBlock>
                        <p>Run the program from your terminal using the interpreter:</p>
                        <CodeBlock>{`$ swalang main.swa
Habari, Dunia!`}</CodeBlock>
                        <p>
                            You have successfully written and executed your first Swalang program.
                        </p>
                    </Section>

                    <Section step={3} title="Learning the Basics">
                        <p>Swalang syntax is designed to be highly readable. Here are a few core concepts to get you started.</p>
                        
                        <h4 className="text-xl font-bold mt-6 mb-2">Variables & Assignment</h4>
                        <p>Assign values directly to variables. Variables are dynamically typed and mutable by default.</p>
                        <CodeBlock>{`name = "Swalang"
version = 1.0
version = 1.1  # Re-assignment`}</CodeBlock>

                        <h4 className="text-xl font-bold mt-6 mb-2">F-Strings (Formatted Strings)</h4>
                        <p>Evaluate expressions dynamically inside string literals by prefixing the string with <code>f</code>:</p>
                        <CodeBlock>{`greeting = f"Welcome to {name} version {version}!"
print(greeting)`}</CodeBlock>
                        
                        <h4 className="text-xl font-bold mt-6 mb-2">Functions</h4>
                        <p>Define reusable blocks of code using the <code>def</code> keyword. Blocks are defined by indents (4 spaces recommended).</p>
                        <CodeBlock>{`def greet(username):
    return f"Habari, {username}!"

print(greet("Msanidi"))`}</CodeBlock>

                        <h4 className="text-xl font-bold mt-6 mb-2">Control Flow</h4>
                        <p>Use <code>if</code>, <code>elif</code>, and <code>else</code> for conditional logic:</p>
                        <CodeBlock>{`score = 85

if score >= 90:
    print("Daraja A")
elif score >= 80:
    print("Daraja B")
else:
    print("Jaribu tena")`}</CodeBlock>

                        <h4 className="text-xl font-bold mt-6 mb-2">Object-Oriented Programming</h4>
                        <p>Create blueprints for objects using classes:</p>
                        <CodeBlock>{`class Mshiriki:
    def __init__(self, jina):
        self.jina = jina

    def sema(self):
        return f"Mimi ni {self.jina}"

mteja = Mshiriki("Amani")
print(mteja.sema())`}</CodeBlock>
                        
                        <p>To explore the language further, head over to our comprehensive <Link href="/docs" className="text-swa-green hover:underline">Documentation</Link>.</p>
                    </Section>

                    <Section step={4} title="What's Next?">
                        <p>With the basics down, you can explore more advanced capabilities:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Manage Packages:</strong> Install third-party modules from our repository using the built-in package manager: <code className="text-sm bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded">swalang get &lt;repository-url&gt;</code>.</li>
                            <li><strong>Async/Await Engine:</strong> Learn how to build highly concurrent network routines using the built-in <code className="text-sm bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded">asyncio</code> package.</li>
                            <li><strong>Foreign Function Interface (FFI):</strong> Connect seamlessly to shared C libraries (like SQLite, MbedTLS, or SDL2) using the <code className="text-sm bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded">ffi</code> module.</li>
                            <li><strong>Join the Community:</strong> Contribute to Swalang's core development on <a href="https://github.com/deniskipeles/swalang-beta" target="_blank" rel="noopener noreferrer" className="text-swa-green hover:underline">GitHub</a>.</li>
                        </ul>
                    </Section>
                </main>
            </div>
        </div>
    );
};

export default GettingStarted;