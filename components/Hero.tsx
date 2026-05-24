import React from 'react';
import Link from 'next/link';

export default function Hero({ version }: { version: string }) {
  return (
    <section className="bg-gray-50 dark:bg-swa-dark text-gray-900 dark:text-white">
      <div className="container mx-auto px-4 py-16 md:py-24 text-center flex flex-col items-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">Swalang</h1>
        <p className="text-xl md:text-2xl text-swa-green mb-10 max-w-2xl font-semibold">
          The elegant, Python-compatible language engine with native C FFI, async I/O, and Swahili localized dictionary support.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
          <Link href="/downloads" className="bg-swa-green text-swa-dark font-bold py-3 px-8 rounded-md text-lg hover:bg-opacity-80 transition-colors shadow-lg shadow-swa-green/20">
            Download {version}
          </Link>
          <Link href="/try" className="border-2 border-gray-400 dark:border-swa-light-gray text-gray-500 dark:text-swa-light-gray font-bold py-3 px-8 rounded-md text-lg hover:bg-gray-400 dark:hover:bg-swa-light-gray hover:text-swa-dark transition-colors">
            &gt;&gt;&gt; Try Online
          </Link>
        </div>
        <div className="w-full max-w-3xl bg-swa-code-bg rounded-lg shadow-2xl text-left font-mono text-sm overflow-hidden border border-gray-700 dark:border-swa-gray">
          <div className="bg-swa-gray p-3 flex items-center">
            <div className="flex space-x-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
            <span className="flex-grow text-center text-gray-400 font-mono">main.swa</span>
          </div>
          <pre className="p-4 overflow-x-auto">
            <code className="text-white">
              <span className="text-gray-500">1  </span><span className="text-purple-400">import</span> http<br />
              <span className="text-gray-500">2  </span><span className="text-purple-400">import</span> time<br />
              <span className="text-gray-500">3  </span><br />
              <span className="text-gray-500">4  </span>app = http.<span className="text-yellow-400">Server</span>(port=<span className="text-indigo-400">5000</span>)<br />
              <span className="text-gray-500">5  </span><br />
              <span className="text-gray-500">6  </span><span className="text-blue-400">@app.route</span>(<span className="text-green-400">&quot;/&quot;</span>)<br />
              <span className="text-gray-500">7  </span><span className="text-purple-400">def</span> <span className="text-yellow-400">index</span>(req):<br />
              <span className="text-gray-500">8  </span>    sasa = time.<span className="text-yellow-400">time</span>()<br />
              <span className="text-gray-500">9  </span>    <span className="text-purple-400">return</span> <span className="text-green-400">f&quot;&lt;h1&gt;Habari, Dunia!&lt;/h1&gt;&lt;p&gt;Muda wa Server: &#123;sasa&#125;&lt;/p&gt;&quot;</span><br />
              <span className="text-gray-500">10 </span><br />
              <span className="text-gray-500">11 </span><span className="text-blue-400">@app.route</span>(<span className="text-green-400">&quot;/api/v1&quot;</span>)<br />
              <span className="text-gray-500">12 </span><span className="text-purple-400">def</span> <span className="text-yellow-400">habari_api</span>(req):<br />
              <span className="text-gray-500">13 </span>    <span className="text-purple-400">return</span> &#123;<br />
              <span className="text-gray-500">14 </span>        <span className="text-green-400">&quot;lugha&quot;</span>: <span className="text-green-400">&quot;Swalang&quot;</span>,<br />
              <span className="text-gray-500">15 </span>        <span className="text-green-400">&quot;mchezo&quot;</span>: <span className="text-green-400">&quot;active&quot;</span>,<br />
              <span className="text-gray-500">16 </span>        <span className="text-green-400">&quot;injini&quot;</span>: <span className="text-green-400">&quot;Go Interpreter&quot;</span><br />
              <span className="text-gray-500">17 </span>    &#125;<br />
              <span className="text-gray-500">18 </span><br />
              <span className="text-gray-500">19 </span>app.<span className="text-yellow-400">run</span>()<br />
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}