# Al-Bayyinah — ওয়েব অ্যাপ (`web/`)

Next.js 15 (App Router) ভিত্তিক কুরআন অনুসন্ধান, রিসার্চ, গবেষণাগার, শেখা, ভয়েস ডেমো ও ওয়ালেট মডিউল। রোডম্যাপ: [`ROADMAP.md`](../ROADMAP.md); গবেষণা হাব বিস্তারিত: [`docs/RESEARCH_LAB.md`](../docs/RESEARCH_LAB.md)।

## চালানো

```bash
cd web
npm install
npm run dev
```

ব্রাউজার: [http://localhost:3000](http://localhost:3000)

## মূল পেজ ও API

| পেজ / API | বর্ণনা |
|-----------|--------|
| `/` | গ্লোবাল সার্চ (API + ফলব্যাক), সূরা তালিকা; **`?q=…`** দিলে কোয়েরি প্রিফিল |
| `/surah/[n]` | সূরা পাঠ; আয়াতে «গবেষক নোট» → `/research/lab?m=workspace&v=…` |
| `/juz`, `/hizb` | জুজ / হিযব |
| `/bookmarks` | বুকমার্ক |
| `/research` | ফ্রিকোয়েন্সি চার্ট + টোকেন কনকর্ডেন্স + বাহ্যিক সম্পদ প্যানেল |
| `/research/lab` | গবেষণাগার — অন্টোলজি/মুনাসাবাহ সিড, ক্রোনোলজি, অর্থ-সহায়ক সার্চ UI, ল্যাব নোট |
| `/research/tafsir` | নির্দিষ্ট আয়াত + বহিরাগত তাফসীর/সম্পদ লিঙ্ক (Iframe নয়) |
| `/learn` | আলফাবেট ডেমো, স্ট্রিক, Framer Motion |
| `/tutor` | রেকর্ডিং ও স্পিচ ডেমো |
| `/wallet`, `/donors` | হিকমাহ ওয়ালেট ও ডোনার স্টাব |
| `GET /api/search` | `q`, `mode=partial|exact`, `roots=0|1` |
| `GET /api/research/word-frequency` | `needle` — মক্কী/মাদানী বাকেট |
| `GET /api/research/concordance` | `q`, `mode`, `limit` — টোকেন মিল ও আয়াত সূচী |
| `GET /api/research/meaning-search` | `q`, `mode` — `_searchText` অনুবাদ-ব্লব মিল (ভেক্টর নয়) |
| `POST /api/wallet/redeem`, `/api/wallet/donate` | স্টাব |

## স্ক্রিপ্ট

- `npm run build` — প্রোডাকশন বিল্ড
- `npm run build:corpus` — `word-corpus.json` জেনারেট (রুট থেকে পাইথন)
- `npm run lint` — ESLint

## ডিপ্লয়

[Vercel](https://vercel.com) বা অন্য হোস্টে `web` ফোল্ডার ডিপ্লয় করুন। প্রোডাকশনে `NEXT_PUBLIC_SITE_URL` সেট করলে মেটাডেটা ও sitemap সঠিক বেস URL ব্যবহার করে।
