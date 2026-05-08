/**
 * bKash Checkout (URL) — সার্ভার-সাইড ক্লায়েন্ট।
 * ক্রেডেনশিয়াল শুধু env থেকে; কোডবেসে হার্ডকোড নয়।
 *
 * @see https://developer.bka.sh/docs/checkout-url-process-overview
 */

const GRANT_PATH = "/tokenized/checkout/token/grant";
const CREATE_PATH = "/tokenized/checkout/create";
const EXECUTE_PATH = "/tokenized/checkout/execute";

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v?.trim()) throw new Error(`missing_env:${name}`);
  return v.trim();
}

/** `.env`-এ `"..."` বা `'...'` থাকলে কিছু রানটাইমে আসলে চারপাশে কোট সহ পড়তে পারে — bKash হেডারে যাবে না। */
function envHeaderValue(name: string): string {
  let v = requireEnv(name);
  if (v.length >= 2) {
    const q0 = v[0];
    const q1 = v[v.length - 1];
    if ((q0 === '"' && q1 === '"') || (q0 === "'" && q1 === "'")) v = v.slice(1, -1).trim();
  }
  return v;
}

function bkashBase(): string {
  return requireEnv("BKASH_BASE_URL").replace(/\/$/, "");
}

export type BkashGrantResponse = {
  statusCode?: string;
  statusMessage?: string;
  id_token?: string;
  token_type?: string;
  expires_in?: number | string;
  refresh_token?: string;
  errorCode?: string;
  errorMessage?: string;
};

export async function bkashGrantToken(): Promise<{ id_token: string } & BkashGrantResponse> {
  const base = bkashBase();
  const username = envHeaderValue("BKASH_USERNAME");
  const password = envHeaderValue("BKASH_PASSWORD");
  const app_key = requireEnv("BKASH_APP_KEY");
  const app_secret = requireEnv("BKASH_APP_SECRET");

  const res = await fetch(`${base}${GRANT_PATH}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      username,
      password,
    },
    body: JSON.stringify({ app_key, app_secret }),
    signal: AbortSignal.timeout(30_000),
  });

  const data = (await res.json()) as BkashGrantResponse;
  /** bKash প্রায়শই 200 দেয় কিন্তু বডিতে errorMessage (যেমন ভুল env-এ app_key) */
  if (!data.id_token) {
    const msg = data.errorMessage ?? data.statusMessage ?? `http_${res.status}`;
    const code = data.errorCode ?? data.statusCode ?? String(res.status);
    throw new Error(`bkash_grant_failed:${code}:${msg}`);
  }
  if (!res.ok) {
    const msg = data.errorMessage ?? data.statusMessage ?? `http_${res.status}`;
    throw new Error(`bkash_grant_failed:${data.errorCode ?? res.status}:${msg}`);
  }
  return data as { id_token: string } & BkashGrantResponse;
}

export type BkashCreatePaymentBody = {
  mode: "0011";
  payerReference: string;
  callbackURL: string;
  amount: string;
  currency: "BDT";
  intent: "sale";
  merchantInvoiceNumber: string;
};

export type BkashCreateResponse = {
  statusCode?: string;
  statusMessage?: string;
  paymentID?: string;
  bkashURL?: string;
  errorCode?: string;
  errorMessage?: string;
  merchantInvoiceNumber?: string;
};

export async function bkashCreatePayment(
  id_token: string,
  body: BkashCreatePaymentBody,
): Promise<BkashCreateResponse> {
  const base = bkashBase();
  const appKey = requireEnv("BKASH_APP_KEY");

  const res = await fetch(`${base}${CREATE_PATH}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: id_token,
      "X-App-Key": appKey,
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30_000),
  });

  const data = (await res.json()) as BkashCreateResponse;
  if (!res.ok || data.statusCode !== "0000" || !data.bkashURL || !data.paymentID) {
    const msg = data.errorMessage ?? data.statusMessage ?? `http_${res.status}`;
    throw new Error(`bkash_create_failed:${data.errorCode ?? res.status}:${msg}`);
  }
  return data;
}

export type BkashExecuteResponse = {
  statusCode?: string;
  statusMessage?: string;
  paymentID?: string;
  trxID?: string;
  transactionStatus?: string;
  amount?: string;
  merchantInvoiceNumber?: string;
  errorCode?: string;
  errorMessage?: string;
};

export async function bkashExecutePayment(
  id_token: string,
  paymentID: string,
): Promise<BkashExecuteResponse> {
  const base = bkashBase();
  const appKey = requireEnv("BKASH_APP_KEY");

  const res = await fetch(`${base}${EXECUTE_PATH}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: id_token,
      "X-App-Key": appKey,
    },
    body: JSON.stringify({ paymentID }),
    signal: AbortSignal.timeout(30_000),
  });

  const data = (await res.json()) as BkashExecuteResponse;
  if (!res.ok || data.statusCode !== "0000") {
    const msg = data.errorMessage ?? data.statusMessage ?? `http_${res.status}`;
    throw new Error(`bkash_execute_failed:${data.errorCode ?? res.status}:${msg}`);
  }
  return data;
}

export function merchantBaseUrl(): string {
  return requireEnv("BKASH_MERCHANT_BASE_URL").replace(/\/$/, "");
}
