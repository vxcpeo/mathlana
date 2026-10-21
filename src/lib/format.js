/** Number, address and time formatting — matches the reference site's output. */

/** `1,282,404,859` */
export function group(value, fractionDigits = 0) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}

/** Human-scale money: `$3.2K`, `$51.1K`, `$111.7K`, `$1.2M`. */
export function compactUsd(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
  const n = Number(value);
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `$${trim(n / 1_000_000_000)}B`;
  if (abs >= 1_000_000) return `$${trim(n / 1_000_000)}M`;
  if (abs >= 1_000) return `$${trim(n / 1_000)}K`;
  return `$${trim(n)}`;
}

function trim(n) {
  return n.toFixed(1).replace(/\.0$/, "");
}

/**
 * Crypto prices keep more significant digits the smaller they get.
 *
 * The reference rounds token prices to three significant digits and drops
 * trailing zeros: `0.00000346098` -> `$0.00000346`, `0.0001255` -> `$0.000126`,
 * `0.00007204` -> `$0.000072`.
 */
export function priceUsd(value) {
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

/** `20h ago`, `3d ago`, `just now`. */
export function timeAgo(iso, now = Date.now()) {
  if (!iso) return "—";
  const then = typeof iso === "number" ? iso : Date.parse(iso);
  if (Number.isNaN(then)) return "—";
  const seconds = Math.max(0, (now - then) / 1000);
  if (seconds < 45) return "just now";
  const units = [
    ["y", 31_536_000],
    ["mo", 2_592_000],
    ["d", 86_400],
    ["h", 3_600],
    ["m", 60],
  ];
  for (const [suffix, size] of units) {
    if (seconds >= size) return `${Math.floor(seconds / size)}${suffix} ago`;
  }
  return `${Math.floor(seconds)}s ago`;
}

/** `J5XR…bk1p` — wallets are shortened in card headers. */
export function shortAddress(address, lead = 4, tail = 4) {
  if (!address) return "";
  if (address.length <= lead + tail + 1) return address;
  return `${address.slice(0, lead)}…${address.slice(-tail)}`;
}

/** Signed 24h change with the arrow glyphs the site uses. */
export function change24h(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return null;
  const n = Number(value);
  return {
    value: n,
    up: n >= 0,
    arrow: n >= 0 ? "▲" : "▼",
    label: `${Math.abs(n).toFixed(1)}%`,
  };
}

/** `0.094` -> `9.4% to graduation` */
export function curvePercent(curve) {
  if (curve === null || curve === undefined) return null;
  return Math.round(Number(curve) * 1000) / 10;
}
