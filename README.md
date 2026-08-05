# Bhai Ye Meme Kyu Funny Hai? 😂 (`gen_Ai-Meme_Decoder`)

> RAG-powered Indian internet culture meme explainer — Hinglish mein, AI ke saath!

Repository: [https://github.com/TusarGoswami/gen_Ai-Meme_Decoder](https://github.com/TusarGoswami/gen_Ai-Meme_Decoder)

A full-stack web app that explains Indian memes using a retrieval-augmented generation (RAG) pipeline with Gemini AI and ChromaDB.

## Features

- 💬 **Pucho Bhai** — Ask about any Indian meme in Hinglish or English
- 🎭 **Mood → Meme** — Describe your mood, get the perfect matching meme
- 🔍 **Reverse Search** — Describe what a meme looks like, we'll identify it
- 📷 **Image Upload** — Upload a meme screenshot, AI identifies it
- 📂 **Category Browser** — Browse memes by category (Instagram, Bollywood, Cricket, etc.)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express.js |
| Vector DB | ChromaDB (local, persistent) |
| Embeddings | Gemini `text-embedding-004` |
| Generation | Gemini 2.5 Flash |
| Ingestion | Python 3.11 |
| GIFs | Giphy API |

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)
- **Giphy API Key** (optional) from [Giphy Developers](https://developers.giphy.com/)

## Setup

### 1. Clone and install dependencies

```bash
# Install root dependencies (concurrently)
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..

# Create Python virtual environment for ingestion
cd ingestion
python -m venv .venv

# Activate venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
cd ..
```

### 2. Set up environment variables

```bash
# Copy the example and fill in your keys
cp .env.example .env
```

Edit `.env` and add your `GEMINI_API_KEY` (required) and `GIPHY_API_KEY` (optional).

### 3. Run the ingestion pipeline

```bash
cd ingestion

# Activate venv if not already active
# Windows:
.venv\Scripts\activate

python ingest.py
```

This reads `data/memes.json`, generates embeddings via Gemini, and stores them in ChromaDB at `chroma_db/`.

### 4. Start the development servers

```bash
# From the project root
npm run dev
```

This starts both:
- **Frontend** (Vite) on `http://localhost:5173`
- **Backend** (Express) on `http://localhost:3001`

The frontend proxies `/api/*` requests to the backend automatically.

## Project Structure

```
bhai-ye-meme/
├── client/                  # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/      # MemeCard, CategoryGrid, UploadBox, ChatInput, etc.
│   │   ├── App.jsx          # Main app with tab navigation
│   │   └── index.css        # Design system
│   └── index.html
├── server/                  # Express backend
│   ├── routes/              # API route handlers
│   │   ├── query.js         # Main meme explainer
│   │   ├── moodToMeme.js    # Mood → Meme matcher
│   │   ├── reverseSearch.js # Describe → Identify
│   │   ├── imageIdentify.js # Image upload → Identify
│   │   ├── categories.js    # Category browser
│   │   └── gif.js           # Giphy proxy
│   ├── lib/                 # Shared utilities
│   │   ├── geminiClient.js  # Gemini AI helpers
│   │   ├── chromaClient.js  # ChromaDB connection
│   │   └── prompts.js       # System prompts
│   └── index.js             # Express entry point
├── ingestion/               # Python ingestion pipeline
│   ├── data/memes.json      # Seed meme entries
│   ├── ingest.py            # Embedding + ChromaDB ingestion
│   └── requirements.txt
├── chroma_db/               # Persistent vector store (gitignored)
├── .env.example             # Environment variables template
└── README.md
```

## Adding More Memes

1. Add entries to `ingestion/data/memes.json` following the schema
2. Re-run `python ingest.py` — it upserts by ID, so existing entries are updated safely
3. The app will immediately reflect the new entries

## Content Rules

- Only well-known, widely recognized memes
- Clean, readable Hinglish — no invented slang
- No copyrighted images stored — only Giphy API for GIFs
- Neutral, factual treatment of political memes
- No harmful stereotypes
- Verified origins only (`origin_verified: true/false`)
