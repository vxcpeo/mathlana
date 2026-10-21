/**
 * On-chain program addresses and the constants the website reads from them.
 *
 * The deployed program lives in `<root>/contracts` (Anchor). `MATHLANA_PROGRAM_ID`
 * is the program id declared there in `programs/mathlana/src/lib.rs`.
 */

/** Placeholder until the program is deployed to a cluster. */
export const MATHLANA_PROGRAM_ID =
  "MthLnaQ1aZ8Z7dQ3sVJ7hKj2QyWq6rN4vXbC9pLoP1R";

/** Cluster the interface talks to. */
export const SOLANA_CLUSTER = "mainnet-beta";

export const RPC_ENDPOINT =
  import.meta.env?.VITE_RPC_ENDPOINT ?? "https://api.mainnet-beta.solana.com";

/** PDAs and seeds — kept in sync with the Anchor program. */
export const SEEDS = {
  config: "config",
  challenge: "challenge",
  challengeMetric: "metric",
  tokenRecord: "token",
  pool: "pool",
  portrait: "portrait",
};

/** Launch economics, exactly as the launch page states them. */
export const LAUNCH = {
  /** "Launching costs 0.02 SOL plus Solana's fees, paid by your wallet." */
  feeLamports: 20_000_000,
  feeSol: 0.02,
  /**
   * Of the token's share of every trade's fee, locked on chain:
   * 60% AI/Quantum pool, 20% platform, 20% creator.
   */
  feeShare: {
    aiQuantumPoolBps: 6000,
    platformBps: 2000,
    creatorBps: 2000,
  },
  /** "$1,000 traded → $1.44 to its AI/Quantum pool, $0.48 to you." */
  workedExample: {
    tradedUsd: 1000,
    poolUsd: 1.44,
    creatorUsd: 0.48,
  },
};

/** Pump.fun program the token mints are created through (mints end in `pump`). */
export const PUMP_PROGRAM_ID =
  "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";
