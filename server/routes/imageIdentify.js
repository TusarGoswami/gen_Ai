import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { embedText, generateResponse, identifyImage } from '../lib/geminiClient.js';
import { queryByEmbedding } from '../lib/chromaClient.js';
import { buildImageIdentifyPrompt } from '../lib/prompts.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = Router();

// Ensure temp directory exists
const tempDir = path.resolve(__dirname, '..', 'temp_uploads');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Configure multer for temporary file uploads
const upload = multer({
  dest: tempDir,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (PNG, JPEG, GIF, WebP)'));
    }
  },
});

/**
 * POST /api/image-identify
 * Upload a meme image → OCR + Gemini Vision → identify → explain.
 * Multipart form data with field name "image".
 */
router.post('/', upload.single('image'), async (req, res) => {
  let tempFilePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    tempFilePath = req.file.path;
    const mimeType = req.file.mimetype;
    const ocrText = req.body.ocrText || ''; // OCR is done client-side with Tesseract.js

    console.log(`[/api/image-identify] Processing image: ${req.file.originalname} (${mimeType})`);
    console.log(`[/api/image-identify] OCR text from client: "${ocrText}"`);

    // Step 1: Read the image file
    const imageBuffer = fs.readFileSync(tempFilePath);

    // Step 2: Gemini Vision — identify the meme template
    const visionResult = await identifyImage(imageBuffer, mimeType);
    console.log(`[/api/image-identify] Vision result:`, visionResult);

    // Step 3: Build search text from vision + OCR
    const searchText = [
      visionResult.identified_name !== 'unknown' ? visionResult.identified_name : '',
      visionResult.description || '',
      ocrText || '',
    ].filter(Boolean).join(' ');

    if (!searchText.trim()) {
      return res.json({
        matched: false,
        message: 'Is image se kuch identify nahi ho paya. Better quality image try karo!',
      });
    }

    // Step 4: Embed and search
    const searchEmbedding = await embedText(searchText);
    const results = queryByEmbedding(searchEmbedding, 3);

    if (results.length === 0) {
      return res.json({
        matched: false,
        message: 'Ye template mere paas nahi hai abhi.',
      });
    }

    const retrievedEntries = results.map(r => r.metadata);

    // Step 5: Use LLM to confirm the identification
    const prompt = buildImageIdentifyPrompt(visionResult, ocrText, retrievedEntries);
    const responseText = await generateResponse(prompt);

    let parsed;
    try {
      const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error('[/api/image-identify] Failed to parse:', responseText);
      parsed = {
        matched: false,
        message: 'Ye template mere paas nahi hai abhi.',
      };
    }

    // If matched, attach full entry data
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
    console.error('[/api/image-identify] Error:', err);
    return res.status(500).json({ error: 'Image process nahi ho payi. Thodi der baad try karo.' });
  } finally {
    // ALWAYS delete the temp file — never store uploaded copyrighted content
    if (tempFilePath) {
      try {
        fs.unlinkSync(tempFilePath);
        console.log(`[/api/image-identify] Temp file deleted: ${tempFilePath}`);
      } catch (e) {
        console.error(`[/api/image-identify] Failed to delete temp file: ${e.message}`);
      }
    }
  }
});

export default router;
