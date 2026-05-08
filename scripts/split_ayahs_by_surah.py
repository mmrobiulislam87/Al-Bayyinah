#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
ayahs.json → web/public/data/surah/1..114.json + search-index.json

search-index: গ্লোবাল ক্রমে {_সূরা ক্রম} lightweight ইনডেক্স (s,a,t,id) —
ফ্লেক্সসার্চের পর পূর্ণ আয়াত পেতে পার-সূরা JSON ফেচ।

চালানো: python scripts/split_ayahs_by_surah.py
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AYAHS = ROOT / "web" / "public" / "data" / "ayahs.json"
OUT_DIR = ROOT / "web" / "public" / "data" / "surah"


def main() -> int:
    if not AYAHS.is_file():
        raise SystemExit(f"Missing {AYAHS}")

    with AYAHS.open(encoding="utf-8") as f:
        rows: list[dict] = json.load(f)

    by_surah: dict[int, list[dict]] = {i: [] for i in range(1, 115)}
    for r in rows:
        by_surah[int(r["surah"])].append(r)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for s in range(1, 115):
        verses = sorted(by_surah[s], key=lambda x: int(x["ayah"]))
        p = OUT_DIR / f"{s}.json"
        with p.open("w", encoding="utf-8") as f:
            json.dump(verses, f, ensure_ascii=False, separators=(",", ":"))

    # গ্লোবাল ক্রম = বর্তমান ayahs.json ক্রম (ইতিমধ্যে সূরা-ক্রমিক)
    search_index = [
        {
            "id": r["id"],
            "s": int(r["surah"]),
            "a": int(r["ayah"]),
            "t": r.get("_searchText") or "",
        }
        for r in rows
    ]
    si_path = ROOT / "web" / "public" / "data" / "search-index.json"
    with si_path.open("w", encoding="utf-8") as f:
        json.dump(search_index, f, ensure_ascii=False, separators=(",", ":"))

    print(f"Wrote {len(rows)} ayahs -> surah/*.json + search-index ({len(search_index)})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
