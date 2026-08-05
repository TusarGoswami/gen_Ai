import { Router } from 'express';
import { getAllEntries, getCategoriesWithCounts } from '../lib/chromaClient.js';

const router = Router();

// Category icons mapping
const CATEGORY_ICONS = {
  'Instagram': '📸',
  'WhatsApp': '💬',
  'Bollywood': '🎬',
  'Cricket': '🏏',
  'Indian Politics': '🏛️',
  'Gaming': '🎮',
  'College': '🎓',
  'Engineering': '⚙️',
  'JEE/NEET': '📚',
  'IPL': '🏏',
  'Anime': '⛩️',
  'Reddit India': '🔥',
  'YouTube': '▶️',
};

/**
 * GET /api/categories
 * Returns all categories with their counts and icons.
 */
router.get('/', (req, res) => {
  try {
    const categories = getCategoriesWithCounts();

    const enriched = categories.map(cat => ({
      ...cat,
      icon: CATEGORY_ICONS[cat.name] || '📁',
    }));

    return res.json({ categories: enriched });

  } catch (err) {
    console.error('[/api/categories] Error:', err);
    return res.status(500).json({ error: 'Categories load nahi ho payi.' });
  }
});

/**
 * GET /api/categories/:category
 * Returns all memes in a specific category.
 */
router.get('/:category', (req, res) => {
  try {
    const { category } = req.params;
    console.log(`[/api/categories/${category}] Fetching memes...`);

    const results = getAllEntries(category);

    const memes = results.map(entry => ({
      id: entry.id,
      name: entry.metadata.name,
      emotion: entry.metadata.emotion,
      popularity: entry.metadata.popularity,
      used_when: entry.metadata.used_when,
      category: entry.metadata.category,
      meaning: entry.metadata.meaning,
      gif_query: entry.metadata.gif_query,
    }));

    return res.json({ category, memes });

  } catch (err) {
    console.error('[/api/categories] Error:', err);
    return res.status(500).json({ error: 'Category memes load nahi ho payi.' });
  }
});

export default router;
