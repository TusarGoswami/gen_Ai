/**
 * Vector Store Client — loads pre-embedded meme data from JSON
 * and performs cosine similarity search in-memory.
 * No separate ChromaDB server required.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const CHROMA_DB_PATH = path.resolve(__dirname, '..', '..', process.env.CHROMA_DB_PATH || 'chroma_db');
const EMBEDDED_FILE = path.join(CHROMA_DB_PATH, 'embedded_memes.json');

let store = null;

/**
 * Cosine similarity between two vectors.
 */
function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  if (normA === 0 || normB === 0) return 0;
  return dot / (normA * normB);
}

/**
 * Load the embedded memes data from JSON.
 */
function loadStore() {
  if (store && store.length > 0) return store;

  if (!fs.existsSync(EMBEDDED_FILE)) {
    console.warn(`⚠️  Embedded memes file not found at ${EMBEDDED_FILE}`);
    console.warn(`   Run 'python ingestion/ingest.py' first to generate embeddings.`);
    store = [];
    return store;
  }

  try {
    const raw = fs.readFileSync(EMBEDDED_FILE, 'utf-8');
    store = JSON.parse(raw);
    console.log(`✅ Loaded ${store.length} embedded memes from ${EMBEDDED_FILE}`);
    return store;
  } catch (err) {
    console.error(`Error reading ${EMBEDDED_FILE}:`, err.message);
    store = [];
    return store;
  }
}

/**
 * Reload the store (call after re-running ingestion).
 */
export function reloadStore() {
  store = null;
  return loadStore();
}

/**
 * Query by embedding vector — returns top-k most similar entries.
 * @param {number[]} queryEmbedding - The query embedding vector
 * @param {number} nResults - Number of results to return
 * @param {object} whereFilter - Optional metadata filter (e.g. { category: 'Bollywood' })
 * @returns {Array<{ metadata: object, similarity: number, id: string }>}
 */
export function queryByEmbedding(queryEmbedding, nResults = 3, whereFilter = null) {
  const data = loadStore();

  if (data.length === 0) {
    return [];
  }

  // Calculate similarities
  let scored = data.map(entry => ({
    id: entry.id,
    metadata: entry.metadata,
    similarity: cosineSimilarity(queryEmbedding, entry.embedding),
  }));

  // Apply metadata filter if provided
  if (whereFilter) {
    scored = scored.filter(item => {
      return Object.entries(whereFilter).every(([key, val]) => {
        return item.metadata[key] === val;
      });
    });
  }

  // Sort by similarity descending and take top-k
  scored.sort((a, b) => b.similarity - a.similarity);
  return scored.slice(0, nResults);
}

/**
 * Get all entries, optionally filtered by category.
 * @param {string} category - Optional category filter
 * @returns {Array<{ id: string, metadata: object }>}
 */
export function getAllEntries(category = null) {
  const data = loadStore();

  let entries = data.map(entry => ({
    id: entry.id,
    metadata: entry.metadata,
  }));

  if (category) {
    entries = entries.filter(e => e.metadata.category === category);
  }

  return entries;
}

/**
 * Get distinct categories and their counts.
 * @returns {Array<{ name: string, count: number }>}
 */
export function getCategoriesWithCounts() {
  const data = loadStore();
  const counts = {};

  for (const entry of data) {
    const cat = entry.metadata.category || 'Uncategorized';
    counts[cat] = (counts[cat] || 0) + 1;
  }

  return Object.entries(counts).map(([name, count]) => ({ name, count }));
}

/**
 * Get the total count of entries.
 */
export function getEntryCount() {
  const data = loadStore();
  return data.length;
}

export default { queryByEmbedding, getAllEntries, getCategoriesWithCounts, getEntryCount, reloadStore };
