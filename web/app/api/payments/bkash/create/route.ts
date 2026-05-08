import { NextResponse } from "next/server";

import {
  bkashCreatePayment,
  bkashGrantToken,
  merchantBaseUrl,
} from "@/lib/serverBkash";

export const runtime = "nodejs";

const MAX_BDT = 100_000;
const MIN_BDT = 1;

function sanitizeRef(s: string): string {
  return s.replace(/[<&>]/g, "").slice(0, 255);
}

function sanitizeInvoice(s: string): string {
  return s.replace(/[<&>]/g, "").slice(0, 255);
}

/**
 * POST { amount: number | string (BDT), payerReference?: string, merchantInvoiceNumber?: string }
 * → { ok: true, bkashURL, paymentID } অথবা ত্রুটি JSON
 */
export async function POST(req: Request) {
  let body: {
    amount?: number | string;
    payerReference?: string;
    merchantInvoiceNumber?: string;
  } = {};
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const rawAmt = body.amount;
  const n =
    typeof rawAmt === "string"
      ? Number.parseFloat(rawAmt)
      : typeof rawAmt === "number"
        ? rawAmt
        : NaN;
  if (!Number.isFinite(n) || n < MIN_BDT || n > MAX_BDT) {
    return NextResponse.json(
      { ok: false, error: "bad_amount", min: MIN_BDT, max: MAX_BDT },
      { status: 400 },
    );
  }
  /** bKash wants string amount */
  const amount = String(Math.round(n * 100) / 100);

  const payerRef =
    typeof body.payerReference === "string" && body.payerReference.trim()
      ? sanitizeRef(body.payerReference.trim())
      : "guest";
  const invoice =
    typeof body.merchantInvoiceNumber === "string" && body.merchantInvoiceNumber.trim()
      ? sanitizeInvoice(body.merchantInvoiceNumber.trim())
      : `AB-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  try {
    const base = merchantBaseUrl();
    const { id_token } = await bkashGrantToken();
    const created = await bkashCreatePayment(id_token, {
      mode: "0011",
      payerReference: payerRef,
      callbackURL: base,
      amount,
      currency: "BDT",
      intent: "sale",
      merchantInvoiceNumber: invoice,
    });
    return NextResponse.json({
      ok: true,
      bkashURL: created.bkashURL,
      paymentID: created.paymentID,
      merchantInvoiceNumber: created.merchantInvoiceNumber ?? invoice,
    });
  } catch (e) {
    const raw = e instanceof Error ? e.message : "unknown";
    if (raw.startsWith("missing_env:")) {
      return NextResponse.json(
        {
          ok: false,
          error: "missing_config",
          message:
            "সার্ভারে bKash কনফিগ পূর্ণ নয়। `web/.env.example` দেখে `web/.env.local` তৈরি করুন; BKASH_BASE_URL, BKASH_USERNAME, BKASH_PASSWORD, BKASH_APP_KEY, BKASH_APP_SECRET, BKASH_MERCHANT_BASE_URL সব ভরে সেভ করুন, তারপর `npm run dev` আবার চালান।",
          detail: raw,
        },
        { status: 503 },
      );
    }
    return NextResponse.json({ ok: false, error: "bkash_error", message: raw }, { status: 502 });
  }
}
