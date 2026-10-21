/**
 * The on-chain side of the website.
 *
 * The IDL in `src/idl/qubitlane.json` is generated from the Anchor program in
 * `<root>/contracts` by `contracts/tools/generate_idl.py` (or by
 * `anchor build`). Everything the site displays — the challenge records, a
 * token's AI/Quantum pool, its agent sessions, the quantum-drawn portrait —
 * is read from the accounts that program owns.
 */
import { AnchorProvider, Program, BN } from "@coral-xyz/anchor";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import idl from "@/idl/qubitlane.json";
import { QUBITLANE_PROGRAM_ID, RPC_ENDPOINT } from "@/data/onchain";

export const PROGRAM_ID = new PublicKey(QUBITLANE_PROGRAM_ID);

/** Read-only connection — the site never asks the visitor for a signature
 *  unless they are launching a token or signing in. */
export function getConnection() {
  return new Connection(RPC_ENDPOINT || clusterApiUrl("mainnet-beta"), "confirmed");
}

/** A provider backed by a public key only, for `view`-style reads. */
export function getReadOnlyProvider(walletPublicKey) {
  const connection = getConnection();
  if (!walletPublicKey) {
    return new AnchorProvider(
      connection,
      {
        publicKey: PublicKey.default,
        signTransaction: async () => {
          throw new Error("Connect a wallet to sign.");
        },
        signAllTransactions: async () => {
          throw new Error("Connect a wallet to sign.");
        },
      },
      { commitment: "confirmed" },
    );
  }
  return new AnchorProvider(
    connection,
    {
      publicKey: walletPublicKey,
      signTransaction: async () => {
        throw new Error("Connect a wallet to sign.");
      },
      signAllTransactions: async () => {
        throw new Error("Connect a wallet to sign.");
      },
    },
    { commitment: "confirmed" },
  );
}

export function getProgram(walletPublicKey = null) {
  return new Program(idl, PROGRAM_ID, getReadOnlyProvider(walletPublicKey));
}

// --------------------------------------------------------------------------
// PDA helpers — identical seeds to the Rust program.
// --------------------------------------------------------------------------

const seed = (text) => Buffer.from(text);

export const configPda = () =>
  PublicKey.findProgramAddressSync([seed("config")], PROGRAM_ID)[0];

export const challengePda = (slug) =>
  PublicKey.findProgramAddressSync([seed("challenge"), seed(slug)], PROGRAM_ID)[0];

export const tokenPda = (mint) =>
  PublicKey.findProgramAddressSync([seed("token"), mint.toBuffer()], PROGRAM_ID)[0];

export const poolPda = (mint) =>
  PublicKey.findProgramAddressSync([seed("pool"), mint.toBuffer()], PROGRAM_ID)[0];

export const portraitPda = (mint) =>
  PublicKey.findProgramAddressSync([seed("portrait"), mint.toBuffer()], PROGRAM_ID)[0];

export const sessionPda = (mint, index) => {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32LE(index);
  return PublicKey.findProgramAddressSync(
    [seed("session"), mint.toBuffer(), buffer],
    PROGRAM_ID,
  )[0];
};

export const resultPda = (challenge, metricIndex, tokenRecord) =>
  PublicKey.findProgramAddressSync(
    [seed("result"), challenge.toBuffer(), Buffer.from([metricIndex]), tokenRecord.toBuffer()],
    PROGRAM_ID,
  )[0];

// --------------------------------------------------------------------------
// Reads
// --------------------------------------------------------------------------

/** Every challenge in the registry, in id order. */
export async function fetchChallenges() {
  const program = getProgram();
  const rows = await program.account.challenge.all();
  return rows
    .map(({ publicKey, account }) => ({ publicKey, ...account }))
    .sort((a, b) => a.id - b.id);
}

export async function fetchChallenge(slug) {
  const program = getProgram();
  try {
    return await program.account.challenge.fetch(challengePda(slug));
  } catch {
    return null;
  }
}

export async function fetchToken(mint) {
  const program = getProgram();
  const key = new PublicKey(mint);
  try {
    const record = await program.account.tokenRecord.fetch(tokenPda(key));
    const pool = await program.account.aiQuantumPool.fetch(poolPda(key)).catch(() => null);
    const portrait = await program.account.portrait.fetch(portraitPda(key)).catch(() => null);
    return { record, pool, portrait };
  } catch {
    return null;
  }
}

/** The tokens working a given challenge. */
export async function fetchTokensForChallenge(challengeKey) {
  const program = getProgram();
  const rows = await program.account.tokenRecord.all([
    {
      memcmp: {
        offset: 8 + 32 + 32, // discriminator + mint + creator
        bytes: challengeKey.toBase58(),
      },
    },
  ]);
  return rows.map(({ publicKey, account }) => ({ publicKey, ...account }));
}

/** The most recent results recorded against a challenge. */
export async function fetchResults(challengeKey) {
  const program = getProgram();
  const rows = await program.account.resultRecord.all([
    {
      memcmp: {
        offset: 8, // discriminator
        bytes: challengeKey.toBase58(),
      },
    },
  ]);
  return rows
    .map(({ publicKey, account }) => ({ publicKey, ...account }))
    .sort((a, b) => b.recordedAt - a.recordedAt);
}

// --------------------------------------------------------------------------
// Score formatting — the metrics store integers scaled by 10^decimals.
// --------------------------------------------------------------------------

/** 6815n with 2 decimals -> "68.15" */
export function formatMetric(value, decimals = 0) {
  const raw = typeof value === "bigint" ? value : BigInt(value?.toString?.() ?? value ?? 0);
  if (decimals <= 0) return raw.toLocaleString("en-US");
  const negative = raw < 0n;
  const abs = negative ? -raw : raw;
  const divisor = 10n ** BigInt(decimals);
  const whole = abs / divisor;
  const fraction = (abs % divisor).toString().padStart(decimals, "0");
  return `${negative ? "-" : ""}${whole.toLocaleString("en-US")}.${fraction}`;
}

/** How far a record has moved from its baseline, as a percentage. */
export function improvementPercent(record, baseline, direction = "lower") {
  const r = Number(record?.toString?.() ?? record ?? 0);
  const b = Number(baseline?.toString?.() ?? baseline ?? 0);
  if (!b) return null;
  return direction === "lower" ? (1 - r / b) * 100 : (r / b) * 100;
}

export { BN };
