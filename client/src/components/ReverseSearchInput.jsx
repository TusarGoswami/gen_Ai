import { useState } from 'react';

export default function ReverseSearchInput({ onSubmit, loading }) {
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() || loading) return;
    onSubmit(description.trim());
  };

  const suggestions = [
    'Banda apna dimag point karta hai jaise smart idea aaya ho',
    'Aadmi girlfriend ke saath chal raha hai lekin doosri ladki ko dekh raha hai',
    'Kutta room mein aag ke beech baith ke chai pee raha hai',
    'Brain panels jo ek se ek zyada glow kar rahe hain',
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="text-center mb-1">
        <h2 className="text-lg font-bold text-white mb-1 flex items-center justify-center gap-2">
          <span>🔍</span> Meme Pehchano
        </h2>
        <p className="text-xs text-slate-400">
          Meme describe karo, hum batayenge kaunsa meme hai!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Meme kaise dikhta hai woh describe karo..."
          className="w-full min-h-[90px] p-4 bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none transition-all shadow-md resize-none"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 self-end whitespace-nowrap cursor-pointer flex items-center gap-2"
          disabled={loading || !description.trim()}
        >
          {loading ? '⏳ Identifying...' : '🔍 Identify Meme'}
        </button>
      </form>

      {/* Suggestions */}
      <div className="w-full flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-slate-500 font-medium mr-1">Examples:</span>
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setDescription(s);
              onSubmit(s);
            }}
            disabled={loading}
            className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all text-xs cursor-pointer text-left"
          >
            {s.length > 40 ? s.slice(0, 40) + '…' : s}
          </button>
        ))}
      </div>
    </div>
  );
}
