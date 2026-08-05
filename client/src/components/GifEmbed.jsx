import { useState, useEffect } from 'react';

export default function GifEmbed({ gifQuery }) {
  const [gifData, setGifData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!gifQuery) return;

    let cancelled = false;
    setLoading(true);

    fetch(`/api/gif?q=${encodeURIComponent(gifQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setGifData(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setGifData(null);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [gifQuery]);

  if (loading) {
    return (
      <div className="w-full flex flex-col gap-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          🎬 MEME GIF
        </span>
        <div className="w-full h-72 rounded-2xl skeleton" />
      </div>
    );
  }

  if (!gifData || !gifData.gif_url) {
    return null; // Gracefully omit if no GIF available
  }

  return (
    <div className="w-full flex flex-col gap-2 animate-fadeIn">
      <span className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">
        🎬 MEME GIF
      </span>
      <div className="w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/90 shadow-2xl">
        <img
          src={gifData.gif_url}
          alt={gifData.title || 'Meme GIF'}
          className="w-full h-auto max-h-[420px] object-cover object-center"
          loading="lazy"
        />
      </div>
      {gifData.attribution && (
        <p className="text-[10px] text-slate-500 text-right opacity-70">
          {gifData.attribution}
        </p>
      )}
    </div>
  );
}
