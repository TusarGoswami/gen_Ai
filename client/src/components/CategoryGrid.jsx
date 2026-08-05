import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';
import StarRating from './StarRating';

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memesLoading, setMemesLoading] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Fetch memes when category is selected
  const handleCategoryClick = async (categoryName) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
      setMemes([]);
      return;
    }
    setSelectedCategory(categoryName);
    setMemesLoading(true);
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(categoryName)}`);
      const data = await res.json();
      setMemes(data.memes || []);
    } catch {
      setMemes([]);
    }
    setMemesLoading(false);
  };

  if (loading) return <LoadingSpinner />;
  if (categories.length === 0) return <EmptyState type="noCategories" />;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">
          📂 Category Dekho
        </h2>
        <p className="text-sm text-[var(--text-muted)]">
          Category choose karo, us category ke saare memes dikhayenge!
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-6">
        {categories.map((cat) => (
          <div
            key={cat.name}
            onClick={() => handleCategoryClick(cat.name)}
            className={`category-tile ${
              selectedCategory === cat.name
                ? 'border-[var(--accent-primary)] bg-[rgba(233,69,96,0.1)]'
                : ''
            }`}
          >
            <span className="icon">{cat.icon}</span>
            <span className="name">{cat.name}</span>
            <span className="count">{cat.count} memes</span>
          </div>
        ))}
      </div>

      {/* Memes List */}
      {selectedCategory && (
        <div className="animate-fadeInUp">
          <h3 className="text-md font-semibold text-[var(--text-primary)] mb-3">
            {selectedCategory} ke memes:
          </h3>
          {memesLoading ? (
            <LoadingSpinner />
          ) : memes.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)] text-center py-8">
              Is category mein koi meme nahi mila.
            </p>
          ) : (
            <div className="space-y-3">
              {memes.map((meme) => (
                <div key={meme.id} className="glass-card p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--text-primary)]">
                        {meme.name}
                      </h4>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {meme.used_when}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`emotion-badge emotion-${meme.emotion} text-[10px]`}>
                        {meme.emotion}
                      </span>
                      <StarRating rating={Number(meme.popularity)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
