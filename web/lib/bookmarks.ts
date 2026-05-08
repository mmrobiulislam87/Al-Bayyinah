/** লোকাল স্টোরেজ কী। */
const STORAGE_KEY = "al-bayyinah-bookmarks-v1";

export type BookmarkEntry = {
  id: string;
  surah: number;
  ayah: number;
  at: number;
};

function safeParse(raw: string | null): BookmarkEntry[] {
  if (!raw) return [];
  try {
    const j = JSON.parse(raw) as BookmarkEntry[];
    return Array.isArray(j) ? j : [];
  } catch {
    return [];
  }
}

/** সকল বুকমার্ক (নতুন প্রথমে)। */
export function getBookmarks(): BookmarkEntry[] {
  if (typeof window === "undefined") return [];
  return safeParse(localStorage.getItem(STORAGE_KEY)).sort(
    (a, b) => b.at - a.at,
  );
}

/** Toggle: থাকলে সরান, না থাকলে যোগ করুন। সক্রিয় হলে true। */
export function toggleBookmark(entry: Omit<BookmarkEntry, "at">): boolean {
  const list = getBookmarks();
  const i = list.findIndex((x) => x.id === entry.id);
  if (i >= 0) {
    list.splice(i, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return false;
  }
  const next: BookmarkEntry = {
    ...entry,
    at: Date.now(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([next, ...list]));
  return true;
}

export function isBookmarked(id: string): boolean {
  return getBookmarks().some((x) => x.id === id);
}

export function removeBookmark(id: string): void {
  const list = getBookmarks().filter((x) => x.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}
