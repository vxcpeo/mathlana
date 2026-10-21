/**
 * Per-mint snapshot used by `/t/:mint` when the live pool endpoint is not
 * reachable — the same role `token.fallback` plays for market numbers.
 *
 * `pool` is the state of the token's AI/Quantum pool as last observed on the
 * reference site; `stakes` is the copy of the challenge track the token works
 * on. Both degrade to zeroes / the token's own fields.
 */

const ZERO_POOL = {
  /** Fees already credited to the pool. */
  paidInUsd: 0,
  /** What the agent and the quantum runs have spent so far. */
  spentUsd: 0,
  /** Fees the token's trades earned that are not collected yet. */
  collectedUsd: 0,
  /** Still missing before the first session can start. */
  neededUsd: 0,
  /** Share of the first session's cost already credited to the pool (0-100). */
  progressPct: 0,
  /** Trading volume the first session needs. */
  firstSessionAfterTradedUsd: 0,
  /** Trading volume so far. */
  tradedUsd: 0,
};

const SNAPSHOTS = {
  "47X58Wy6mCEW9w5uxedBHJbL14Ryh6TCngMDAjr5M6no": {
    description: "sword cat generated using real Quantum computer, via Qubitlane.si",
    pool: {
      paidInUsd: 1.52,
      spentUsd: 0,
      collectedUsd: 1.52,
      neededUsd: 5.7,
      progressPct: 0,
      firstSessionAfterTradedUsd: 3958,
      tradedUsd: 0,
    },
    stakes: {
      label: "Defend, attacker's side",
      note: "The attacker's side: no safe radius gives more than 116.13 bits",
    },
  },
};

/** The shape every mint falls back to. */
export function snapshotFor(mint) {
  const found = SNAPSHOTS[mint];
  return (
    found ?? {
      description: null,
      pool: ZERO_POOL,
      stakes: null,
    }
  );
}

/** `$1.52`, and `$0.00` rather than `$0`. */
export function usd(value) {
  const n = Number(value ?? 0);
  if (Number.isNaN(n)) return "$0.00";
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/** `$3,958` — round money, no cents. */
export function usdRound(value) {
  const n = Number(value ?? 0);
  if (Number.isNaN(n)) return "$0";
  return `$${Math.round(n).toLocaleString("en-US")}`;
}
