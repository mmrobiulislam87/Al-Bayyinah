-- Al-Bayyinah — pgvector স্ক্যাফোল্ড (সিমান্টিক সার্চ / এম্বেডিং ইটিএল-পূর্ববর্তী)।
-- Supabase: প্রজেক্টে Vector এক্সটেনশন সক্রিয় থাকতে হবে (ড্যাশবোর্ড বা এক্সটেনশন মেনু)।
-- এম্বেডিং মাত্রা পরিবর্তিত হলে কলাম টাইপ ও ইনডেক্স পুনরায় সাজান।

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS ayah_embedding_chunks (
  id BIGSERIAL PRIMARY KEY,
  surah SMALLINT NOT NULL CHECK (surah >= 1 AND surah <= 114),
  ayah SMALLINT NOT NULL CHECK (ayah >= 1),
  layer TEXT NOT NULL DEFAULT 'translation_en',
  chunk_index SMALLINT NOT NULL DEFAULT 0,
  content TEXT NOT NULL,
  embedding vector(1536),
  model_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (surah, ayah, layer, chunk_index)
);

CREATE INDEX IF NOT EXISTS ayah_embedding_chunks_layer_idx
  ON ayah_embedding_chunks (layer);

CREATE INDEX IF NOT EXISTS ayah_embedding_chunks_surah_ayah_idx
  ON ayah_embedding_chunks (surah, ayah);

COMMENT ON TABLE ayah_embedding_chunks IS
  'আয়াত চ্যাঙ্ক + এম্বেডিং; 1536 = সাধারণ OpenAI-সদৃশ মাত্রা। ডাটা পূরণের পর HNSW/IVFFlat ইনডেক্স যোগ করুন।';

COMMENT ON COLUMN ayah_embedding_chunks.layer IS
  'যেমন: translation_en, translation_bn, arabic_uthmani — ইটিএলে স্পষ্ট নাম।';

COMMENT ON COLUMN ayah_embedding_chunks.embedding IS
  'কোসাইন সার্চের জন্য vector_cosine_ops / লাক্ষণিক: CREATE INDEX ... USING hnsw (embedding vector_cosine_ops);';
