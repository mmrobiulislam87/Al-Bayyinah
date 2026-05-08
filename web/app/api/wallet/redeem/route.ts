import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** বাস্তব লেজার পরে DB; এখন শুধু সার্ভার নিশ্চিতকরণ স্টাব। */
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
    redeemed: points,
    message: "লোকাল ওয়ালেটে পয়েন্ট কাটা হয়েছে। পরবর্তীতে সাপাবেসে লেজার সংযুক্ত করুন।",
  });
}
