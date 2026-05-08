#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DOC-20260502-WA0059..pdf থেকে আয়াত-ভিত্তিক ডেটা JSON-এ এক্সপোর্ট।
Export per-ayah records from the project PDF into JSON for the web app.

চালানো / Run (repo root):

  pip install pymupdf
  python scripts/extract_quran_pdf.py

আউটপুট / Output: web/public/data/ayahs.json (utf-8)
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

_SCRIPT_DIR = Path(__file__).resolve().parent
if str(_SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(_SCRIPT_DIR))

import fitz  # type: ignore

from surah_ayah_counts import global_index_to_surah_ayah, total_ayahs

# ----------------------------------------------------------------------------
# Path helpers
# ----------------------------------------------------------------------------

ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PDF = ROOT / "DOC-20260502-WA0059..pdf"
OUT_JSON = ROOT / "web" / "public" / "data" / "ayahs.json"


# ----------------------------------------------------------------------------
# Text cleanup & heuristics
# ----------------------------------------------------------------------------

HEADER_PAT = re.compile(
    r"^Avqv‡Zi aiY.*$|^cweÎ †KviAv‡bi AvqvZ.*$|^AvqvZ bs\s*$|^\s*Page No #.*$",
    re.MULTILINE,
)
PAGE_HEADER_INLINE = re.compile(
    r"Avqv‡Zi aiY\s+cweÎ †KviAv‡bi AvqvZ[^\n]*",
)


def strip_headers(blob: str) -> str:
    """Remove repeated running headers from OCR/text blocks."""
    blob = PAGE_HEADER_INLINE.sub("", blob)
    blob = HEADER_PAT.sub("", blob)
    return blob


def _latin_ratio(s: str) -> float:
    if not s:
        return 0.0
    letters = sum(1 for c in s if "a" <= c.lower() <= "z")
    return letters / max(1, len(s))


def _mostly_english_line(s: str) -> bool:
    st = s.strip()
    if not st:
        return False
    if st.isdigit():
        return False
    # সূরা হেডার যেমন: "2 - Al-Baqarah - ..."
    if re.match(r"^\d+\s*-\s*[A-Za-z\\-]", st):
        return True
    if _latin_ratio(st) >= 0.35 and len(st) >= 20:
        return True
    if _latin_ratio(st) >= 0.5:
        return True
    return False


def split_english_and_arabic_tail(tail: str) -> tuple[str, str]:
    """
    Translation-এর পরে সাধারণত প্রথমে ইংরেজি, তারপর আরবি প্রেজেন্টেশন (কাস্টম ফন্ট)।
    """
    lines = [ln.rstrip() for ln in tail.splitlines()]
    en_buf: list[str] = []
    ar_buf: list[str] = []
    phase = "en"
    for ln in lines:
        if not ln.strip():
            continue
        if phase == "en":
            if _mostly_english_line(ln):
                en_buf.append(ln.strip())
                continue
            # ছোট লাইন যা ইংরেজির অংশ হতে পারে
            if len(ln) < 50 and _latin_ratio(ln) >= 0.25 and not ln.strip().isdigit():
                en_buf.append(ln.strip())
                continue
            phase = "ar"
            ar_buf.append(ln.strip())
        else:
            ar_buf.append(ln.strip())
    return " ".join(en_buf).strip(), "\n".join(ar_buf).strip()


def parse_verse_section(section: str) -> dict[str, str] | None:
    """
    একটি আয়াত-ব্লক পার্স করে।
    ক্রম: বাংলা স্ক্রিপ্টে প্রতিবর্ণ → ZiRgv → বাংলা অনুবাদ → ল্যাটিন প্রতিবর্ণ → ইংরেজি → আরবি।
    """
    raw = strip_headers(section).strip()
    if "ZiRgv" not in raw or "Transliteration" not in raw or "Translation" not in raw:
        return None

    z_parts = re.split(r"\n\s*ZiRgv\s*\n", raw, maxsplit=1)
    if len(z_parts) < 2:
        return None
    bn_script_transliteration = z_parts[0].strip()

    rest = z_parts[1]
    # PDF কখনও একই লাইনে \"Transliteration\" + ল্যাটিন টেক্সট রাখে।
    t_parts = re.split(r"\n\s*Transliteration\s+", rest, maxsplit=1)
    if len(t_parts) < 2:
        return None
    bengali_translation = t_parts[0].strip()
    rest2 = t_parts[1]

    tr_parts = re.split(r"\n\s*Translation\s+", rest2, maxsplit=1)
    if len(tr_parts) < 2:
        return None
    latin_transliteration = tr_parts[0].strip()
    tail = tr_parts[1]

    english, arabic_blob = split_english_and_arabic_tail(tail)

    return {
        "bengaliTransliterationScript": bn_script_transliteration,
        "bengaliTranslation": bengali_translation,
        "latinTransliteration": latin_transliteration,
        "englishTranslation": english,
        "arabicPresentationText": arabic_blob,
    }


def extract_all_ayah_texts(doc: fitz.Document) -> list[str]:
    """
    PDF থেকে পেজ ধরে টেক্সট জমা করে ayat মার্কার দিয়ে ভাগ।
    """
    big: list[str] = []
    for i in range(doc.page_count):
        big.append(doc[i].get_text("text"))
    return "\n".join(big).split("cÖwZeY©vqb")


def main() -> int:
    pdf_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PDF
    if not pdf_path.is_file():
        print(f"PDF not found: {pdf_path}", file=sys.stderr)
        return 1

    doc = fitz.open(pdf_path)
    try:
        parts = extract_all_ayah_texts(doc)
    finally:
        doc.close()

    records: list[dict] = []
    for chunk in parts:
        parsed = parse_verse_section(chunk)
        if not parsed:
            continue
        records.append(parsed)

    expected = total_ayahs()
    if len(records) != expected:
        print(
            f"Warning: parsed {len(records)} ayahs, expected {expected}. "
            "Check PDF or parsing rules.",
            file=sys.stderr,
        )

    out_list: list[dict] = []
    for idx, row in enumerate(records, start=1):
        surah, ayah = global_index_to_surah_ayah(idx)
        nid = f"{surah}:{ayah}"
        search_blob = " ".join(
            [
                row["bengaliTransliterationScript"],
                row["bengaliTranslation"],
                row["latinTransliteration"],
                row["englishTranslation"],
            ]
        )
        out_list.append(
            {
                "id": nid,
                "surah": surah,
                "ayah": ayah,
                **row,
                "arabicText": "",
                "_searchText": search_blob,
            }
        )

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    with OUT_JSON.open("w", encoding="utf-8") as f:
        json.dump(out_list, f, ensure_ascii=False, separators=(",", ":"))

    print(f"Wrote {len(out_list)} records → {OUT_JSON}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
