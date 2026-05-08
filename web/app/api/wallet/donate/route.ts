import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** সাদাকাহ লেজার স্টাব — ক্লায়েন্টে charityTransferred আপডেট। */
export async function POST(req: Request) {
  let body: { points?: number } = {};
  try {
    body = (await req.json()) as { points?: number };
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }
  const points = Number(body.points ?? 0);
  if (!Number.isFinite(points) || points <= 0) {
    return NextResponse.json({ ok: false, error: "bad_points" }, { status: 400 });
  }
  return NextResponse.json({
    ok: true,
    donated: points,
    message:
      "ডেমো মোড: পয়েন্ট সাদাকাহ হিসেবে চিহ্নিত। প্রোডাকশনে যাচাইকৃত ফান্ড API সংযুক্ত করুন।",
  });
}
