/**
 * Formatting helpers the token pages need on top of `@/lib/format`.
 *
 * `lib/format.priceUsd` keeps four significant digits; the reference rounds
 * token prices to three ("$0.00000346", "$0.000072") and drops trailing
 * zeros, so the token surfaces use this instead.
 */

/** `0.00000346098` -> `$0.00000346`; `0.00007204` -> `$0.000072` */
export function priceLabel(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
  const n = Number(value);
  if (n === 0) return "$0";
  if (Math.abs(n) >= 1) return `$${n.toFixed(2)}`;
  const [mantissa, exponent] = n.toExponential(2).split("e");
  const power = Number(exponent);
  const decimals = Math.min(18, Math.max(0, 2 - power));
  const fixed = (Number(mantissa) * 10 ** power).toFixed(decimals);
  const trimmed = fixed.includes(".") ? fixed.replace(/0+$/, "").replace(/\.$/, "") : fixed;
  return `$${trimmed}`;
}

/** `3` -> `3 tokens`, `1` -> `1 token`. */
export function tokenCount(n) {
  return `${Number(n).toLocaleString("en-US")} ${n === 1 ? "token" : "tokens"}`;
}

/** A mint's short label: `sL9D…pump`. */
export function mintLabel(mint, lead = 4, tail = 4) {
  if (!mint) return "";
  if (mint.length <= lead + tail + 1) return mint;
  return `${mint.slice(0, lead)}…${mint.slice(-tail)}`;
}
