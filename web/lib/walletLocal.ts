const WALLET_KEY = "albayyinah_wallet_v1";

export type WalletPersist = {
  points: number;
  charityTransferred: number;
};

export function readWallet(): WalletPersist {
  if (typeof window === "undefined") return { points: 0, charityTransferred: 0 };
  try {
    const raw = localStorage.getItem(WALLET_KEY);
    if (!raw) return { points: 0, charityTransferred: 0 };
    const j = JSON.parse(raw) as Partial<WalletPersist>;
    return {
      points: typeof j.points === "number" && j.points >= 0 ? j.points : 0,
      charityTransferred:
        typeof j.charityTransferred === "number" && j.charityTransferred >= 0
          ? j.charityTransferred
          : 0,
    };
  } catch {
    return { points: 0, charityTransferred: 0 };
  }
}

export function writeWallet(w: WalletPersist) {
  localStorage.setItem(WALLET_KEY, JSON.stringify(w));
}

export function addPoints(delta: number): WalletPersist {
  const cur = readWallet();
  const next = {
    ...cur,
    points: Math.max(0, cur.points + delta),
  };
  writeWallet(next);
  return next;
}

export function redeemPoints(amount: number): WalletPersist | null {
  const cur = readWallet();
  if (amount <= 0 || cur.points < amount) return null;
  const next = { ...cur, points: cur.points - amount };
  writeWallet(next);
  return next;
}

export function donatePoints(amount: number): WalletPersist | null {
  const cur = readWallet();
  if (amount <= 0 || cur.points < amount) return null;
  const next = {
    points: cur.points - amount,
    charityTransferred: cur.charityTransferred + amount,
  };
  writeWallet(next);
  return next;
}

/** প্রদর্শন: ১০ পয়েন্ট ≈ ১ একক হাদিয়া (ডেমো স্কেল)। */
export function pointsToGiftUnits(points: number): number {
  return Math.floor(points / 10);
}
