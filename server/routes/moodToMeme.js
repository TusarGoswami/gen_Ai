import { Router } from 'express';
import { embedText, generateResponse } from '../lib/geminiClient.js';
import { queryByEmbedding } from '../lib/chromaClient.js';
import { buildMoodToMemePrompt } from '../lib/prompts.js';

const router = Router();

/**
 * POST /api/mood-to-meme
 * User pastes a mood/situation, returns the best matching meme(s).
 * Body: { mood: string }
 */
router.post('/', async (req, res) => {
  try {
    const { mood } = req.body;

    if (!mood || typeof mood !== 'string' || mood.trim().length === 0) {
      return res.status(400).json({ error: 'Mood/situation text is required' });
    }

    const trimmedMood = mood.trim();
    console.log(`[/api/mood-to-meme] Mood: "${trimmedMood}"`);

    // Embed the mood text
    const moodEmbedding = await embedText(trimmedMood);

    // Search (top 3 for mood matching)
    const results = queryByEmbedding(moodEmbedding, 3);

    if (results.length === 0) {
      return res.json({
        matched: false,
        message: 'Database mein koi entry nahi mili.',
      });
    }

    const retrievedEntries = results.map(r => r.metadata);

    // Generate mood-to-meme response
    const prompt = buildMoodToMemePrompt(trimmedMood, retrievedEntries);
    const responseText = await generateResponse(prompt);

    // Parse JSON response
    let parsed;
    try {
      const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('[/api/mood-to-meme] Failed to parse:', responseText);
      parsed = {
        matched: true,
        matches: retrievedEntries.slice(0, 3).map(entry => ({
          name: entry.name,
          emotion: entry.emotion,
          popularity: entry.popularity,
          used_when: entry.used_when,
          gif_query: entry.gif_query,
          match_reason: `Ye meme "${entry.used_when}" ke liye use hota hai — tumhari situation se match karta hai.`,
        })),
      };
    }

    return res.json(parsed);

  } catch (err) {
    console.error('[/api/mood-to-meme] Error:', err);
    return res.status(500).json({ error: 'Server error ho gaya. Thodi der baad try karo.' });
  }
});

export default router;
