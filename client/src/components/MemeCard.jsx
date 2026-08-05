import StarRating from './StarRating';
import GifEmbed from './GifEmbed';

export default function MemeCard({ data, showGif = true }) {
  if (!data) return null;

  const {
    name,
    emotion,
    popularity,
    used_when,
    meaning,
    example,
    gif_query,
    category,
    explanation,
    match_reason,
  } = data;

  // Parse meaning — could be array or string
  const meaningList = Array.isArray(meaning)
    ? meaning
    : typeof meaning === 'string'
      ? meaning.split('. ').filter(Boolean).map(s => s.trim())
      : [];

  // Format example with line breaks
  const exampleLines = example
    ? example.split('\n').filter(Boolean)
    : [];

  const hasGif = showGif && Boolean(gif_query);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 animate-fadeInUp shadow-2xl w-full backdrop-blur-md">
      <div className={`grid grid-cols-1 ${hasGif ? 'lg:grid-cols-12' : ''} gap-8 items-start`}>
        
        {/* Left Column: Text Details */}
        <div className={`${hasGif ? 'lg:col-span-7' : 'w-full'} space-y-5`}>
          {/* Header: Name, Category, Emotion & Popularity */}
          <div>
            <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                {name}
              </h3>
              {category && (
                <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 uppercase tracking-wider">
                  {category}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 flex-wrap mt-1">
              {emotion && (
                <span className={`emotion-badge emotion-${emotion} text-xs font-semibold`}>
                  😂 {emotion}
                </span>
              )}
              {popularity && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/50">
                  <span>📈</span>
                  <StarRating rating={Number(popularity)} />
                </div>
              )}
            </div>
          </div>

          {/* Explanation */}
          {explanation && (
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <p className="text-sm md:text-base text-slate-200 leading-relaxed font-normal">
                {explanation}
              </p>
            </div>
          )}

          {/* Match Reason (for mood-to-meme) */}
          {match_reason && (
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-xs md:text-sm text-teal-300">
              <span className="font-semibold">🎯 Match Reason: </span>
              {match_reason}
            </div>
          )}

          {/* Used When */}
          {used_when && (
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                🎯 Used When
              </span>
              <p className="text-sm text-slate-300 leading-relaxed">
                {used_when}
              </p>
            </div>
          )}

          {/* Meaning */}
          {meaningList.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider block">
                🧠 Meaning
              </span>
              <ul className="space-y-1.5 pl-1">
                {meaningList.map((point, i) => (
                  <li key={i} className="text-sm text-slate-300 flex items-start gap-2 leading-relaxed">
                    <span className="text-pink-500 mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Example */}
          {exampleLines.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider block">
                💬 Example
              </span>
              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/80 space-y-1 font-mono text-xs md:text-sm text-slate-200">
                {exampleLines.map((line, i) => (
                  <p key={i} className="leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Parallel GIF Panel */}
        {hasGif && (
          <div className="lg:col-span-5 lg:sticky lg:top-6 w-full">
            <GifEmbed gifQuery={gif_query} />
          </div>
        )}

      </div>
    </div>
  );
}
