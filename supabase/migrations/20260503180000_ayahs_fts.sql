-- Al-Bayyinah Phase 2.1 scaffold — PostgreSQL full-text (Supabase-compatible).
-- ডাটা সিঙ্ক আলাদা স্ক্রিপ্ট/ইটিএল দিয়ে করতে হবে; এখানে শুধু স্কিমা।

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS ayahs_fts (
  surah SMALLINT NOT NULL,
  ayah SMALLINT NOT NULL,
  search_blob TEXT NOT NULL,
  tsv TSVECTOR,
  PRIMARY KEY (surah, ayah)
);

CREATE INDEX IF NOT EXISTS ayahs_fts_tsv_idx ON ayahs_fts USING GIN (tsv);
CREATE INDEX IF NOT EXISTS ayahs_fts_blob_trgm_idx ON ayahs_fts USING GIN (search_blob gin_trgm_ops);

CREATE OR REPLACE FUNCTION ayahs_fts_tsv_trigger() RETURNS TRIGGER AS $$
BEGIN
  NEW.tsv :=
    setweight(to_tsvector('simple', coalesce(NEW.search_blob, '')), 'A');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ayahs_fts_biu ON ayahs_fts;
CREATE TRIGGER ayahs_fts_biu
  BEFORE INSERT OR UPDATE OF search_blob ON ayahs_fts
  FOR EACH ROW EXECUTE PROCEDURE ayahs_fts_tsv_trigger();

COMMENT ON TABLE ayahs_fts IS 'Full-text row per ayah; populate search_blob from JSON pipeline; optional Arabic analyzer later.';
