#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GitHub — risan/quran-json — থেকে নির্ভরযোগ্য Unicode টেক্সট মিশিয়ে নেয়:
  - quran.json           → arabicText
  - quran_bn.json        → bengaliTranslation (পিডিএফ এক্সট্র্যাক্ট প্রায়ই ভুল/গার্বেজ)
  - quran_en.json        → englishTranslation
  - quran_transliteration.json → latinTransliteration

পিডিএফ-ভিত্তিক bengaliTransliterationScript ফিল্ড খালি করা হয় (কাস্টম ফন্ট মোজিবাক)।

সোর্স: https://github.com/risan/quran-json/tree/main/dist
চালানো: python scripts/merge_arabic_from_github.py
"""

from __future__ import annotations

import json
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
AYAHS_JSON = ROOT / "web" / "public" / "data" / "ayahs.json"
BASE = "https://raw.githubusercontent.com/risan/quran-json/main/dist"


def _load(url: str) -> list:
    with urllib.request.urlopen(url, timeout=180) as resp:
        return json.loads(resp.read().decode("utf-8"))


def verse_maps(
    data: list,
    field: str,
) -> dict[tuple[int, int], str]:
    m: dict[tuple[int, int], str] = {}
    for ch in data:
        sid = int(ch["id"])
        for v in ch["verses"]:
            aid = int(v["id"])
            raw = v.get(field, "")
            m[(sid, aid)] = (raw or "").strip()
    return m


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

    print("Fetching risan/quran-json (ar, bn, en, transliteration)...")
    ar_data = _load(f"{BASE}/quran.json")
    bn_data = _load(f"{BASE}/quran_bn.json")
    en_data = _load(f"{BASE}/quran_en.json")
    tr_data = _load(f"{BASE}/quran_transliteration.json")

    arabic = verse_maps(ar_data, "text")
    bengali = verse_maps(bn_data, "translation")
    english = verse_maps(en_data, "translation")
    latin = verse_maps(tr_data, "transliteration")

    with AYAHS_JSON.open(encoding="utf-8") as f:
        rows: list[dict] = json.load(f)

    miss_ar = miss_bn = miss_en = miss_tr = 0
    for row in rows:
        key = (int(row["surah"]), int(row["ayah"]))
        a = arabic.get(key)
        if a:
            row["arabicText"] = a
        else:
            row.setdefault("arabicText", "")
            miss_ar += 1

        bn = bengali.get(key)
        if bn:
            row["bengaliTranslation"] = bn
        else:
            miss_bn += 1

        en = english.get(key)
        if en:
            row["englishTranslation"] = en
        else:
            miss_en += 1

        tr = latin.get(key)
        if tr:
            row["latinTransliteration"] = tr
        else:
            miss_tr += 1

        row["bengaliTransliterationScript"] = ""
        row["_searchText"] = rebuild_search_blob(row)

    with AYAHS_JSON.open("w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, separators=(",", ":"))

    print(
        f"Updated {len(rows)} rows. Missing: ar={miss_ar} bn={miss_bn} "
        f"en={miss_en} tr={miss_tr}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
