#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
word-corpus.json (Quran.com API v4 Uthmani) থেকে arabicText মিলিয়ে নেয় যাতে
ক্লিকযোগ্য শব্দ ও lookupCorpusForAyahWord একই টোকেন সীমানা ব্যবহার করে।

আগে: arabicText — risan/quran-json; কorpus — quran.com (রূপ/বন্ধন ভিন্ন হতে পারে)।
পরে: arabicText = কorpusের টোকেনগুলো স্পেস দিয়ে যুক্ত।

চালানো (রুট থেকে):
  python scripts/sync_arabic_from_word_corpus.py
  python scripts/split_ayahs_by_surah.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AYAHS_JSON = ROOT / "web" / "public" / "data" / "ayahs.json"
CORPUS_JSON = ROOT / "web" / "public" / "data" / "word-corpus.json"


def rebuild_search_blob(row: dict) -> str:
    parts = [
        row.get("bengaliTransliterationScript") or "",
        row.get("bengaliTranslation") or "",
        row.get("latinTransliteration") or "",
        row.get("englishTranslation") or "",
        row.get("arabicText") or "",
    ]
    return " ".join(p for p in parts if p)


def main() -> int:
    if not AYAHS_JSON.is_file():
        print(f"Missing {AYAHS_JSON}", file=sys.stderr)
        return 1
    if not CORPUS_JSON.is_file():
        print(f"Missing {CORPUS_JSON} — চালান build_word_corpus.py", file=sys.stderr)
        return 1

    with AYAHS_JSON.open(encoding="utf-8") as f:
        rows: list[dict] = json.load(f)
    with CORPUS_JSON.open(encoding="utf-8") as f:
        corpus: dict = json.load(f)
    ayahs_map: dict[str, list] = corpus.get("ayahs") or {}

    missing = 0
    updated = 0
    for row in rows:
        key = f'{int(row["surah"])}:{int(row["ayah"])}'
        wl = ayahs_map.get(key)
        if not wl:
            missing += 1
            continue
        arabic = " ".join((w[0] or "").strip() for w in wl if w and w[0])
        if arabic:
            row["arabicText"] = arabic
            row["_searchText"] = rebuild_search_blob(row)
            updated += 1

    with AYAHS_JSON.open("w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, separators=(",", ":"))

    print(
        f"arabicText synced from corpus: {updated} rows; "
        f"no corpus key for {missing} rows (re-run build_word_corpus if should be 0)."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
