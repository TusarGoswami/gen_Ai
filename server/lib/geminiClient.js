import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let genAI = null;
let embeddingModel = null;
let generationModel = null;
let visionModel = null;

if (!GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY not set in .env file');
  console.warn('   Server will start but AI features will not work.');
  console.warn('   Create a .env file in the project root with: GEMINI_API_KEY=your_key_here');
} else {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  // Embedding model
  embeddingModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

  // Generation model
  generationModel = genAI.getGenerativeModel({
    model: 'gemini-3.5-flash',
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  });

  // Vision model (same as generation, but used with image input)
  visionModel = genAI.getGenerativeModel({
    model: 'gemini-3.5-flash',
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 1024,
    },
  });

  console.log('✅ Gemini AI client initialized');
}

/**
 * Embed text using Gemini text-embedding-004
 */
export async function embedText(text) {
  if (!embeddingModel) {
    throw new Error('GEMINI_API_KEY missing in .env file. Please configure your API key to enable AI features.');
  }
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
}

/**
 * Generate a response using Gemini 2.5 Flash
 */
export async function generateResponse(prompt) {
  if (!generationModel) {
    throw new Error('GEMINI_API_KEY missing in .env file. Please configure your API key to enable AI features.');
  }
  const result = await generationModel.generateContent(prompt);
  return result.response.text();
}

/**
 * Identify a meme from an image using Gemini vision
 */
export async function identifyImage(imageBuffer, mimeType = 'image/png') {
  if (!visionModel) {
    throw new Error('GEMINI_API_KEY missing in .env file. Please configure your API key to enable AI features.');
  }
  const imagePart = {
    inlineData: {
      data: imageBuffer.toString('base64'),
      mimeType,
    },
  };

  const prompt = `You are a meme identification expert specializing in Indian internet culture memes.

Look at this image and identify which well-known meme template or format it is.
Consider: the visual layout, any text overlays, character expressions, and the overall format.

Return ONLY a JSON object with these fields:
- "identified_name": the name of the meme template (e.g. "Drake Format", "Distracted Boyfriend", "This Is Fine", "Roll Safe", etc.)
- "confidence": a number from 0 to 1 indicating how confident you are
- "description": a brief description of what you see in the image
- "detected_text": any text you can read in the image

If you cannot identify a known meme template, set identified_name to "unknown" and confidence to 0.

Return ONLY valid JSON, no markdown formatting.`;

  const result = await visionModel.generateContent([prompt, imagePart]);
  const text = result.response.text();

  try {
    // Try to parse as JSON, handling potential markdown code blocks
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      identified_name: 'unknown',
      confidence: 0,
      description: text,
      detected_text: '',
    };
  }
}

export default { embedText, generateResponse, identifyImage };
