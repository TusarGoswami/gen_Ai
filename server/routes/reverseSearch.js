import { Router } from 'express';
import { embedText, generateResponse } from '../lib/geminiClient.js';
import { queryByEmbedding } from '../lib/chromaClient.js';
import { buildReverseSearchPrompt } from '../lib/prompts.js';

const router = Router();

/**
 * POST /api/reverse-search
 * User describes a meme visually → identify it.
 * Body: { description: string }
 */
router.post('/', async (req, res) => {
  try {
    const { description } = req.body;

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const trimmedDesc = description.trim();
    console.log(`[/api/reverse-search] Description: "${trimmedDesc}"`);

    // Embed the visual description
    const descEmbedding = await embedText(trimmedDesc);

    // Search (top 3 for context)
    const results = queryByEmbedding(descEmbedding, 3);

    if (results.length === 0) {
      return res.json({
        matched: false,
        message: 'Is description se koi match nahi mila.',
      });
    }

    const retrievedEntries = results.map(r => r.metadata);

    // Generate reverse search response
    const prompt = buildReverseSearchPrompt(trimmedDesc, retrievedEntries);
    const responseText = await generateResponse(prompt);

    // Parse JSON
    let parsed;
    try {
      const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('[/api/reverse-search] Failed to parse:', responseText);
      parsed = {
        matched: true,
        name: retrievedEntries[0].name,
        confidence: 'medium',
        explanation: responseText.slice(0, 300),
      };
    }

    // If matched, also attach the full entry data for the MemeCard
    if (parsed.matched && parsed.name) {
      const matchedEntry = retrievedEntries.find(
        e => e.name.toLowerCase() === parsed.name.toLowerCase()
      ) || retrievedEntries[0];

      parsed.entry = {
        name: matchedEntry.name,
        emotion: matchedEntry.emotion,
        popularity: matchedEntry.popularity,
        used_when: matchedEntry.used_when,
        meaning: matchedEntry.meaning,
        example: matchedEntry.example,
        gif_query: matchedEntry.gif_query,
        category: matchedEntry.category,
      };
    }

    return res.json(parsed);

  } catch (err) {
    console.error('[/api/reverse-search] Error:', err);
    return res.status(500).json({ error: 'Server error ho gaya. Thodi der baad try karo.' });
  }
});

export default router;
