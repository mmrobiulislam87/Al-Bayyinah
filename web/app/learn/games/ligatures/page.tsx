import type { Metadata } from "next";

import LigaturesGalleryClient from "@/components/LigaturesGalleryClient";

export const metadata: Metadata = {
  title: "যুক্তবর্ণ গ্যালারি",
};

export default function LigaturesPage() {
  return <LigaturesGalleryClient />;
}
