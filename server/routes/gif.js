import { Router } from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const router = Router();
const GIPHY_API_KEY = process.env.GIPHY_API_KEY;

// In-memory session cache for GIF URLs
const gifCache = new Map();
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

/**
 * GET /api/gif?q=search+query
 * Proxies to Giphy API, returns a GIF URL.
 * Caches results in memory to avoid rate limiting.
 */
router.get('/', async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.json({ gif_url: null, attribution: null });
    }

    // Read GIPHY_API_KEY dynamically
    const giphyKey = process.env.GIPHY_API_KEY;

    if (!giphyKey) {
      console.warn('[/api/gif] GIPHY_API_KEY not set — skipping GIF fetch');
      return res.json({ gif_url: null, attribution: null });
    }

    // Check cache
    const cacheKey = query.toLowerCase().trim();
    const cached = gifCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json(cached.data);
    }

    // Fetch from Giphy
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${giphyKey}&q=${encodeURIComponent(query)}&limit=1&rating=pg&lang=en`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const gif = data.data[0];
      const result = {
        gif_url: gif.images.fixed_height.url,
        gif_url_small: gif.images.fixed_height_small?.url || gif.images.fixed_height.url,
        attribution: 'via GIPHY',
        title: gif.title,
      };

      // Cache the result
      gifCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return res.json(result);
    }

    // No results
    const noResult = { gif_url: null, attribution: null };
    gifCache.set(cacheKey, { data: noResult, timestamp: Date.now() });
    return res.json(noResult);

  } catch (err) {
    console.error('[/api/gif] Error:', err);
    return res.json({ gif_url: null, attribution: null });
  }
});

export default router;
