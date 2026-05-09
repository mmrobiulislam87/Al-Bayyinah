# Al-Bayyinah — Product roadmap

মাস্টার প্ল্যানের টাস্ক ট্র্যাকার। **ইতিমধ্যে রিপোতে যা আছে** vs **পরবর্তী হার্ডেনিং / ইনফ্রা**। পেন্ডিং ও স্ক্যাফোল্ড → প্রোড করণীয় একসাথে দেখতে নিচের **«স্ক্যাফোল্ড থেকে প্রোডাকশন — পেন্ডিং ইমপ্লিমেন্টেশন»** বিভাগটি ব্যবহার করুন।

### স্থায়ী প্রজেক্ট সীমা — হাদিস বর্জিত

**অ্যাপ, ডকুমেন্টেশন, রোডম্যাপ, ডাটা ও কোডবেসে হাদিস অন্তর্ভুক্ত করা হবে না:** হাদিসের উৎস, বর্ণনা, রেফারেন্স/সূত্র, ইনডেক্স বা হাদিসভিত্তিক কোনো ডাটাসেট — অতীত, বর্তমান বা ভবিষ্যতে নয়। এই প্রজেক্ট কোরআনিক পাঠ, অনুবাদ, তাফসীর (গ্রন্থভিত্তিক বহিরাগত লিঙ্ক যেখানে প্রযোজ্য), ভাষাবিজ্ঞান ও অনুসন্ধান-ইনফ্রাতে সীমাবদ্ধ।

---

## সম্পন্ন (বর্তমান রিপো)

### Phase 1 — Corpus ও ডাটা

| কাজ | অবস্থা |
|-----|--------|
| এক্সট্রাকশন/মার্জ স্ক্রিপ্ট | `scripts/*.py` |
| আয়াত JSON | `web/public/data/ayahs.json`, `surah/*.json` |
| শব্দ কorpus | `word-corpus.json`, `scripts/build_word_corpus.py` → `npm run build:corpus` |

### Phase 2 — রিসার্চ ইঞ্জিন

| টাস্ক | অবস্থা |
|--------|--------|
| **২.১** DB FTS | **স্ক্যাফোল্ড:** `supabase/migrations/20260503180000_ayahs_fts.sql` — ডাটা সিঙ্ক ও অ্যাপ-ওয়্যার অংশ আলাদা |
| **২.২** Search API partial/exact | `GET /api/search` — `q`, `mode` (partial / exact), `roots` (0 / 1), `limit`; হোমে টোগল |
| **২.৩** রুট সম্প্রসারণ | কুরেটেড `crossLanguageRoots.ts` + `word-corpus.json` থেকে আরবি প্যাটার্ন মিল → `roots=1` |
| **২.৪** ভিজ্যুয়ালাইজেশন | `GET /api/research/word-frequency?needle=` — `/research` (Recharts); **`ResearchDashboardLazy.tsx`** এ `next/dynamic` + **`ssr: false`** — SSG ওয়ার্নিং/চার্ট হাইড্রেশন ঝুঁকি কমেছে |
| **২.৫** কনকর্ডেন্স + গবেষণাগার হাব | `GET /api/research/concordance` — টোকেন মিল + আয়াত সূচী; **`/research/lab`** — অন্টোলজি/মুনাসাবাহ সিড, ক্রোনোলজি টেবিল, ওয়ার্কস্পেস; `GET /api/research/meaning-search` — `_searchText` অনুবাদ-ব্লব মিল (ভেক্টর নয়) |
| **২.৬** তাফসীর প্রবেশ + ল্যাব নোট | **`/research/tafsir`** — আয়াত + বহিরাগত সম্পদ লিঙ্ক; **`researchWorkspaceLocal.ts`** + সূরা **`AyahBlock`** «গবেষক নোট» → `/research/lab?m=workspace&v=…` |
| **২.৭** ভেক্টর স্ক্যাফোল্ড | **`supabase/migrations/20260506140000_ayah_embedding_pgvector.sql`** — `ayah_embedding_chunks`; এম্বেডিং ইটিএল ও HNSW ইনডেক্স পরে |
| **২.৮** মরফোলজি (ভাষাগত দুই-স্তর) | **`GET /api/research/morphology?q=`** — `crossLanguageRoots` মিল + `web/lib/morphologySemanticLayers.ts`-এ লেক্সিক্যাল ও কোরআনিক-পরিভাষা গ্লোস (BN); `tokenMorphology` QAC/oss ইমপোর্ট পর্যন্ত `not_imported_yet` |

### Phase 3 — গেমিফায়ড লার্নিং

| টাস্ক | অবস্থা |
|--------|--------|
| **৩.১** আলফাবেট ড্র্যাগ-ড্রপ | `/learn` ধাপ ২ — শাফল ব্যাংক, সঠিক মিলে হরফ ব্যাংক থেকে সরানো, **«আবার খেলুন»**, **«এড়িয়ে পরবর্তী»**, জয়ের পর সবুজ বক্সে **পরবর্তী ধাপ** |
| **৩.২** যুক্তবর্ণ + মোশন | `/learn` ধাপ ৩ — Framer Motion স্পষ্ট **উল্লেখ ও ব্যাজ**, stagger + spring, **`لا` বড় স্টেজ**, **«অ্যানিমেশন আবার চালান»** |
| **৩.৩** মাইক্রো-মিশন ও streak | ধাপ ১ — `learningLocal.ts` (**localStorage**); হাইড্রেশন-সেইফ লোড |

### Phase 4 — ভয়েস টিউটর

| টাস্ক | অবস্থা |
|--------|--------|
| **৪.১** রেকর্ডিং | `/tutor` — MediaRecorder + অডিও প্লেব্যাক |
| **৪.২** STT ও তুলনা | Web Speech API + `transcriptCompare.ts` খসড়া স্কোর (**ব্রাউজারভেদে ভিন্ন আচরণ**) |
| **৪.৩** সবুজ/লাল UI | থ্রেশহোল্ড অনুযায়ী |

### Phase 5 — হাদিয়া / সাদাকাহ

| টাস্ক | অবস্থা |
|--------|--------|
| **৫.১** পয়েন্ট লজিক | ডেমো + `walletLocal.ts` (**localStorage**) |
| **৫.২** ওয়ালেট ড্যাশবোর্ড | `/wallet` — হাইড্রেশন-সেইফ |
| **৫.৩** Claim / Donate স্টাব | `POST /api/wallet/redeem`, `POST /api/wallet/donate` |
| **৫.৪** ডোনার পোর্টাল | `/donors` স্টাব |

### প্ল্যাটফর্ম, ডকু, SEO ও রেজিলিয়েন্স

| কাজ | অবস্থা |
|-----|--------|
| মেটাডেটা ও সাইট বিবরণ | `web/app/layout.tsx` |
| Sitemap / ম্যানিফেস্ট | `web/app/sitemap.ts`, `manifest.ts` |
| শীর্ষ/ফুটার | `SiteHeader`, `SiteFooter` |
| README | রুট [`README.md`](README.md), [`web/README.md`](web/README.md) |
| রুট সেগমেন্ট এরর | `web/app/error.tsx` |
| মূল কন্টেন্ট ক্লায়েন্ট এরর বাউন্ডারি | `web/components/MainContentErrorBoundary.tsx` — লেআউটে `{children}` র‍্যাপ (**একক ক্লায়েন্ট কম্পোনেন্ট ক্র্যাশে হেডার/ফুটার জীবিত**) |
| **গবেষণা সম্পদ প্যানেল** | `web/lib/quranResearchResources.ts` — বাহ্যিক কর্পাস/API/তাফসীর রেফারেন্সের কুরেটেড তালিকা + `ResearchResourcesPanel` → `/research` |
| **গবেষণাগার মাস্টার প্ল্যান** | [`docs/RESEARCH_LAB.md`](docs/RESEARCH_LAB.md) — মডিউল ও v0 চালু অংশ |
| **হোম প্রি-ফিল সার্চ** | URL `?q=…` — `HomeClient` প্রথম লোডে কোয়েরি বক্স পূরণ |
| **গ্লোবাল নেভিগেশন** | `SiteHeader` / `SiteFooter` — জুজ, হিযব, বুকমার্ক, রিসার্চ, গবেষণাগার, **তাফসীর হাব** (`/research/tafsir`), শেখা, ভয়েস, ওয়ালেট, ডোনার |
| **প্রোডাকশন বেস URL** | `NEXT_PUBLIC_SITE_URL` — sitemap, `robots.txt`, `metadataBase` (`layout.tsx`); না দিলে ডিফল্ট `localhost:3000` |
| **PWA** | `manifest.ts` — নাম/থিম; **পরবর্তী:** `shortcuts` (হোম, গবেষণাগার, তাফসীর হাব) |

---

## স্ক্যাফোল্ড থেকে প্রোডাকশন — পেন্ডিং ইমপ্লিমেন্টেশন

রিপোতে যে অংশগুলো **স্ক্যাফোল্ড / স্টাব / TODO** — সেগুলো প্রোড ও ট্র্যাফিক স্কেলের আগে ফাংশনাল করতে হবে। নিচে একীভূত চেকলিস্ট; বিস্তারিত `কোরআন গবেষণা`, `হার্ডেনিং` ও `প্রোডাকশন অগ্রাধিকার` বিভাগেও আছে।

### ১. রিসার্চ ও ডাটা পাইপলাইন

| এলাকা | বর্তমান অবস্থা | প্রোড পর্যন্ত করণীয় |
|--------|----------------|----------------------|
| **ভেক্টর এম্বেডিং ও সার্চ** | `20260506140000_ayah_embedding_pgvector.sql` → টেবিল `ayah_embedding_chunks` | এম্বেডিং **ETL** (মডেল/চাঙ্কিং নির্ধারণ), **HNSW** (বা নীতিগত সমতুল্য) ইনডেক্স, অ্যাপ থেকে **রিয়েল সিমেন্টিক সার্চ** API/UI |
| **DB FTS পপুলেশন** | `20260503180000_ayahs_fts.sql` → `ayahs_fts` স্ক্যাফোল্ড | **ETL/সিঙ্ক স্ক্রিপ্ট** দিয়ে `search_blob` / `tsvector` পূরণ; `/api/search`-এ (ধাপে ধাপে) **হাইব্রিড** DB+মেমোরি পথ |
| **মরফোলজি** | **`GET /api/research/morphology?lemma=`** — রিপোতে রুট **এখনও নেই** (পরিকল্পিত) | **QAC** বা সামঞ্জস্যপূর্ণ **OSS** টেবিল ইমপোর্ট → ওই API + UI থেকে রুট/lemma-তে **সব শব্দরূপ** |
| **ডাটা এক্সপোর্ট** | ল্যাব নোট **APA/MLA `.txt`** (v0) | রিসার্চ **সার্চ/ফ্রিকোয়েন্সি** ফলাফল **CSV/JSON** + সূত্র URI; ল্যাব নোটও চাইলে একই ধারায় **বাল্ক এক্সপোর্ট** |

### ২. স্টেট ম্যানেজমেন্ট ও অথেনটিকেশন (লোকাল → ক্লাউড)

**অগ্রাধিকার:** `learningLocal.ts`, `walletLocal.ts`, **`researchWorkspaceLocal.ts`** — বর্তমানে **localStorage**। প্রোডাকশনে **Supabase Auth** বা **NextAuth.js** + PostgreSQL (`user_id`) এ **পার্সিস্ট ও ডিভাইস-টু-ডিভাইস সিঙ্ক**; অফলাইন-ফার্স্ট হলে **মার্জ স্ট্র্যাটেজি** (শেষ-লেখা / সার্ভার উইনস ইত্যাদি) নির্ধারণ।

### ৩. কোর মডিউল আপগ্রেড

| মডিউল | বর্তমান | লক্ষ্য |
|--------|---------|--------|
| **ভয়েস টিউটর (STT)** | Web Speech API — **ব্রাউজারভেদে ভিন্ন আচরণ** | ব্যাকএন্ড **Whisper API** বা সেলফ-হোস্ট; ভবিষ্যতে **আরবি-ফোকাসড / ফাইন-টিউনড** STT |
| **পেমেন্ট ও ওপেন লেজার** | `POST /api/wallet/redeem`, `donate` স্টাব; `/donors` স্টাব | **Stripe**, **SSLCommerz** (বা সমতুল্য) — **রিয়েল** ডোনেশন/রিডিম্পশন; ডোনার ড্যাশে **স্বচ্ছ রিয়েল-টাইম বা নিয়মিত রিফ্রেশ লেজার** |

### ৪. ইনফ্রাস্ট্রাকচার ও হার্ডেনিং

| বিষয় | করণীয় |
|------|--------|
| **PWA** | `manifest.ts`-এ **shortcuts** — হোম, গবেষণা হাব, তাফসীর হাব |
| **টেস্ট ও CI/CD** | Vitest/Jest — ইউনিট/ইন্টিগ্রেশন; **GitHub Actions** (বা অন্য CI) — `tsc`, `lint`, `test` |
| **রেট লিমিট ও সিকিউরিটি** | `/api/search`, `/api/research/*` — বিশেষ ফুল-স্ক্যান রুটে **রেট লিমিট + এজ/অ্যাপ্লিকেশন ক্যাশ** |
| **টুলচেইন (Next)** | বর্তমান স্টাক **Next.js ১৫.x** (`web/package.json`); ভবিষ্যৎ মেজর আপগ্রেডে `next lint` → **ESLint CLI** — আনুষ্ঠানিক **codemod** |

### পরামর্শ — কোরআন-কেন্দ্রিক ভ্যালু-অ্যাড (ভবিষ্যৎ/ঐচ্ছিক)

প্রজেক্ট সীমা (**হাদিস বর্জিত**) ধরে রেখে নিচেরগুলো পরে বিবেচনা করা যেতে পারে।

| ধারণা | নোট |
|--------|------|
| **অফলাইন মোড (Service Worker)** | PWA আছে — লার্নিং মডিউল ও নির্বাচিত সূরা **ক্যাশ** করে অফলাইন পাঠ |
| **গাইডেড অনবোর্ডিং** | ল্যাব, তাফসীর হাব, গেমিফিকেশন — স্টেপ-বাই-স্টেপ ট্যুর (যেমন **react-joyride**-সদৃশ) |
| **a11y এনহান্সমেন্ট** | `/learn` ড্র্যাগ-অ্যান্ড-ড্রপ ও `/tutor` — **কীবোর্ড নেভিগেশন** ও **স্ক্রিন রিডার**; প্রোডের আগে **ফাইন-টিউন** (শুধু “ক্রমাগত অডিট” নয়) |
| **কোলাবোরেটিভ রিসার্চ (দূর ভবিষ্যৎ)** | Auth/ডাটাবেস স্থিত হলে ল্যাব নোট/অ্যানোটেশন **পাবলিক লিংক** দিয়ে শেয়ার (কোরআনিক স্কোপের মধ্যে) |

---

## কোরআন গবেষণা — উপাদান, পদ্ধতি ও অ্যাপ ব্যাকলগ

**দৃষ্টিকোণ:** টেক্সচুয়াল ক্রিটিসিজম, ভাষাবিজ্ঞান, এক্সিজেসিস ও ডিজিটাল হিউম্যানিটিজ একসাথে চায় **নির্ভরযোগ্য প্রাথমিক পাঠ**, **মরফোলজিকাল অ্যানোটেশন**, **বহুস্তরীয় তাফসীর/সহগ্রন্থ লিঙ্ক**, **পুনরুৎপাদনযোগ্য অনুসন্ধান** ও **স্বচ্ছ অ্যাট্রিবিউশন**।

### গবেষণার জন্য প্রয়োজনীয় উপাদান (ডাটা ও সাহিত্য)

| স্তর | বিষয়বস্তু | কেন দরকার |
|------|-----------|-----------|
| **প্রাথমিক পাঠ** | উথমানী ইমলা (ডিফল্ট রাসম), হাফস আন আসিম; ভবিষ্যতে অন্য কিরআত/রাসম | শব্দ গণনা, concordance, রূপগত বিশ্লেষণের একক মানদণ্ড |
| **মরফোলজি** | শব্দ → রুট, lemma, POS, ব্যাকরণ চিহ্ন (যেমন Quranic Arabic Corpus স্টাইল) | রুট-ভিত্তিক সার্চ, শিক্ষামূলক UI, ভুল টোকেনাইজেশন কমানো |
| **লেক্সিকন** | ক্লাসিকাল আরবি অভিধান স্তর (লিসান, লেন, ইত্যাদি — লাইসেন্সভেদ); আধুনিক Buckwalter/CAMeL টুলচেইন | বহু রূপ ও অর্থের বৈজ্ঞানিক ম্যাপিং |
| **তাফসীর** | স্তরবিন্যাসিত মুফাসসির গ্রন্থ ও বৈধ বহিরাগত তাফসীর লিঙ্ক | প্রসংগসচেতন কোরআন পাঠ |
| **অনুবাদ/tafsir বহুস্তর** | ইংরেজি, বাংলা ইত্যাদি — প্রকল্পে Quran.com অনুবাদ স্তর ও বাংলা স্তর | তুলনামূলক পাঠ ও শিক্ষা |

### প্রযুক্তিগত কর্মসূচি (এই রিপোতে যুক্ত/পরিকল্পিত)

| অগ্রাধিকার | কাজ | নোট |
|-------------|-----|-----|
| **✓ রেফারেন্স তালিকা** | বাহ্যিক সম্পদের কুরেটেড তালিকা (`quranResearchResources.ts`) + UI `/research` | লাইসেন্স পণ্যায়নের আগে যাচাই |
| **~✓ আয়াত concordance** | **`GET /api/research/concordance`** — `q`, `mode`, `limit`; UI `/research` | `word-corpus.json`; ভেক্টর লেয়ার আলাদা |
| **~✓ অনুবাদ-ব্লব মিল** | **`GET /api/research/meaning-search`** — `_searchText`; ইংরেজি/বাংলা টোকেন অনুসন্ধান (ভেক্টর নয়) | সার্ভারে `loadAllAyahsServer()` |
| **~✓ মরফোলজি API (দুই স্তর)** | **`GET /api/research/morphology?q=`** — `morphologySemanticLayers.ts`; পূর্ণ টোকেন মরফো এখনো নেই | **উচ্চ** — মরফো ট্যাগ ইমপোর্ট (QAC/oss) → `tokenMorphology`; UI |
| **মাঝারি** | **এক্সপোর্ট** — সার্চ/ফ্রিকোয়েন্সি ফল CSV/JSON + সূত্রের URI; **ল্যাব নোট** `.txt` (APA/MLA খসড়া) চালু | পূর্ণ সার্চ রিজাল্ট CSV/JSON পাইপলাইন TODO |
| **মাঝারি** | **রাসম/হাফস ভিন্নতা** — ডাটা লাইসেন্স সাপেক্ষে টগল বা “অন্য পাঠ দেখুন” লিঙ্ক | Tanzil বহু রূপান্তর নিয়ম মেনে |
| **~✓ তাফসীর প্রবেশ** | **`/research/tafsir`** + সম্পদ প্যানেল; Iframe নয় | গ্রন্থপাঠ লাইসেন্সভেদে লিঙ্ক-অনলি |
| **~✓ ল্যাব নোট (v0)** | **`researchWorkspaceLocal.ts`** — `localStorage`, APA/MLA `.txt` এক্সপোর্ট; সূরা «গবেষক নোট» | পরে অ্যাকাউন্ট সিঙ্ক |
| **ইনফ্রা** | **Supabase `ayahs_fts` পূরণ** + হাইব্রিড সার্চ | রোডম্যাপের DB পথের সাথে মিল |
| **ইনফ্রা** | **`ayah_embedding_chunks` পূরণ** + cosine ইনডেক্স | `20260506140000_ayah_embedding_pgvector.sql` স্ক্যাফোল্ড |

### একাডেমিক স্বচ্ছতা (অবশ্যই)

- প্রতিটি গ্রন্থ ও API-র **লাইসেন্স ও উদ্ধৃতি নিয়ম** মেনে চলা; স্ক্র্যাপিং এড়িয়ে আনুষ্ঠানিক API বা ডাউনলোড প্যাক।
- **কিরআত ও রাসম**-সংক্রান্ত UI-তে নিরপেক্ষ লেবেল ও “এটি পাঠগত পর্যবেক্ষণ” ইত্যাদি স্পষ্টতা।

---

## হার্ডেনিং ও মান উন্নয়ন (পরবর্তী স্প্রিন্টযোগ্য)

কোডবেস অডিট ও প্রোড ঝুঁকি অনুযায়ী — **আলাদা প্রতিশ্রুতি নয়, অগ্রাধিকার তালিকা**।

| এলাকা | কাজ | নোট |
|--------|-----|-----|
| **API** | `/api/search`, `/api/research/*` — রেট লিমিট বা এজ ক্যাশ | `meaning-search` সম্পূর্ণ আয়াত স্ক্যান (মেমোরি ক্যাশ আছে); অপব্যবহার প্রতিরোধ |
| **টেস্ট** | Vitest/Jest — `searchQuery`, `quranConcordance`, `isValidResearchVerseKey`, API রেসপন্স | বর্তমানে অটো টেস্ট ফাইল নেই |
| **CI** | `npx tsc --noEmit` + `npm run lint` + (পরে) `npm test` | GitHub Actions / অন্য CI |
| **বাহ্যিক API** | `GET /api/dictionary` — Wiktionary; **User-Agent** প্রকল্পের আসল URL | সেবার শর্ত মেনে |
| **টুলচেইন** | **Next.js ১৫.x**-এ `next lint`; ভবিষ্যৎ মেজরে ESLint CLI মাইগ্রেশন (`next lint` অপসারণ) — আনুষ্ঠানিক codemod |
| **SEO** | `layout` `description` / `keywords` — গবেষণাগার, ল্যাব, অনুবাদ-সার্চ নীতি (সংক্ষিপ্ত) | অতিরিক্ত কীওয়ার্ড স্টাফিং নয় |

---

## প্রোডাকশন অগ্রাধিকার — বিস্তারিত রোডম্যাপ

নিচের বিভাগগুলো **বর্তমান লোকাল/ডেমো অবস্থা থেকে লাইভ প্রোডাকশন** নিতে পরিকল্পিত কাজ। অর্ডার ও টেক চয়েন প্রজেক্ট স্টেক অনুযায়ী ঠিক করা যাবে।

### ১. অথেনটিকেশন ও ক্লাউড সিঙ্ক (Database & Auth)

| লক্ষ্য | বিস্তারিত |
|--------|-----------|
| **ব্যবহারকারী অ্যাকাউন্ট** | **Supabase Auth** বা **NextAuth.js** (OAuth / ইমেইল ম্যাজিক লিঙ্ক ইত্যাদি) চালু করা। |
| **প্রগ্রেস ও ওয়ার্কস্পেস সিঙ্ক** | `learningLocal.ts`, `walletLocal.ts` ও **`researchWorkspaceLocal.ts`** (গবেষক নোট) — শুধু localStorage নয়; লগইন ইউজারের জন্য **PostgreSQL** (যেমন Supabase) টেবিলে `user_id` অনুযায়ী streak, মিশন ইতিহাস, ওয়ালেট, **ল্যাব নোট** সেভ ও **ডিভাইস জুড়ে সিঙ্ক**। অফলাইন-ফার্স্ট হলে **মার্জ স্ট্র্যাটেজি** (শেষ-লেখা জয়ী বা সার্ভার উইনস) নির্ধারণ। |
| **PostgreSQL FTS** | `ayahs_fts` মাইগ্রেশনের পর **ETL/সিঙ্ক স্ক্রিপ্ট** দিয়ে `search_blob` পূরণ; অ্যাপের `/api/search` ধীরে ধীরে DB `tsvector`/trgm কোয়েরিতে নিতে পারেন। লক্ষ্য: বড় ট্র্যাফিকে ফাস্টার ও কেন্দ্রীয় সার্চ। |

### ২. এআই ভয়েস টিউটর আপগ্রেড (Whisper / উন্নত STT)

| লক্ষ্য | বিস্তারিত |
|--------|-----------|
| **সার্ভার-সাইড STT** | **OpenAI Whisper API** বা সেলফ-হোস্টেড Whisper; আরবি উচ্চারণের জন্য ভবিষ্যতে **আরবি-ফোকাসড মডেল** বা কাস্টম ফাইন-টিউনড STT। |
| **গ্রেডিং** | রেকর্ড করা অডিও → টেক্সট → অরিজিনাল আয়াতের সাথে **নর্মালাইজড তুলনা** + তাজবীদ-সচেতন নিয়ম (ধাপে ধাপে); Web Speech কেবল ফলব্যাক হিসেবে রাখা যেতে পারে। |
| **সিকিউরিটি** | API রুটে রেট লিমিট, ফাইল সাইজ ক্যাপ, ও ইউজার অট গেটেড আপলোড। |

### ৩. পেমেন্ট গেটওয়ে ও ট্রান্সপারেন্ট লেজার

| লক্ষ্য | বিস্তারিত |
|--------|-----------|
| **গ্লোবাল** | **Stripe** (কার্ড, ওয়ালেট যেখানে উপলব্ধ) — ডোনেশন ও গিফট ফান্ড। |
| **লোকাল (বাংলাদেশ ইত্যাদি)** | **SSLCommerz**, **aamarpay**, বা অন্যান্য নিরাপদ ফিনটেক — রেগুলেটরি ও ট্যাক্স বিবেচনায়। |
| **ওপেন লেজার** | ডোনার ড্যাশবোর্ডে **ইনফ্লো / আউটফ্লো** ট্রান্সফার লগ (রিয়েল-টাইম বা নিয়মিত রিফ্রেশ): ফান্ড সংগ্রহ → যাচাইকৃত খাতে বণ্টন → শিক্ষার্থী হাদিয়া রিডিম্পশন। অডিট ট্রেইল ও রিপোর্ট এক্সপোর্ট। |

### ৪. ডিপ মরফোলজি ও NLP

| লক্ষ্য | বিস্তারিত |
|--------|-----------|
| **বর্তমান ভিত্তি** | `crossLanguageRoots.ts` — ভালো শুরু; কুরেটেড ও রক্ষণাবেক্ষণযোগ্য। |
| **ডাইনামিক লেক্সিকন** | **Buckwalter / QMVL** স্টাইল লেক্সিকন ডাটাবেস বা তৃতীয় পক্ষের **Arabic NLP API** — রুট → সম্পূর্ণ ডেরিভেশন ও আয়াত-লেভেল লিঙ্ক। |
| **সার্চ ইন্টিগ্রেশন** | `/api/search` ও রুট এক্সপ্যানশন কোয়েরিতে লেক্সিকন টেবিল ব্যবহার; বহু ভাষায় কোয়েরি → রুট রিসলভ। |

### ৫. পারফরম্যান্স ও UI/UX পলিশ

| লক্ষ্য | বিস্তারিত |
|--------|-----------|
| **Recharts SSR** | `components/ResearchDashboardLazy.tsx` — ক্লায়েন্ট-ওনলি লোড (`ssr: false`)। |
| **এরর বাউন্ডারি** | আপ রাউটার `error.tsx` + **`MainContentErrorBoundary`** (মূল কন্টেন্ট); প্রয়োজনে ভারী ক্লায়েন্ট মডিউলে আরও ক্ষুদ্র বাউন্ডারি। |
| **PWA** | `manifest.ts` — ইনস্টলযোগ্যতা; গবেষণা হাবের দ্রুত `shortcuts`। |
| **অবসারভেবিলিটি** | গবেষণা টেবিল/ট্যাব — কীবোর্ড ও স্ক্রিন রিডার সুস্পষ্ট লেবেল; **`/learn` ড্র্যাগ-ড্রপ** ও **`/tutor` ভয়েস ফ্লো** — প্রোড আগে **ফাইন-টিউন পাস** (ক্রমাগত অডিটের পাশাপাশি)। |

### ৬. ডাটা পাইপলাইন ও ডকুমেন্টেশন

| লক্ষ্য | বিস্তারিত |
|--------|-----------|
| **কর্পাস রিফ্রেশ** | `build:corpus`, `sync:arabic:corpus`, `split_ayahs_by_surah` — ক্রম ও নির্ভরতা এক পৃষ্ঠায় (README বা `docs/DATA.md`)। |
| **`.env.example`** | `web/` বা রুটে — অন্তত `NEXT_PUBLIC_SITE_URL`। |

---

## বিল্ড ও ডেভ টিপস

- **`next build` মাঝে মাঝে ENOENT / PageNotFoundError** দেখালে: `cd web` → **`npm run clean`** → **`npm run build`**।  
- ডেভ: `npm run dev` — [http://localhost:3000](http://localhost:3000)
- প্রোড বিল্ডের আগে **`NEXT_PUBLIC_SITE_URL`** সেট করলে sitemap/OG ঠিক ঠিকানায় থাকে।

---

## Cursor সংক্ষিপ্ত ইংরেজি নির্দেশ

Follow `ROADMAP.md`. **Never add hadith text, references, citations, datasets, or features** — Quran-centric scope only (see ROADMAP “স্থায়ী প্রজেক্ট সীমা”).

**Shipped (high level):** JSON + `GET /api/search` (partial/exact, roots); `/research` (word-frequency, concordance UI, resources panel); **`GET /api/research/concordance`**, **`GET /api/research/meaning-search`** (translation `_searchText` match — not embedding search); **`GET /api/research/morphology?q=`** (cross-root match + lexical vs quranic-register BN gloss layers; token-level morph pending); `/research/lab` (ontology/munasabah seeds, chronology, workspace, tafsir entry); `/research/tafsir`; researcher notes (`researchWorkspaceLocal`, AyahBlock “গবেষক নোট”, `?v=` prefilled); home **`?q=`** search prefilled; Supabase scaffolds **`ayahs_fts`** + **`ayah_embedding_chunks`** (pgvector — ETL/index later); `/learn`, `/tutor`, `/wallet` local demos; `MainContentErrorBoundary`; nav: research lab + tafsir hub; `docs/RESEARCH_LAB.md`.

**Near-term hardening (see roadmap section):** API rate limits/cache for research routes; unit tests + CI (e.g. GitHub Actions); `NEXT_PUBLIC_SITE_URL` in prod; dictionary `User-Agent`; PWA `shortcuts` (home, research hub, tafsir hub); optional `docs/DATA.md` / `.env.example`; Next.js stack is **15.x** today — future major: ESLint CLI codemod when `next lint` is removed.

**Planned depth:** morphology **full token tables** (QAC/OSS import) + richer `morphology` UI; real vector search after `ayah_embedding_chunks` ETL + HNSW; `ayahs_fts` population + hybrid search; cloud sync for `researchWorkspaceLocal` + `learningLocal`/`walletLocal`; rasm/qiraat toggles (license-dependent); full research results CSV/JSON export (search, frequency, lab notes bulk).

**Future value-add (Quran-centric, optional):** service worker offline caching for learning + selected surahs; guided onboarding tour (e.g. joyride-style) for lab/tafsir/learn; a11y hardening for learn D&D and tutor; post-auth public share links for lab notes.

**Production backlog:** Supabase Auth/NextAuth + DB sync replacing local-only stores; populate `ayahs_fts` + embeddings tables; Whisper/STT backend; replace wallet/donor stubs with Stripe + local gateways + transparency ledger.

**Build flake:** `npm run clean` in `web/` before `npm run build`.
