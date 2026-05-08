import { NextResponse } from "next/server";

import { bkashExecutePayment, bkashGrantToken } from "@/lib/serverBkash";

export const runtime = "nodejs";

/**
 * bKash Checkout (URL) রিটার্ন — সফল হলে One-time Execute।
 * bKash ডক: successCallbackURL সাধারণত `…/callback?…&status=success&paymentID=…`
 *
 * প্রোডাকশনে successCallbackURL-এর signature যাচাই যোগ করুন।
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const status = (url.searchParams.get("status") ?? "").toLowerCase();
  const paymentID = url.searchParams.get("paymentID") ?? "";

  const redirectBase = "/donors";

  if (!paymentID) {
    return NextResponse.redirect(new URL(`${redirectBase}?bkash=missing`, req.url), 302);
  }

  if (status !== "success") {
    return NextResponse.redirect(
      new URL(`${redirectBase}?bkash=${encodeURIComponent(status || "failed")}`, req.url),
      302,
    );
  }

  try {
    const { id_token } = await bkashGrantToken();
    const done = await bkashExecutePayment(id_token, paymentID);
    const trx = done.trxID ?? "";
    const q = new URLSearchParams({ bkash: "ok" });
    if (trx) q.set("trx", trx);
    return NextResponse.redirect(new URL(`${redirectBase}?${q.toString()}`, req.url), 302);
  } catch {
    return NextResponse.redirect(new URL(`${redirectBase}?bkash=execute_error`, req.url), 302);
  }
}
