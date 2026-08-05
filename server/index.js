import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import queryRouter from './routes/query.js';
import moodToMemeRouter from './routes/moodToMeme.js';
import reverseSearchRouter from './routes/reverseSearch.js';
import categoriesRouter from './routes/categories.js';
import imageIdentifyRouter from './routes/imageIdentify.js';
import gifRouter from './routes/gif.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api/query', queryRouter);
app.use('/api/mood-to-meme', moodToMemeRouter);
app.use('/api/reverse-search', reverseSearchRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/image-identify', imageIdentifyRouter);
app.use('/api/gif', gifRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bhai server chal raha hai! 🚀' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🔥 Bhai Ye Meme server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   POST /api/query          — Meme explainer`);
  console.log(`   POST /api/mood-to-meme   — Mood → Meme matcher`);
  console.log(`   POST /api/reverse-search — Describe → Identify`);
  console.log(`   POST /api/image-identify — Image upload → Identify`);
  console.log(`   GET  /api/categories     — Category browser`);
  console.log(`   GET  /api/gif?q=...      — GIF proxy`);
  console.log(`   GET  /api/health         — Health check\n`);
});
