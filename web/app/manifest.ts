import type { MetadataRoute } from "next";

/** PWA-লাইট: ইনস্টল/হোম স্ক্রিন রঙ ও নাম। */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "আল কুরআন — অনুসন্ধান ও পাঠ",
    short_name: "Al Quran",
    description:
      "বহুভাষায় আয়াত অনুসন্ধান, রিসার্চ চার্ট, শেখার কর্নার, ভয়েস ডেমো ও আল কুরআন পাঠ।",
    start_url: "/",
    display: "standalone",
    background_color: "#faf6ed",
    theme_color: "#0f4c44",
    lang: "bn",
    dir: "ltr",
  };
}
