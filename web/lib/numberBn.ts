/** ইংরেজি অঙ্ককে বাংলা অঙ্কে রূপান্তর (উইকিলুক টাইপোগ্রাফি)। */
const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBengaliDigits(n: number): string {
  return String(n)
    .split("")
    .map((ch) => (/^\d$/.test(ch) ? BN_DIGITS[Number(ch)]! : ch))
    .join("");
}
