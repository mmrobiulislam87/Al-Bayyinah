import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_Bengali } from "next/font/google";

import MainContentErrorBoundary from "@/components/MainContentErrorBoundary";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-bn",
  subsets: ["bengali"],
  weight: ["400", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: "আল কুরআন — অনুসন্ধান ও পাঠ",
    template: "%s · আল কুরআন",
  },
  description:
    "বাংলা, ইংরেজি ও আরবিতে আয়াত অনুসন্ধান (আংশিক/টোকেন মিল, রুট সম্প্রসারণ), রিসার্চ চার্ট, শেখার মডিউল, ভয়েস ডেমো ও হিকমাহ ওয়ালেট — ১১৪ সূরা পাঠ।",
  keywords: [
    "কুরআন",
    "Quran",
    "বাংলা অনুবাদ",
    "অনুসন্ধান",
    "সূরা",
    "আয়াত",
    "Al-Quran",
    "Al-Bayyinah",
    "তিলাওয়াত",
    "রিসার্চ",
  ],
  authors: [{ name: "Al-Bayyinah project" }],
  openGraph: {
    type: "website",
    locale: "bn_BD",
    siteName: "আল কুরআন",
    title: "আল কুরআন — অনুসন্ধান ও পাঠ",
    description:
      "অনুসন্ধান · রিসার্চ · শেখা · ভয়েস · ওয়ালেট — বহুভাষায় কুরআন পড়ুন ও খুঁজুন।",
  },
  twitter: {
    card: "summary_large_image",
    title: "আল কুরআন — অনুসন্ধান ও পাঠ",
    description:
      "অনুসন্ধান · রিসার্চ · শেখা · ভয়েস · ওয়ালেট — বহুভাষায় কুরআন পড়ুন ও খুঁজুন।",
  },
  appleWebApp: {
    capable: true,
    title: "Al Quran",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f4c44" },
    { media: "(prefers-color-scheme: dark)", color: "#0a3832" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoBengali.variable} flex min-h-screen flex-col antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[var(--islamic-teal-deep)] focus:shadow-lg focus:ring-2 focus:ring-[var(--islamic-gold)]"
        >
          মূল কন্টেন্টে যান
        </a>
        <SiteHeader />
        <div id="main-content" className="flex min-h-[100dvh] flex-1 flex-col scroll-mt-0" tabIndex={-1}>
          <MainContentErrorBoundary>{children}</MainContentErrorBoundary>
        </div>
        <SiteFooter />
      </body>
    </html>
  );
}
