export default function EmptyState({ type = 'default' }) {
  const states = {
    default: {
      emoji: '🤔',
      title: 'Kuch pucho na bhai!',
      subtitle: 'Type karo koi meme ya situation, hum samjha denge.',
    },
    noMatch: {
      emoji: '😅',
      title: 'Iska koi confident match nahi mila',
      subtitle: 'Kuch aur try karo ya thoda alag tarike se describe karo.',
    },
    error: {
      emoji: '😵',
      title: 'Kuch gadbad ho gayi!',
      subtitle: 'Server se baat nahi ho pa rahi. Thodi der baad try karo.',
    },
    noCategories: {
      emoji: '📭',
      title: 'Categories load nahi ho payi',
      subtitle: 'Pehle ingest.py chala ke data load karo.',
    },
    upload: {
      emoji: '📸',
      title: 'Meme Upload Karo',
      subtitle: 'Screenshot ya meme image upload karo, hum batayenge ye kya hai.',
    },
  };

  const state = states[type] || states.default;

  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fadeIn">
      <div className="text-5xl mb-4 animate-bounce-soft">{state.emoji}</div>
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
        {state.title}
      </h3>
      <p className="text-sm text-[var(--text-muted)] text-center max-w-sm">
        {state.subtitle}
      </p>
    </div>
  );
}
