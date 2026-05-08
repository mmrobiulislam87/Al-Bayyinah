/** কুরআন একটি আয়াতের রেকর্ড — পিডিএফ এক্সট্র্যাক্টর আউটপুটের সাথে সুরেখ। */
export type AyahRecord = {
  id: string;
  surah: number;
  ayah: number;
  bengaliTransliterationScript: string;
  bengaliTranslation: string;
  latinTransliteration: string;
  englishTranslation: string;
  /** পিডিএফ ফন্ট থেকে — প্রায়ই প্রকৃত আরবি নয়; রেফারেন্স। */
  arabicPresentationText: string;
  /** risan/quran-json (গিটহাব) থেকে মিশিয়ে — Uthmani-স্টাইল Unicode আরবি। */
  arabicText?: string;
  _searchText: string;
};
