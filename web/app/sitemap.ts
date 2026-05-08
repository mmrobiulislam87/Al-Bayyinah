import type { MetadataRoute } from "next";

function baseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
  return raw.replace(/\/$/, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base = baseUrl();
  const now = new Date();

  const staticPaths = [
    "",
    "/juz",
    "/hizb",
    "/bookmarks",
    "/research",
    "/research/lab",
    "/research/tafsir",
    "/learn",
    "/learn/games",
    "/learn/games/extra-alphabet",
    "/learn/games/ligatures",
    "/tutor",
    "/wallet",
    "/donors",
  ];
  const staticUrls: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: path === "" ? base : `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const surahUrls: MetadataRoute.Sitemap = Array.from({ length: 114 }, (_, i) => ({
    url: `${base}/surah/${i + 1}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticUrls, ...surahUrls];
}
