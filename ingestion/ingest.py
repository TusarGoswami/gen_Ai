"""
Bhai Ye Meme Kyu Funny Hai? — Ingestion Pipeline
Reads memes.json, embeds each entry with Gemini, and saves the embedded data.
Outputs:
  1. chroma_db/embedded_memes.json — JSON file with embeddings for the Express server
  2. ChromaDB collection (if a ChromaDB server is running, optional)
"""

import json
import os
import sys
import time

# Ensure UTF-8 output formatting for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

import google.generativeai as genai
from dotenv import load_dotenv

# Load .env from project root
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
CHROMA_DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'chroma_db')
DATA_PATH = os.path.join(os.path.dirname(__file__), 'data', 'memes.json')
OUTPUT_PATH = os.path.join(CHROMA_DB_PATH, 'embedded_memes.json')
EMBEDDING_MODEL = 'models/gemini-embedding-001'


def build_embedding_text(entry: dict) -> str:
    """Build the text string used for embedding from a meme entry."""
    parts = [
        entry.get('name', ''),
        ' '.join(entry.get('aliases', [])),
        entry.get('meaning', ''),
        entry.get('used_when', ''),
        entry.get('visual_description', ''),
    ]
    return ' | '.join(part for part in parts if part)


def cosine_similarity(a, b):
    """Compute cosine similarity between two vectors."""
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = sum(x ** 2 for x in a) ** 0.5
    norm_b = sum(x ** 2 for x in b) ** 0.5
    if norm_a == 0 or norm_b == 0:
        return 0
    return dot / (norm_a * norm_b)


def main():
    if not GEMINI_API_KEY:
        print("ERROR: GEMINI_API_KEY not set. Create a .env file in the project root.")
        print("Example: GEMINI_API_KEY=your_key_here")
        sys.exit(1)

    # Configure Gemini
    genai.configure(api_key=GEMINI_API_KEY)

    # Load meme data
    print(f"📂 Loading meme data from {DATA_PATH}...")
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        memes = json.load(f)
    print(f"   Found {len(memes)} meme entries.")

    # Ensure output directory exists
    os.makedirs(CHROMA_DB_PATH, exist_ok=True)

    # Load existing embedded data (for upsert support)
    existing = {}
    if os.path.exists(OUTPUT_PATH):
        with open(OUTPUT_PATH, 'r', encoding='utf-8') as f:
            existing_list = json.load(f)
            for item in existing_list:
                existing[item['id']] = item
        print(f"   Loaded {len(existing)} existing embedded entries (will upsert).")

    # Process each meme
    results = []
    success_count = 0
    skipped_count = 0
    error_count = 0

    for i, meme in enumerate(memes):
        meme_id = meme['id']
        meme_name = meme['name']
        print(f"\n[{i+1}/{len(memes)}] Processing: {meme_name} ({meme_id})")

        # Build embedding text
        embed_text = build_embedding_text(meme)

        # Check if we already have this entry with the same data
        if meme_id in existing:
            existing_entry = existing[meme_id]
            if existing_entry.get('embed_text') == embed_text and existing_entry.get('embedding'):
                print(f"   ⏭️  Skipping (already embedded, no changes)")
                results.append(existing_entry)
                skipped_count += 1
                continue

        print(f"   📝 Embedding text: {embed_text[:80]}...")

        try:
            # Generate embedding via Gemini
            result = genai.embed_content(
                model=EMBEDDING_MODEL,
                content=embed_text,
            )
            embedding = result['embedding']
            print(f"   ✅ Embedding generated: {len(embedding)} dimensions")

            # Build output entry
            entry = {
                'id': meme_id,
                'embed_text': embed_text,
                'embedding': embedding,
                'metadata': {
                    'name': meme['name'],
                    'aliases': meme.get('aliases', []),
                    'category': meme.get('category', ''),
                    'origin': meme.get('origin', ''),
                    'origin_verified': meme.get('origin_verified', False),
                    'meaning': meme.get('meaning', ''),
                    'emotion': meme.get('emotion', ''),
                    'popularity': meme.get('popularity', 3),
                    'used_when': meme.get('used_when', ''),
                    'visual_description': meme.get('visual_description', ''),
                    'example': meme.get('example', ''),
                    'gif_query': meme.get('gif_query', ''),
                    'notes': meme.get('notes', ''),
                },
            }
            results.append(entry)
            success_count += 1

        except Exception as e:
            print(f"   ❌ ERROR: {e}")
            # Keep existing entry if available
            if meme_id in existing:
                results.append(existing[meme_id])
            error_count += 1

        # Rate limiting — be gentle with the API
        if i < len(memes) - 1:
            time.sleep(0.5)

    # Save embedded data
    print(f"\n💾 Saving {len(results)} entries to {OUTPUT_PATH}...")
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    print(f"\n{'='*50}")
    print(f"🎉 Ingestion complete!")
    print(f"   ✅ Newly embedded: {success_count}")
    print(f"   ⏭️  Skipped (unchanged): {skipped_count}")
    print(f"   ❌ Errors: {error_count}")
    print(f"   📊 Total entries saved: {len(results)}")
    print(f"   📁 Output: {OUTPUT_PATH}")
    print(f"{'='*50}")


if __name__ == '__main__':
    main()
