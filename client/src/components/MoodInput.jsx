import { useState } from 'react';

export default function MoodInput({ onSubmit, loading }) {
  const [mood, setMood] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mood.trim() || loading) return;
    onSubmit(mood.trim());
  };

  const suggestions = [
    'Placement nahi lagi 😭',
    'Crush ne seen karke chhod diya',
    'Weekend pe bhi kaam karna pad raha hai',
    'Exam kal hai aur kuch nahi padha',
  ];

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="text-center mb-1">
        <h2 className="text-lg font-bold text-white mb-1 flex items-center justify-center gap-2">
          <span>🎭</span> Mood to Meme
        </h2>
        <p className="text-xs text-slate-400">
          Apna mood ya situation batao, hum perfect meme dhundhenge!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
        <textarea
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          placeholder="Apna mood ya situation yahan likho..."
          className="w-full min-h-[90px] p-4 bg-slate-900 border border-slate-800 focus:border-teal-500 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none transition-all shadow-md resize-none"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 self-end whitespace-nowrap cursor-pointer flex items-center gap-2"
          disabled={loading || !mood.trim()}
        >
          {loading ? '⏳ Searching...' : '🎯 Find Meme'}
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
              setMood(s);
              onSubmit(s);
            }}
            disabled={loading}
            className="px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-all text-xs cursor-pointer"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
