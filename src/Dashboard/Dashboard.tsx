import { useRef, useState } from 'react';
import { createTreeData, renderTree } from '../utils/jsonTree';

export default function Dashboard() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasTree, setHasTree] = useState(false);

  async function fetchAndRender(inputUrl: string, searchQuery?: string) {
    if (!inputUrl) return;
    setIsLoading(true);
    setError(null);
    setHasTree(false);
    try {
      const res = await fetch(inputUrl);
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      const json = await res.json();
      console.log(json);
      const tree = createTreeData(json);
      console.log(containerRef.current);
      if (tree && containerRef.current) {
        renderTree(containerRef.current, tree, { searchQuery });
        setHasTree(true);
      } else {
        setError('Invalid JSON data');
      }
    } catch (e) {
      setError('Failed to fetch or parse JSON from URL');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
          <div className="p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse-slow" />
              <h1 className="text-2xl md:text-3xl font-bold liquid-text">API Tree Explorer</h1>
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter JSON API URL"
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 transition"
              />
              <input
                placeholder="Search keys/values"
                onKeyDown={(e) => {
                  const target = e.target as HTMLInputElement;
                  if (e.key === 'Enter') {
                    fetchAndRender(url, target.value);
                  }
                }}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/30 transition"
              />
              <button
                className="liquid-button px-6"
                disabled={isLoading || !url}
                onClick={() => fetchAndRender(url)}
              >
                {isLoading ? 'Loading…' : 'Load'}
              </button>
            </div>
          </div>
          <div className="px-4 pb-4 text-xs text-gray-400">
            Try: https://jsonplaceholder.typicode.com/todos/1 or /users
          </div>
        </div>
        {error && (
          <div className="mb-4 text-sm text-red-400">{error}</div>
        )}
        <div
          ref={containerRef}
          style={{
            width: '100%',
            minHeight: '640px',
            background: 'linear-gradient(180deg, rgba(17,24,39,0.8) 0%, rgba(17,24,39,1) 100%)',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
            display: hasTree ? 'block' : 'none'
          }}
        />
      </div>
    </div>
  );
}


