#!/usr/bin/env python3
"""
Quran.com API v4 থেকে প্রতিটি আয়াতের শব্দে-শব্দে Uthmani + বাংলা গজ + ইংরেজি গজ + প্রতিবর্ণ
সংগ্রহ করে web/public/data/word-corpus.json তৈরি করে।

প্রতিটি শব্দ সারি: [text_uthmani, gloss_bn, gloss_en, transliteration]

চালানো (রুট থেকে):
  python scripts/build_word_corpus.py

প্রয়োজন: ইন্টারনেট (API রেট লিমিট এড়াতে অল্প বিরতি)।
"""

from __future__ import annotations

import json
import os
import time
import urllib.error
import urllib.request
from typing import Any

API = "https://api.quran.com/api/v4"
PER_PAGE = 50
SLEEP_SEC = 0.08
OUT_REL = os.path.join("web", "public", "data", "word-corpus.json")


def fetch_json(url: str) -> dict[str, Any]:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Al-Bayyinah Corpus Builder/1.1"},
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def word_only(words: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [w for w in words if w.get("char_type_name") == "word"]


def merge_bn_word_rows(words_bn: list[dict[str, Any]], words_en: list[dict[str, Any]]) -> list[list[str]]:
    """একই আয়াত — bn/en ভাষায় শব্দের সংখ্যা মিলিয়ে জোড়া।"""
    bnw = word_only(words_bn)
    enw = word_only(words_en)
    out: list[list[str]] = []
    for wb, we in zip(bnw, enw):
        t = (wb.get("text_uthmani") or wb.get("text") or "").strip()
        if not t:
            continue
        tr_bn = (wb.get("translation") or {}).get("text") or ""
        tr_en = (we.get("translation") or {}).get("text") or ""
        tl = (wb.get("transliteration") or {}).get("text") or ""
        out.append([t, (tr_bn or "").strip(), (tr_en or "").strip(), (tl or "").strip()])
    return out


def fetch_chapter_verses(chapter: int, language: str) -> list[dict[str, Any]]:
    all_rows: list[dict[str, Any]] = []
    page = 1
    while True:
        qs = (
            f"/verses/by_chapter/{chapter}"
            f"?words=true&word_fields=text_uthmani"
            f"&language={language}"
            f"&per_page={PER_PAGE}&page={page}"
        )
        data = fetch_json(API + qs)
        verses = data.get("verses") or []
        all_rows.extend(verses)
        pag = data.get("pagination") or {}
        next_p = pag.get("next_page")
        if not next_p:
            break
        page = next_p
        time.sleep(SLEEP_SEC)
    return all_rows


def main() -> None:
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    out_path = os.path.join(root, OUT_REL)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    ayahs: dict[str, list[list[str]]] = {}

    for chapter in range(1, 115):
        print(f"chapter {chapter}/114 (bn+en) …", flush=True)
        try:
            verses_bn = fetch_chapter_verses(chapter, "bn")
            time.sleep(SLEEP_SEC)
            verses_en = fetch_chapter_verses(chapter, "en")
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as e:
            raise SystemExit(f"API error at chapter {chapter}: {e}") from e

        en_by_key = {v.get("verse_key"): v for v in verses_en if v.get("verse_key")}

        for v in verses_bn:
            key = v.get("verse_key")
            if not key:
                continue
            ven = en_by_key.get(key)
            if not ven:
                continue
            words_bn = v.get("words") or []
            words_en = ven.get("words") or []
            ayahs[key] = merge_bn_word_rows(words_bn, words_en)

        time.sleep(SLEEP_SEC)

    payload = {
        "v": 2,
        "source": (
            "Quran.com API v4 — verses/by_chapter, words=true, "
            "language=bn (word gloss) + language=en (word gloss) merged; "
            "Uthmani token as in API."
        ),
        "ayahs": ayahs,
    }

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, separators=(",", ":"))

    n_ayah = len(ayahs)
    n_words = sum(len(w) for w in ayahs.values())
    print(f"Wrote {out_path} ({n_ayah} ayat, ~{n_words} tokens)", flush=True)


if __name__ == "__main__":
    main()
