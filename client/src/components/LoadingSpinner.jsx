const LOADING_MESSAGES = [
  'Meme dhoondh rahe hain… 🔍',
  'Database mein ghus rahe hain… 🗃️',
  'Guru se pooch rahe hain… 🧠',
  'Thoda ruko, aa raha hai… ⏳',
  'Meme ki history padh rahe hain… 📖',
];

export default function LoadingSpinner() {
  const message = LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];

  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fadeIn">
      {/* Spinner */}
      <div className="relative w-16 h-16 mb-4">
        <div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: 'var(--accent-primary)',
            borderRightColor: 'var(--accent-green)',
            animation: 'spin-slow 1s linear infinite',
          }}
        />
        <div
          className="absolute inset-2 rounded-full border-2 border-transparent"
          style={{
            borderBottomColor: 'var(--accent-yellow)',
            borderLeftColor: 'var(--accent-purple)',
            animation: 'spin-slow 1.5s linear infinite reverse',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-xl">
          😂
        </div>
      </div>

      {/* Message */}
      <p className="text-[var(--text-secondary)] text-sm">{message}</p>
    </div>
  );
}
