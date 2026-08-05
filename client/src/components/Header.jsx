export default function Header({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'chat', label: 'Pucho Bhai', emoji: '💬' },
    { id: 'mood', label: 'Mood → Meme', emoji: '🎭' },
    { id: 'reverse', label: 'Pehchano', emoji: '🔍' },
    { id: 'upload', label: 'Upload', emoji: '📷' },
    { id: 'categories', label: 'Categories', emoji: '📂' },
  ];

  return (
    <header className="w-full pt-8 pb-6 px-4 flex flex-col items-center gap-6">
      {/* Title */}
      <div className="text-center max-w-xl">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
          <span className="gradient-text">Bhai Ye Meme Kyu Funny Hai?</span>
        </h1>
        <p className="text-slate-400 text-xs md:text-sm font-normal">
          Indian meme culture ka encyclopedia — Pucho kuch bhi, samjha denge!
        </p>
      </div>

      {/* Tab Navigation */}
      <nav className="flex justify-center gap-1.5 flex-wrap max-w-2xl mx-auto p-1.5 rounded-full bg-slate-900 border border-slate-800 shadow-md">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-pink-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </header>
  );
}
