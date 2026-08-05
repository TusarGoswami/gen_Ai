import { useState } from 'react';
import Header from './components/Header';
import ChatInput from './components/ChatInput';
import MoodInput from './components/MoodInput';
import ReverseSearchInput from './components/ReverseSearchInput';
import UploadBox from './components/UploadBox';
import CategoryGrid from './components/CategoryGrid';
import MemeCard from './components/MemeCard';
import LoadingSpinner from './components/LoadingSpinner';
import EmptyState from './components/EmptyState';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Reset result when switching tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setResult(null);
    setError(null);
  };

  // ─── Chat Query ───
  const handleChatQuery = async (query) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult({ type: 'chat', data });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // ─── Mood to Meme ───
  const handleMoodSubmit = async (mood) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch('/api/mood-to-meme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult({ type: 'mood', data });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // ─── Reverse Search ───
  const handleReverseSearch = async (description) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch('/api/reverse-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult({ type: 'reverse', data });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // ─── Image Upload ───
  const handleImageUpload = async (formData) => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch('/api/image-identify', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult({ type: 'image', data });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // ─── Render Results ───
  const renderResult = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <EmptyState type="error" />;
    if (!result) return null;

    const { type, data } = result;

    // No match responses
    if (data.matched === false) {
      return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center animate-fadeIn w-full shadow-xl">
          <div className="text-4xl mb-3">😅</div>
          <p className="text-white font-medium">
            {data.message || 'Iska koi confident match nahi mila.'}
          </p>
          <p className="text-xs text-slate-400 mt-2">
            Thoda alag tarike se search karo ya categories dekho!
          </p>
        </div>
      );
    }

    // Chat explainer
    if (type === 'chat') {
      return (
        <div className="w-full">
          <MemeCard data={data} />
        </div>
      );
    }

    // Mood to Meme — multiple matches
    if (type === 'mood' && data.matches) {
      return (
        <div className="w-full space-y-6">
          {data.matches.map((match, i) => (
            <MemeCard key={i} data={match} showGif={i === 0} />
          ))}
        </div>
      );
    }

    // Reverse search
    if (type === 'reverse') {
      return (
        <div className="w-full space-y-4">
          {data.explanation && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-fadeIn shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  data.confidence === 'high' ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : data.confidence === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  : 'bg-red-500/20 text-red-300 border border-red-500/30'
                }`}>
                  Confidence: {data.confidence}
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{data.explanation}</p>
            </div>
          )}
          {data.entry && <MemeCard data={data.entry} />}
        </div>
      );
    }

    // Image identify
    if (type === 'image') {
      return (
        <div className="w-full space-y-4">
          {data.message && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-fadeIn shadow-lg">
              <p className="text-sm text-slate-300 leading-relaxed">{data.message}</p>
            </div>
          )}
          {data.entry && <MemeCard data={data.entry} />}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#0d0f17] text-white">
      <Header activeTab={activeTab} setActiveTab={handleTabChange} />

      <main className="w-full max-w-5xl px-4 md:px-8 pb-12 pt-2 flex flex-col items-center gap-8 flex-1">
        {/* Input Section */}
        <div className="w-full max-w-2xl">
          {activeTab === 'chat' && (
            <ChatInput onSubmit={handleChatQuery} loading={loading} />
          )}
          {activeTab === 'mood' && (
            <MoodInput onSubmit={handleMoodSubmit} loading={loading} />
          )}
          {activeTab === 'reverse' && (
            <ReverseSearchInput onSubmit={handleReverseSearch} loading={loading} />
          )}
          {activeTab === 'upload' && (
            <UploadBox onSubmit={handleImageUpload} loading={loading} />
          )}
          {activeTab === 'categories' && (
            <CategoryGrid />
          )}
        </div>

        {/* Results Section */}
        {activeTab !== 'categories' && (
          <div className="w-full">
            {renderResult()}
            {!loading && !result && !error && activeTab === 'chat' && (
              <EmptyState type="default" />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 text-xs text-slate-500 border-t border-slate-800 bg-slate-950 mt-auto">
        Built with ❤️ aur thoda sa pagalpan — Powered by Gemini AI + ChromaDB
      </footer>
    </div>
  );
}
