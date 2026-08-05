import { Router } from 'express';
import { embedText, generateResponse } from '../lib/geminiClient.js';
import { queryByEmbedding } from '../lib/chromaClient.js';
import { buildExplainPrompt } from '../lib/prompts.js';

const router = Router();

/**
 * POST /api/query
 * Main chat-style meme explainer.
 * Body: { query: string }
 */
router.post('/', async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const trimmedQuery = query.trim();
    console.log(`[/api/query] Query: "${trimmedQuery}"`);

    // Step 1: Embed the user query
    const queryEmbedding = await embedText(trimmedQuery);

    // Step 2: Similarity search (top 3)
    const results = queryByEmbedding(queryEmbedding, 3);

    if (results.length === 0) {
      return res.json({
        matched: false,
        message: 'Database mein koi entry nahi mili. Pehle ingest.py chala ke data load karo!',
      });
    }

    const retrievedEntries = results.map(r => r.metadata);
    const topMatch = results[0];

    console.log(`[/api/query] Found ${results.length} matches. Top: "${topMatch.metadata.name}" (similarity: ${topMatch.similarity.toFixed(4)})`);

    // Step 3: Build prompt and generate response with Gemini
    const prompt = buildExplainPrompt(trimmedQuery, retrievedEntries);
    const responseText = await generateResponse(prompt);

    // Step 4: Parse the JSON response
    let parsed;
    try {
      const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('[/api/query] Failed to parse Gemini response:', responseText);
      // Fallback to raw metadata
      const entry = topMatch.metadata;
      parsed = {
        matched: true,
        name: entry.name,
        emotion: entry.emotion,
        popularity: entry.popularity,
        used_when: entry.used_when,
        meaning: [entry.meaning],
        example: entry.example,
        gif_query: entry.gif_query,
        category: entry.category,
        explanation: responseText.slice(0, 500),
      };
    }

    return res.json(parsed);

  } catch (err) {
    console.error('[/api/query] Error:', err);
    return res.status(500).json({ error: 'Server error ho gaya bhai. Thodi der baad try karo.' });
  }
});

export default router;
