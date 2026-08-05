import { useState } from 'react';

export default function ChatInput({ onSubmit, loading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || loading) return;
    onSubmit(query.trim());
  };

  const quickQueries = [
    'Moye Moye kya hai?',
    'Explain sigma male',
    'CID meme batao',
    'Rasode mein kaun tha?',
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Form Row */}
      <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
          placeholder="Koi bhi meme pucho... (e.g. 'Moye Moye kya hai?')"
          className="flex-1 px-5 py-3.5 bg-slate-900 border border-slate-800 focus:border-pink-500 rounded-xl text-white placeholder-slate-500 text-sm md:text-base focus:outline-none transition-all shadow-md"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-6 py-3.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 whitespace-nowrap cursor-pointer flex items-center justify-center gap-2"
          disabled={loading || !query.trim()}
        >
          {loading ? '⏳' : '🔥 Pucho'}
        </button>
      </form>

      {/* Suggested Quick Queries */}
      <div className="w-full flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-slate-500 font-medium mr-1">Try:</span>
        {quickQueries.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => {
              setQuery(q);
              onSubmit(q);
            }}
            disabled={loading}
            className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all text-xs cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
